<template>
    <Header/>
    
  <div class="checkout-page">
    <div class="container py-5">
      <h2 class="mb-4">{{ $t('checkout.title') }}</h2>

      <!-- Checkout Steps -->
      <div class="checkout-steps mb-4">
        <div class="step" :class="{ active: currentStep === 1 }">
          1. {{ $t('checkout.reviewCart') }}
        </div>
        <div class="step" :class="{ active: currentStep === 2 }">
          2. {{ $t('checkout.shippingInfo') }}
        </div>
        <div class="step" :class="{ active: currentStep === 3 }">
          3. {{ $t('checkout.payment') }}
        </div>
      </div>

      <!-- Step 1: Cart Review -->
      <div v-if="currentStep === 1" class="cart-review">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title mb-4">{{ $t('checkout.cartItems') }}</h3>
            <div v-if="cartItems.length" class="cart-items">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <img :src="getProductImage(item)" :alt="item.product.name_en" class="item-image" />
                <div class="item-details">
                  <h5>{{ currentLang === 'ar' ? item.product.name_ar : item.product.name_en }}</h5>
                  <p class="text-muted">{{ $t('checkout.quantity') }}: {{ item.quantity }}</p>
                  <p class="price">{{ item.price }} {{ currentLang === 'ar' ? item.currency.name_ar : item.currency.name_en }}</p>
                </div>
              </div>
              <div class="cart-summary mt-4">
                <div class="d-flex justify-content-between">
                  <span>{{ $t('checkout.subtotal') }}:</span>
                  <span>{{ totalCartValue }} {{ cartItems[0]?.currency?.name_en }}</span>
                </div>
                <div class="d-flex justify-content-between mt-2">
                  <span>{{ $t('checkout.shipping') }}:</span>
                  <span>{{ shippingCost }} {{ cartItems[0]?.currency?.name_en }}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold">
                  <span>{{ $t('checkout.total') }}:</span>
                  <span>{{ calculateTotal }} {{ cartItems[0]?.currency?.name_en }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <p>{{ $t('checkout.emptyCart') }}</p>
              <router-link to="/products" class="btn btn-primary">{{ $t('checkout.continueShopping') }}</router-link>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between mt-4">
          <router-link to="/products" class="btn btn-outline-secondary">{{ $t('checkout.back') }}</router-link>
          <button @click="nextStep" class="btn btn-primary" :disabled="!cartItems.length">{{ $t('checkout.next') }}</button>
        </div>
      </div>

      <!-- Step 2: Shipping Information -->
      <div v-if="currentStep === 2" class="shipping-info">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title mb-4">{{ $t('checkout.shippingDetails') }}</h3>
            <form @submit.prevent="submitShippingInfo" class="shipping-form">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('checkout.fullName') }}</label>
                  <input v-model="shippingInfo.fullName" type="text" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('checkout.phone') }}</label>
                  <input v-model="shippingInfo.phone" type="tel" class="form-control" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">{{ $t('checkout.email') }}</label>
                <input v-model="shippingInfo.email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">{{ $t('checkout.address') }}</label>
                <textarea v-model="shippingInfo.address" class="form-control" rows="3" required></textarea>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('checkout.city') }}</label>
                  <input v-model="shippingInfo.city" type="text" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('checkout.postalCode') }}</label>
                  <input v-model="shippingInfo.postalCode" type="text" class="form-control" required />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="d-flex justify-content-between mt-4">
          <button @click="previousStep" class="btn btn-outline-secondary">{{ $t('checkout.back') }}</button>
          <button @click="nextStep" class="btn btn-primary">{{ $t('checkout.next') }}</button>
        </div>
      </div>

      <!-- Step 3: Payment -->
      <div v-if="currentStep === 3" class="payment-info">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title mb-4">{{ $t('checkout.paymentMethod') }}</h3>
            <div class="payment-methods">
              <div class="form-check mb-3">
                <input class="form-check-input" type="radio" v-model="paymentMethod" value="card" id="card" />
                <label class="form-check-label" for="card">
                  {{ $t('checkout.creditCard') }}
                </label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="radio" v-model="paymentMethod" value="cash" id="cash" />
                <label class="form-check-label" for="cash">
                  {{ $t('checkout.cashOnDelivery') }}
                </label>
              </div>
            </div>

            <!-- Credit Card Form -->
            <div v-if="paymentMethod === 'card'" class="card-details mt-4">
              <div class="mb-3">
                <label class="form-label">{{ $t('checkout.cardNumber') }}</label>
                <input v-model="cardInfo.number" type="text" class="form-control" required />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('checkout.expiryDate') }}</label>
                  <input v-model="cardInfo.expiry" type="text" class="form-control" placeholder="MM/YY" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('checkout.cvv') }}</label>
                  <input v-model="cardInfo.cvv" type="text" class="form-control" required />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between mt-4">
          <button @click="previousStep" class="btn btn-outline-secondary">{{ $t('checkout.back') }}</button>
          <button @click="placeOrder" class="btn btn-primary">{{ $t('checkout.placeOrder') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/store/index.js';
import Header from '@/components/Website/Header.vue'

export default {
  name: 'Checkout',
  components: {
    Header,
  },
  data() {
    return {
      currentStep: 1,
      cartItems: [],
      shippingCost: 10,
      shippingInfo: {
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postalCode: ''
      },
      paymentMethod: 'card',
      cardInfo: {
        number: '',
        expiry: '',
        cvv: ''
      }
    };
  },
  computed: {
    currentLang() {
      return localStorage.getItem('lang') || 'en';
    },
    totalCartValue() {
      return this.cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
      }, 0).toFixed(2);
    },
    calculateTotal() {
      return (parseFloat(this.totalCartValue) + this.shippingCost).toFixed(2);
    }
  },
  created() {
    this.fetchCartItems();
  },
  methods: {
    getProductImage(item) {
      return item.images && item.images.length > 0
        ? `${API_URL}/${item.images[0].path}`
        : 'path/to/default-image.jpg';
    },
    async fetchCartItems() {
      try {
        const response = await axios.get(`${API_URL}/api/cart-items`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
        });
        this.cartItems = response.data.data.original.data;
      } catch (error) {
        console.error('Error fetching cart items:', error);
        this.$toast.error(this.$t('checkout.errorFetchingCart'));
      }
    },
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    async placeOrder() {
      try {
        const orderData = {
          shipping_info: this.shippingInfo,
          payment_method: this.paymentMethod,
          card_info: this.paymentMethod === 'card' ? this.cardInfo : null
        };

        const response = await axios.post(`${API_URL}/api/orders`, orderData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
        });

        this.$toast.success(this.$t('checkout.orderSuccess'));
        this.$router.push('/orders');
      } catch (error) {
        console.error('Error placing order:', error);
        this.$toast.error(this.$t('checkout.errorPlacingOrder'));
      }
    }
  }
};
</script>

<style scoped>
.checkout-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.checkout-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step {
  flex: 1;
  text-align: center;
  padding: 1rem;
  color: #6c757d;
  position: relative;
}

.step.active {
  color: #8b6b3d;
  font-weight: 600;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 100%;
  height: 2px;
  background: #dee2e6;
  transform: translateY(-50%);
  z-index: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1rem;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
}

.item-details {
  flex: 1;
}

.price {
  color: #8b6b3d;
  font-weight: 600;
  margin: 0;
}

.cart-summary {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.shipping-form {
  max-width: 800px;
  margin: 0 auto;
}

.payment-methods {
  max-width: 400px;
}

.card-details {
  max-width: 500px;
}

.btn-primary {
  background-color: #8b6b3d;
  border-color: #8b6b3d;
}

.btn-primary:hover {
  background-color: #725932;
  border-color: #725932;
}

.btn-outline-secondary:hover {
  color: #8b6b3d;
  border-color: #8b6b3d;
  background-color: transparent;
}

@media (max-width: 768px) {
  .checkout-steps {
    flex-direction: column;
    gap: 1rem;
  }

  .step:not(:last-child)::after {
    display: none;
  }

  .cart-item {
    flex-direction: column;
    text-align: center;
  }

  .item-image {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>