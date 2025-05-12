<template>
  <Header />
  <div class="checkout-container">
    <!-- Progress Stepper -->
    <div class="stepper">
      <div class="step" :class="{ active: step >= 1, completed: step > 1 }">
        <div class="step-number">1</div>
        <div class="step-label">{{ $t('checkout.cart') }}</div>
      </div>
      <div class="step-line" :class="{ active: step > 1 }"></div>
      <div class="step" :class="{ active: step >= 2, completed: step > 2 }">
        <div class="step-number">2</div>
        <div class="step-label">{{ $t('checkout.shipping') }}</div>
      </div>
      <div class="step-line" :class="{ active: step > 2 }"></div>
      <div class="step" :class="{ active: step >= 3 }">
        <div class="step-number">3</div>
        <div class="step-label">{{ $t('checkout.payment') }}</div>
      </div>
    </div>

    <!-- Cart Review Step -->
    <div v-if="step === 1" class="checkout-step">
      <h2>{{ $t('checkout.reviewCart') }}</h2>
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="getProductImage(item)" :alt="item.product.name_en" class="item-image">
          <div class="item-details">
            <h3>{{ currentLang === 'ar' ? item.product.name_ar : item.product.name_en }}</h3>
            <p class="item-price">{{ item.price }} {{ currentLang === 'ar' ? item.currency.name_ar :
              item.currency.name_en }}</p>
            <div class="quantity-controls">
              <button @click="updateQuantity(item, -1)" :disabled="item.quantity <= 1">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="updateQuantity(item, 1)">+</button>
            </div>
          </div>
          <button class="remove-item" @click="removeItem(item.id)">
            <fa icon="trash" />
          </button>
        </div>
      </div>
      <div class="cart-summary">
        <div class="summary-row">
          <span>{{ $t('checkout.subtotal') }}</span>
          <span>{{ subtotal }} {{ currency }}</span>
        </div>
        <div class="summary-row">
          <span>{{ $t('checkout.shipping') }}</span>
          <span>{{ shippingCost }} {{ currency }}</span>
        </div>
        <div class="summary-row total">
          <span>{{ $t('checkout.total') }}</span>
          <span>{{ total }} {{ currency }}</span>
        </div>
      </div>
      <button class="btn-primary" @click="nextStep" :disabled="!cartItems.length">
        {{ $t('checkout.continueToShipping') }}
      </button>
    </div>

    <!-- Shipping Details Step -->
    <div v-if="step === 2" class="checkout-step">
      <h2>{{ $t('checkout.shippingDetails') }}</h2>
      <form @submit.prevent="nextStep" class="shipping-form">
        <div class="form-group">
          <label for="fullName">{{ $t('checkout.fullName') }}</label>
          <input type="text" id="fullName" v-model="shippingDetails.fullName" required>
        </div>
        <div class="form-group">
          <label for="address">{{ $t('checkout.address') }}</label>
          <textarea id="address" v-model="shippingDetails.address" required></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="city">{{ $t('checkout.city') }}</label>
            <input type="text" id="city" v-model="shippingDetails.city" required>
          </div>
          <div class="form-group">
            <label for="postalCode">{{ $t('checkout.postalCode') }}</label>
            <input type="text" id="postalCode" v-model="shippingDetails.postalCode" required>
          </div>
        </div>
        <div class="form-group">
          <label for="phone">{{ $t('checkout.phone') }}</label>
          <input type="tel" id="phone" v-model="shippingDetails.phone" required>
        </div>
        <div class="form-group">
          <label for="buildingName">{{ $t('checkout.buildingName') }}</label>
          <input type="text" id="buildingName" v-model="shippingDetails.buildingName" required>
        </div>
        <div class="form-group">
          <label for="floorNumber">{{ $t('checkout.floorNumber') }}</label>
          <input type="text" id="floorNumber" v-model="shippingDetails.floorNumber" required>
        </div>
        <div class="form-group">
          <label for="apartmentNumber">{{ $t('checkout.apartmentNumber') }}</label>
          <input type="text" id="apartmentNumber" v-model="shippingDetails.apartmentNumber" required>
        </div>
        <div class="form-group">
          <label for="landmark">{{ $t('checkout.landmark') }}</label>
          <input type="text" id="landmark" v-model="shippingDetails.landmark" required>
        </div>
        <div class="form-group">
          <label for="street">{{ $t('checkout.street') }}</label>
          <input type="text" id="street" v-model="shippingDetails.street" required>
        </div>
        <div class="form-group">
          <label for="country">{{ $t('checkout.country') }}</label>
          <input type="text" id="country" v-model="shippingDetails.country" required>
        </div>
        <div class="button-group">
          <button type="button" class="btn-secondary" @click="previousStep">
            {{ $t('checkout.back') }}
          </button>
          <button type="submit" class="btn-primary">
            {{ $t('checkout.continueToPayment') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Payment Step -->
    <div v-if="step === 3" class="checkout-step">
      <h2>{{ $t('checkout.payment') }}</h2>
      <div class="payment-methods">
        <div v-for="method in paymentMethods" :key="method.id" class="payment-method"
          :class="{ active: selectedPaymentMethod === method.id }" @click="selectedPaymentMethod = method.id">
          <fa :icon="method.icon" />
          <span>{{ method.name }}</span>
        </div>
      </div>
      
      <!-- Stripe Card Element (shows only when Stripe is selected) -->
      <div v-if="selectedPaymentMethod === 1" class="stripe-container">
        <div class="card-element-container">
          <div id="card-element" class="card-element"></div>
          <div id="card-errors" class="card-errors" role="alert"></div>
        </div>
      </div>

      <div class="order-summary">
        <h3>{{ $t('checkout.orderSummary') }}</h3>
        <div class="summary-details">
          <p>{{ cartItems.length }} {{ $t('checkout.items') }}</p>
          <p>{{ $t('checkout.deliveryTo') }}: {{ shippingDetails.city }}</p>
          <div class="total-amount">
            {{ $t('checkout.totalAmount') }}: {{ total }} {{ currency }}
          </div>
        </div>
      </div>
      <div class="button-group">
        <button class="btn-secondary" @click="previousStep">
          {{ $t('checkout.back') }}
        </button>
        <button class="btn-primary" @click="placeOrder" :disabled="!selectedPaymentMethod || stripeLoading">
          <span v-if="stripeLoading">{{ $t('checkout.processing') }}...</span>
          <span v-else>{{ $t('checkout.placeOrder') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/store/index.js';
import axios from 'axios';
import Header from "@/components/Website/Header.vue";
import { loadStripe } from '@stripe/stripe-js';

export default {
  name: 'Checkout',
  components: {
    Header
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
        phone: ''
      },
      selectedPaymentMethod: null,
      paymentMethods: [
        { id: 1, name: 'Stripe', icon: 'credit-card' },
        { id: 2, name: 'Tabby', icon: 'credit-card-alt' },
        { id: 3, name: 'Cash on Delivery', icon: 'money-bill' }
      ],
      stripeLoading: false,
      tabbyLoading: false,
      shippingCost: 10,
      stripePromise: null,
      stripeClientSecret: null,
      stripeElements: null,
      cardElement: null
    };
  },
  computed: {
    currentLang() {
      return localStorage.getItem('lang') || 'en';
    },
    currency() {
      return this.cartItems.length > 0 ?
        (this.currentLang === 'ar' ? this.cartItems[0].currency.name_ar : this.cartItems[0].currency.name_en) : '';
    },
    subtotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
      }, 0).toFixed(2);
    },
    total() {
      return (parseFloat(this.subtotal) + this.shippingCost).toFixed(2);
    }
  },
  created() {
    this.fetchCartItems();
    // Initialize Stripe
    this.stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key');
  },
  
  mounted() {
    // If Stripe is already selected on mount, initialize elements
    if (this.selectedPaymentMethod === 1) {
      this.$nextTick(() => {
        this.initStripeElements();
      });
    }
  },
  
  watch: {
    selectedPaymentMethod(newValue) {
      if (newValue === 1) {
        // Initialize Stripe Elements when Stripe is selected
        this.$nextTick(() => {
          this.initStripeElements();
        });
      }
    }
  },
  methods: {
    getProductImage(item) {
      if (item.images && Array.isArray(item.images)) {
        return `${API_URL}/${item.images[0]}`;
      }
      return `${API_URL}/images/default.jpg`;
    },
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
    async updateQuantity(item, change) {
      const newQuantity = item.quantity + change;

      if (newQuantity < 1) {
        this.$toast.warning(this.$t('checkout.minimumQuantity'));
        return;
      }

      try {
        const response = await axios.post(`${API_URL}/api/cart-items/${item.id}`, {
          quantity: newQuantity
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.success) {
          const updatedItem = response.data.data;

          // Update quantity and price from response or fallback
          item.quantity = updatedItem.quantity ?? newQuantity;
          item.price = updatedItem.price ?? item.price;

          this.$toast.success(this.$t('checkout.quantityUpdated'));

          // Trigger reactivity to update DOM immediately
          this.cartItems = [...this.cartItems];
        } else {
          const errorMessage = response.data?.message || this.$t('checkout.errorUpdatingQuantity');
          this.$toast.error(errorMessage);
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
        const errorMessage = error.response?.data?.message || this.$t('checkout.errorUpdatingQuantity');
        this.$toast.error(errorMessage);
      }
    },

    async removeItem(itemId) {
      try {
        await axios.delete(`${API_URL}/api/cart-items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.$toast.success(this.$t('checkout.itemRemoved'));
      } catch (error) {
        console.error('Error removing item:', error);
        this.$toast.error(this.$t('checkout.errorRemovingItem'));
      }
    },
    nextStep() {
      if (this.step < 3) this.step++;
    },
    previousStep() {
      if (this.step > 1) this.step--;
    },
    // Initialize Stripe Elements
    async initStripeElements() {
      if (!document.getElementById('card-element')) return;
      
      const stripe = await this.stripePromise;
      this.stripeElements = stripe.elements();
      
      // Create card element
      const cardElement = this.stripeElements.create('card', {
        style: {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      });
      
      // Mount the card element
      cardElement.mount('#card-element');
      
      // Handle real-time validation errors
      cardElement.on('change', (event) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });
      
      this.cardElement = cardElement;
    },
    
    async placeOrder() {
      try {
        // Handle different payment methods
        if (this.selectedPaymentMethod === 1) { // Stripe
          this.stripeLoading = true;
          try {
            // Create payment intent with Stripe
            const paymentIntentResponse = await axios.post(`${API_URL}/api/payment/stripe/create-intent`, {
              amount: this.total,
              currency: 'usd',
              items: this.cartItems.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.price
              }))
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
              }
            });
            
            // Get the client secret from the response
            this.stripeClientSecret = paymentIntentResponse.data.clientSecret;
            
            // Load Stripe.js
            const stripe = await this.stripePromise;
            
            // Use Stripe Elements to confirm the payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(this.stripeClientSecret, {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  name: this.shippingDetails.fullName,
                  email: localStorage.getItem('user_email') || '',
                  address: {
                    line1: this.shippingDetails.address,
                    city: this.shippingDetails.city,
                    postal_code: this.shippingDetails.postalCode,
                    country: this.shippingDetails.country || 'US'
                  }
                }
              }
            });
            
            if (error) {
              throw new Error(error.message);
            }
            
            if (paymentIntent && paymentIntent.status === 'succeeded') {
              this.$toast.success(this.$t('checkout.paymentProcessed'));
            } else {
              throw new Error(this.$t('checkout.paymentNotCompleted'));
            }
          } catch (stripeError) {
            if (stripeError) {
              console.error('Stripe payment error:', stripeError);
              this.$toast.error(stripeError.message || this.$t('checkout.errorProcessingPayment'));
              return; // Stop execution if payment fails
            }
          } finally {
            this.stripeLoading = false;
          }
          
        } else if (this.selectedPaymentMethod === 2) { // Tabby
          this.tabbyLoading = true;
          // Initialize Tabby payment
          const tabbyResponse = await axios.post(`${API_URL}/api/payment/tabby/create-session`, {
            amount: this.total,
            items: this.cartItems.map(item => ({
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.price
            })),
            shipping: this.shippingDetails
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          
          // Redirect to Tabby checkout or handle the response
          this.tabbyLoading = false;
          this.$toast.success(this.$t('checkout.redirectingToTabby'));
          
          // In a real implementation, you would redirect to Tabby's checkout page
          // window.location.href = tabbyResponse.data.redirectUrl;
          
        } else if (this.selectedPaymentMethod === 3) { // Cash on Delivery
          // Process Cash on Delivery order
        }
        
        // Create the order in your system
        const orderData = {
          shipping_details: this.shippingDetails,
          payment_method: this.selectedPaymentMethod,
          items: this.cartItems.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.price
          }))
        };

        try {
          const orderResponse = await axios.post(`${API_URL}/api/orders`, orderData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (orderResponse && orderResponse.data && orderResponse.data.success) {
            this.$toast.success(this.$t('checkout.orderPlaced'));
            this.$router.push('/orders');
          } else {
            throw new Error(this.$t('checkout.errorPlacingOrder'));
          }
        } catch (orderError) {
          console.error('Error placing order:', orderError);
          this.$toast.error(orderError.message || this.$t('checkout.errorPlacingOrder'));
        }
      } catch (error) {
        console.error('Error placing order:', error);
        this.$toast.error(this.$t('checkout.errorPlacingOrder'));
        this.stripeLoading = false;
        this.tabbyLoading = false;
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

.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #8b6b3d;
}

.step.completed .step-number {
  background-color: #4CAF50;
}

.step-line {
  width: 100px;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 1rem;
  transition: all 0.3s ease;
}

.step-line.active {
  background-color: #8b6b3d;
}

.checkout-step {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.cart-items {
  margin: 2rem 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  position: relative;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
}

.item-details {
  flex-grow: 1;
}

.item-details h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.item-price {
  color: #8b6b3d;
  font-weight: bold;
  margin: 0.5rem 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #8b6b3d;
  background: transparent;
  color: #8b6b3d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-controls button:hover {
  background: #8b6b3d;
  color: #fff;
}

.remove-item {
  background: transparent;
  border: none;
  color: #ff4757;
  cursor: pointer;
  padding: 0.5rem;
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.cart-summary {
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.summary-row.total {
  border-top: 1px solid #dee2e6;
  margin-top: 1rem;
  padding-top: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.shipping-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #8b6b3d;
  outline: none;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.payment-method {
  padding: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.payment-method.active {
  border-color: #8b6b3d;
  background: #fff;
}

.order-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: bold;
  color: #8b6b3d;
  margin-top: 1rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #8b6b3d;
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background: #725932;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #8b6b3d;
  color: #8b6b3d;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

/* Stripe Elements Styles */
.stripe-container {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.card-element-container {
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: white;
}

.card-element {
  padding: 10px;
  min-height: 40px;
}

.card-errors {
  color: #fa755a;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .stepper {
    flex-direction: column;
    gap: 1rem;
  }

  .step-line {
    width: 2px;
    height: 30px;
  }

  .form-row {
    flex-direction: column;
  }

  .button-group {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>