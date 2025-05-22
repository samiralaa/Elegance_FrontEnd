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

    <!-- Tabby Payment Option -->
    <div v-if="selectedPaymentMethod === 2" class="tabby-container">
      <div class="tabby-info">
        <p>{{ $t('checkout.tabbyInfo') || 'Pay in 4 interest-free installments with Tabby.' }}</p>
        <div class="tabby-installments">
          <div v-for="(installment, index) in tabbyInstallments" :key="index" class="installment">
            <span class="installment-amount">{{ (total / 4).toFixed(2) }} {{ currency }}</span>
            <span class="installment-date">{{ installment }}</span>
          </div>
        </div>
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
      cardElement: null,
      tabbyInstallments: [
        'Today',
        'In 2 weeks',
        'In 4 weeks',
        'In 6 weeks'
      ]      
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
        
        // Calculate total price from items
        const totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderData = {
          user_id: 1,
          order: {
            status: 'pending',
            payment_method: this.selectedPaymentMethod === 1 ? 'stripe' : 'tabby',
            shipping_address: this.shippingDetails.address,
            address_id: this.shippingDetails.addressId,
            items: this.cartItems.map(item => ({
              product_id: item.product.id,
              product_name: item.product.name,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })),
            total_price: totalPrice,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };

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
            amount: totalPrice,
            currency: this.currency,
            buyer: {
              email: this.shippingDetails.email || '',
              phone: this.shippingDetails.phone || '',
              name: `${this.shippingDetails.firstName || ''} ${this.shippingDetails.lastName || ''}`.trim(),
            },
            shipping: {
              address: {
                city: this.shippingDetails.city || '',
                address: this.shippingDetails.address || '',
                zip: this.shippingDetails.zip || '',
              },
              country: this.getCountryCode(this.shippingDetails.country) || 'AE'
            },
            order: {
              reference_id: `order-${Date.now()}`,
              items: this.cartItems.map(item => ({
                title: item.product.name,
                description: item.product.description || '',
                quantity: item.quantity,
                unit_price: item.price,
                reference_id: item.product.id.toString()
              }))
            }
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (tabbyResponse.data.success) {
            this.$toast.success(this.$t('checkout.redirectingToTabby'));
            window.location.href = tabbyResponse.data.redirectUrl;
          } else {
            throw new Error(tabbyResponse.data.error || this.$t('checkout.errorCreatingPaymentSession'));
          }
        } else if (this.selectedPaymentMethod === 3) { // Cash on Delivery
          await this.createOrder();
        }
      } catch (error) {
        console.error('Error placing order:', error);
        this.$toast.error(error.message || this.$t('checkout.errorPlacingOrder'));
      } finally {
        this.loading = false;
      }
    },
    async createOrder() {
      const totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const orderData = {
        shipping_details: this.shippingDetails,
        payment_method: this.selectedPaymentMethod,
        items: this.cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        total_price: totalPrice
      };

      const orderResponse = await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (orderResponse.data.success) {
        this.$toast.success(this.$t('checkout.orderPlaced'));
        this.$emit('order-placed');
        window.location.href = '/';
      } else {
        throw new Error(this.$t('checkout.errorPlacingOrder'));
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

.stripe-container,
.tabby-container {
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

.tabby-info {
  padding: 1rem;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.tabby-installments {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.installment {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  min-width: 22%;
  margin-bottom: 0.5rem;
}

.installment-amount {
  font-weight: bold;
  color: #8b6b3d;
}

.installment-date {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
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