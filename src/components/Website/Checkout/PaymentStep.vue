<template>
  <div class="checkout-step">
    <h2>{{ $t('checkout.payment') }}</h2>
    <div class="payment-methods">
      <div v-for="method in paymentMethods" :key="method.id" class="payment-method"
        :class="{ active: selectedPaymentMethod === method.id }" @click="selectPaymentMethod(method.id)">
        <fa :icon="method.icon" />
        <span>{{ method.name }}</span>
      </div>
    </div>

    <!-- Stripe Card Element -->
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
      <button class="btn-secondary" @click="$emit('previous-step')">
        {{ $t('checkout.back') }}
      </button>
      <button class="btn-primary" @click="placeOrder" :disabled="!selectedPaymentMethod || loading">
        <span v-if="loading">{{ $t('checkout.processing') }}...</span>
        <span v-else>{{ $t('checkout.placeOrder') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/store/index.js';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

export default {
  name: 'PaymentStep',
  props: {
    cartItems: {
      type: Array,
      required: true
    },
    shippingDetails: {
      type: Object,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedPaymentMethod: null,
      paymentMethods: [
        { id: 1, name: 'Stripe', icon: 'credit-card' },
        { id: 2, name: 'Tabby', icon: 'credit-card-alt' },
        { id: 3, name: 'Cash on Delivery', icon: 'money-bill' }
      ],
      loading: false,
      stripePromise: null,
      stripeClientSecret: null,
      stripeElements: null,
      cardElement: null
    };
  },
  created() {
    this.stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key');
  },
  watch: {
    selectedPaymentMethod(newValue) {
      if (newValue === 1) {
        this.$nextTick(() => {
          this.initStripeElements();
        });
      }
    }
  },
  methods: {
    selectPaymentMethod(methodId) {
      this.selectedPaymentMethod = methodId;
    },
    async initStripeElements() {
      if (!document.getElementById('card-element')) return;
      const stripe = await this.stripePromise;
      this.stripeElements = stripe.elements();
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
      cardElement.mount('#card-element');
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
        this.loading = true;
        // Validate addressId
        if (!this.shippingDetails.addressId) {
          this.$toast.error('The address id field is required.');
          this.loading = false;
          return;
        }

        // Safely get user ID from localStorage
        let userId;
        try {
          const authUser = localStorage.getItem('auth_user');
          if (authUser) {
            const parsedUser = JSON.parse(authUser);
            userId = parsedUser?.id;
          }
        } catch (e) {
          console.error('Error parsing auth_user:', e);
          this.$toast.error('Error getting user information');
          this.loading = false;
          return;
        }

        if (!userId) {
          this.$toast.error('User authentication required');
          this.loading = false;
          return;
        }

        // Calculate total price from items
        const totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Validate cart items
        if (!Array.isArray(this.cartItems) || this.cartItems.length === 0) {
          this.$toast.error('No items in cart');
          this.loading = false;
          return;
        }

        const orderData = {
          user_id: userId,
          order: {
            status: 'pending',
            payment_method: String(this.selectedPaymentMethod === 1 ? 'stripe' : this.selectedPaymentMethod === 2 ? 'tabby' : 'cash'),
            shipping_address: this.shippingDetails.address || '',
            address_id: this.shippingDetails.addressId,
            items: this.cartItems.map(item => ({
              product_id: item.product?.id,
              product_name: item.product?.name || '',
              quantity: parseInt(item.quantity) || 0,
              price: parseFloat(item.price) || 0,
              subtotal: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })).filter(item => item.product_id && item.quantity > 0),
            total_price: totalPrice,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };

        // Validate order data
        if (!orderData.order.items.length) {
          this.$toast.error('Invalid order items');
          this.loading = false;
          return;
        }

        if (this.selectedPaymentMethod === 1) { // Stripe Checkout
          const response = await axios.post(`${API_URL}/api/payment/process`, {
            ...orderData,
            amount: totalPrice,
            currency: this.currency,
            payment_method: 'stripe'
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (response.data.success && response.data.url) {
            console.log('Stripe redirect URL:', response.data.url);
            window.location.href = response.data.url;
            return;
          } else {
            throw new Error(response.data.error || this.$t('checkout.errorCreatingPaymentSession'));
          }
        } else if (this.selectedPaymentMethod === 2) { // Tabby
          const tabbyResponse = await axios.post(`${API_URL}/api/payment/tabby/create-session`, {
            ...orderData,
            amount: totalPrice
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (tabbyResponse.data.success) {
            this.$toast.success(this.$t('checkout.redirectingToTabby'));
            window.location.href = tabbyResponse.data.redirectUrl;
          } else {
            throw new Error(this.$t('checkout.errorCreatingPaymentSession'));
          }
        } else if (this.selectedPaymentMethod === 3) { // Cash on Delivery
          const orderResponse = await axios.post(`${API_URL}/api/orders`, orderData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (orderResponse.data.success) {
            this.$toast.success(this.$t('checkout.orderPlacedSuccessfully'));
            window.location.href = '/orders/user';
          } else {
            throw new Error(orderResponse.data.error || this.$t('checkout.errorPlacingOrder'));
          }
        }
      } catch (error) {
        console.error("Error placing order:", error);
        let errorMessage = this.$t("checkout.errorPlacingOrder");
        
        try {
          // Debug logging
          console.log("Error object:", error);
          console.log("Error type:", typeof error);
          
          // Check if error is an object and has response
          if (error && typeof error === "object") {
            if (error.response && error.response.data) {
              errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            } else if ("message" in error) {
              errorMessage = error.message;
            }
          }
        } catch (e) {
          console.error("Error processing error message:", e);
        }
        
        // Ensure we always have a string message
        if (typeof errorMessage !== "string") {
          errorMessage = this.$t("checkout.errorPlacingOrder");
        }
        
        this.$toast.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    getCountryCode(countryName) {
      // Common country mappings
      const countryMap = {
        'United States': 'US',
        'United Kingdom': 'GB',
        'Egypt': 'EG',
        'Saudi Arabia': 'SA',
        'United Arab Emirates': 'AE',
        'Kuwait': 'KW',
        'Qatar': 'QA',
        'Bahrain': 'BH',
        'Oman': 'OM',
        'Jordan': 'JO',
        'Lebanon': 'LB',
        'Iraq': 'IQ',
        'Syria': 'SY',
        'Yemen': 'YE',
        'Libya': 'LY',
        'Sudan': 'SD',
        'Morocco': 'MA',
        'Algeria': 'DZ',
        'Tunisia': 'TN',
        'Palestine': 'PS',
        'Israel': 'IL',
        'Turkey': 'TR',
        'Iran': 'IR',
        'Pakistan': 'PK',
        'India': 'IN',
        'China': 'CN',
        'Japan': 'JP',
        'South Korea': 'KR',
        'Singapore': 'SG',
        'Malaysia': 'MY',
        'Indonesia': 'ID',
        'Australia': 'AU',
        'New Zealand': 'NZ',
        'Canada': 'CA',
        'Mexico': 'MX',
        'Brazil': 'BR',
        'Argentina': 'AR',
        'South Africa': 'ZA',
        'Nigeria': 'NG',
        'Kenya': 'KE',
        'Ghana': 'GH',
        'Ethiopia': 'ET',
        'Tanzania': 'TZ',
        'Uganda': 'UG',
        'Rwanda': 'RW',
        'Senegal': 'SN',
        'Côte d\'Ivoire': 'CI',
        'Cameroon': 'CM',
        'Angola': 'AO',
        'Mozambique': 'MZ',
        'Madagascar': 'MG',
        'Mauritius': 'MU',
        'Seychelles': 'SC',
        'Comoros': 'KM',
        'Djibouti': 'DJ',
        'Eritrea': 'ER',
        'Somalia': 'SO',
        'South Sudan': 'SS',
        'Chad': 'TD',
        'Niger': 'NE',
        'Mali': 'ML',
        'Burkina Faso': 'BF',
        'Benin': 'BJ',
        'Togo': 'TG',
        'Guinea': 'GN',
        'Guinea-Bissau': 'GW',
        'Sierra Leone': 'SL',
        'Liberia': 'LR',
        'Cape Verde': 'CV',
        'São Tomé and Príncipe': 'ST',
        'Equatorial Guinea': 'GQ',
        'Gabon': 'GA',
        'Republic of the Congo': 'CG',
        'Democratic Republic of the Congo': 'CD',
        'Central African Republic': 'CF',
        'Burundi': 'BI',
        'Zambia': 'ZM',
        'Zimbabwe': 'ZW',
        'Malawi': 'MW',
        'Namibia': 'NA',
        'Botswana': 'BW',
        'Lesotho': 'LS',
        'Eswatini': 'SZ',
        'Mauritania': 'MR',
        'Western Sahara': 'EH',
        'The Gambia': 'GM',
        'Guinea-Bissau': 'GW',
        'Sierra Leone': 'SL',
        'Liberia': 'LR',
        'Cape Verde': 'CV',
        'São Tomé and Príncipe': 'ST',
        'Equatorial Guinea': 'GQ',
        'Gabon': 'GA',
        'Republic of the Congo': 'CG',
        'Democratic Republic of the Congo': 'CD',
        'Central African Republic': 'CF',
        'Burundi': 'BI',
        'Zambia': 'ZM',
        'Zimbabwe': 'ZW',
        'Malawi': 'MW',
        'Namibia': 'NA',
        'Botswana': 'BW',
        'Lesotho': 'LS',
        'Eswatini': 'SZ',
        'Mauritania': 'MR',
        'Western Sahara': 'EH',
        'The Gambia': 'GM'
      };

      // If the input is already a 2-letter code, return it
      if (/^[A-Z]{2}$/.test(countryName)) {
        return countryName;
      }

      // Try to find the country code from the map
      const code = countryMap[countryName];
      if (code) {
        return code;
      }

      // If not found, return null
      return null;
    }
  }
}
</script>

<style scoped>
.checkout-step {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

@media (max-width: 768px) {
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