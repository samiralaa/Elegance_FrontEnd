<template>
  <Header />
  <div class="checkout-container">
    <CheckoutStepper :step="step" />

    <!-- Cart Review Step -->
    <CartReview
      v-if="step === 1"
      :cart-items="cartItems"
      :shipping-cost="shippingCost"
      @next-step="nextStep"
      @update-cart="updateCart"
    />

    <!-- Shipping Details Step -->
    <ShippingDetails
      v-if="step === 2"
      v-model="shippingDetails"
      @next-step="nextStep"
      @previous-step="previousStep"
    />

    <!-- Payment Step -->
    <PaymentStep
      v-if="step === 3"
      :cart-items="cartItems"
      :shipping-details="shippingDetails"
      :total="total"
      :currency="currency"
      @previous-step="previousStep"
      @order-placed="handleOrderPlaced"
    />
  </div>
</template>

<script>
import { API_URL } from '@/store/index.js';
import axios from 'axios';
import Header from "@/components/Website/Header.vue";
import CheckoutStepper from "@/components/Website/Checkout/CheckoutStepper.vue";
import CartReview from "@/components/Website/Checkout/CartReview.vue";
import ShippingDetails from "@/components/Website/Checkout/ShippingDetails.vue";
import PaymentStep from "@/components/Website/Checkout/PaymentStep.vue";

export default {
  name: 'Checkout',
  components: {
    Header,
    CheckoutStepper,
    CartReview,
    ShippingDetails,
    PaymentStep
  },
  data() {
    return {
      step: 1,
      cartItems: [],
      shippingDetails: {
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        buildingName: '',
        floorNumber: '',
        apartmentNumber: '',
        landmark: '',
        street: '',
        country: ''
      },
      shippingCost: 10
    };
  },
  computed: {
    currentLang() {
      return localStorage.getItem('lang') || 'en';
    },
    currency() {
      if (this.cartItems.length > 0) {
        // Prefer code if available
        if (this.cartItems[0].currency.code) {
          return this.cartItems[0].currency.code.toLowerCase();
        }
        // Fallback: map name to code
        const name = (this.currentLang === 'ar' ? this.cartItems[0].currency.name_ar : this.cartItems[0].currency.name_en).toLowerCase();
        const map = {
          'us dollar': 'usd',
          'usd': 'usd',
          'british pound': 'gbp',
          'gbp': 'gbp',
          'euro': 'eur',
          'eur': 'eur',
          'درهم إماراتي': 'aed',
          'aed': 'aed',
          'جنيه مصري': 'egp',
          'egp': 'egp',
          // Add more as needed
        };
        return map[name] || 'usd';
      }
      return 'usd';
    },
    total() {
      const subtotal = this.cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
      }, 0);
      return (subtotal + this.shippingCost).toFixed(2);
    }
  },
  created() {
    this.fetchCartItems();
  },
  methods: {
    async fetchCartItems() {
      try {
        const response = await axios.get(`${API_URL}/api/cart-items`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.cartItems = response.data.data.original.data;
      } catch (error) {
        console.error('Error fetching cart items:', error);
        this.$toast.error(this.$t('checkout.errorFetchingCart'));
      }
    },
    updateCart(items) {
      this.cartItems = items;
    },
    nextStep() {
      if (this.step < 3) this.step++;
    },
    previousStep() {
      if (this.step > 1) this.step--;
    },
    async handleOrderPlaced() {
      const orderData = {
        payment_method: this.cartItems[0].payment_method || 'paypal',
        user_id: localStorage.getItem('user_id'),
        order: {
          status: 'pending',
          payment_method: this.selectedPaymentMethod === 1 ? 'stripe' : 'cash',
          shipping_address: `${this.shippingDetails.street}, ${this.shippingDetails.city}, ${this.shippingDetails.country}`
        },
        items: this.cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      try {
        const response = await axios.post(`${API_URL}/api/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.$router.push('/order-confirmation');
      } catch (error) {
        console.error('Error placing order:', error);
        this.$toast.error(this.$t('checkout.errorPlacingOrder'));
      }
    }
  }
};
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>