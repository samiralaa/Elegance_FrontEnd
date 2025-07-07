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

    <!-- Subtotal -->

    <!-- Delivery charge -->
    <p>{{ $t('checkout.deliveryCharge') }}: {{ deliveryCharge }} {{ currency }}</p>

    <!-- Tax -->
   
    <!-- Total -->
    <div class="total-amount">
      {{ $t('checkout.totalAmount') }}: {{ totalAmount }} {{ currency }}
    </div>
  </div>
</div>

    <div class="button-group">
      <button class="btn-secondary" @click="$emit('previous-step')">
        {{ $t('checkout.back') }}
      </button>
      <button class="btn-primary" :disabled="!selectedPaymentMethod || loading" @click="
        selectedPaymentMethod === 2
          ? initiateTabbyPayment()
          : placeOrder()
        ">
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
import { convertToAED } from '@/utils/currency';

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
    async initiateTabbyPayment() {
      this.loading = true;

      try {
        // 1. تحقق من وجود عنوان شحن
        if (!this.shippingDetails.addressId) {
          this.$toast.error('The address id field is required.');
          return;
        }

        // 2. تحقق من تسجيل دخول المستخدم
        const authUser = localStorage.getItem('auth_user');
        if (!authUser) {
          this.$toast.error('User authentication required');
          return;
        }

        const parsedUser = JSON.parse(authUser);
        const userId = parsedUser?.id;

        if (!userId) {
          this.$toast.error('User authentication required');
          return;
        }

        // 3. تحقق من وجود منتجات في السلة
        if (!Array.isArray(this.cartItems) || this.cartItems.length === 0) {
          this.$toast.error('No items in cart');
          return;
        }

        // 4. حساب السعر الإجمالي
        const totalPrice = parseFloat(this.totalAmount);

        // 5. تجهيز العناصر المطلوبة للطلب
        const orderItems = this.cartItems
          .map((item) => ({
            product_id: item.product?.id,
            product_name: item.product?.name || '',
            quantity: parseInt(item.quantity) || 0,
            price: parseFloat(item.price) || 0,
            subtotal:
              (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
          }))
          .filter((item) => item.product_id && item.quantity > 0);

        // 6. تجهيز بيانات المستخدم
        const userName = this.user?.name || parsedUser?.name || 'Guest';
        const userEmail = this.user?.email || parsedUser?.email || '';
        const userPhone = this.user?.phone || parsedUser?.phone || '';

        // 7. تجهيز البيانات المرسلة لـ API
        const orderData = {
          user_id: userId,
          total_price: totalPrice,
          shipping_address: this.shippingDetails.address || '',
          address_id: this.shippingDetails.addressId,
          items: orderItems,
          user: {
            name: userName,
            email: userEmail,
            phone: userPhone,
          },
        };

        // 8. تجهيز headers للطلب (JWT أو Bearer token)
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        };

        // 9. إرسال الطلب إلى الـ API
        const response = await axios.post(
          `${API_URL}/api/payment/tabby/send`,
          orderData,
          { headers }
        );

        // 10. التوجيه لصفحة الدفع في Tabby
        if (response.data.status === 'success') {
          console.log('Redirecting to:', response.data.data.payment_url);
          window.location.href = response.data.data.payment_url;

        }

      } catch (error) {
        console.error('Tabby Payment Error:', error);
        this.$toast.error(error?.message || 'Unexpected Tabby payment error');
      } finally {
        this.loading = false;
      }
    },

    async placeOrder() {
      try {
        this.loading = true;

        if (!this.shippingDetails.addressId) {
          this.$toast.error('The address id field is required.');
          return;
        }

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
          return;
        }

        if (!userId) {
          this.$toast.error('User authentication required');
          return;
        }

        if (!Array.isArray(this.cartItems) || this.cartItems.length === 0) {
          this.$toast.error('No items in cart');
          return;
        }

        const totalPrice = parseFloat(this.totalAmount);

        const orderData = {
          user_id: userId,
          order: {
            status: 'pending',
            payment_method: String(
              this.selectedPaymentMethod === 1
                ? 'stripe'
                : this.selectedPaymentMethod === 2
                  ? 'tabby'
                  : 'cod' // ✅ هنا التعديل
            ),
            shipping_address: this.shippingDetails.address || '',
            address_id: this.shippingDetails.addressId,
            items: this.cartItems
              .map((item) => ({
                product_id: item.product?.id,
                product_name: item.product?.name || '',
                quantity: parseInt(item.quantity) || 0,
                price: parseFloat(item.price) || 0,
                subtotal:
                  (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }))
              .filter((item) => item.product_id && item.quantity > 0),
            total_price: totalPrice,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };

        if (!orderData.order.items.length) {
          this.$toast.error('Invalid order items');
          return;
        }

        const headers = {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        };

        // Stripe
        if (this.selectedPaymentMethod === 1) {
          const response = await axios.post(
            `${API_URL}/api/payment/process`,
            {
              ...orderData,
              amount: totalPrice,
              currency: this.currency,
              payment_method: 'stripe',
            },
            { headers }
          );

          if (response?.data?.success && response?.data?.url) {
            window.location.href = response.data.url;
            return;
          } else {
            throw new Error(
              response?.data?.error ||
              response?.data?.message ||
              this.$t('checkout.errorCreatingPaymentSession')
            );
          }
        }

        // Tabby
        if (this.selectedPaymentMethod === 2) {
          const tabbyResponse = await axios.post(
            `${API_URL}/api/payment/process`,
            {
              user_id: userId,
              payment_method: 'tabby',
              order: {
                status: 'pending',
                payment_method: 'tabby',
                shipping_address: this.shippingDetails.address || '',
                address_id: this.shippingDetails.addressId,
                items: this.cartItems
                  .map((item) => ({
                    product_id: item.product?.id,
                    product_name: item.product?.name || '',
                    quantity: parseInt(item.quantity) || 0,
                    price: parseFloat(item.price) || 0,
                    subtotal:
                      (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
                  }))
                  .filter((item) => item.product_id && item.quantity > 0),
                total_price: totalPrice,
              },
              user: {
                name: this.user.name,
                email: this.user.email,
                phone: this.user.phone,
              }
            },
            { headers }
          );

          if (tabbyResponse?.data?.status === 'success' && tabbyResponse.data.data?.payment_url) {
            this.$toast.success('Redirecting to Tabby...');
            window.location.href = tabbyResponse.data.data.payment_url;
            return;
          } else {
            throw new Error(
              tabbyResponse?.data?.message ||
              tabbyResponse?.data?.error ||
              'Error creating Tabby session.'
            );
          }
        }


        // COD (Cash On Delivery)
        if (this.selectedPaymentMethod === 3) {
          const orderResponse = await axios.post(
            `${API_URL}/api/orders`,
            orderData,
            { headers }
          );

          if (orderResponse?.data?.status === 'success') {
            this.$toast.success(this.$t('checkout.orderPlacedSuccessfully'));
            window.location.href = '/orders/user'; // أو أي صفحة عاوز توديه عليها
            return;
          } else {
            const message =
              orderResponse?.data?.message ||
              orderResponse?.data?.error ||
              'Error placing order';
            throw new Error(message);
          }
        }

      } catch (error) {
        console.error('Error placing order:', error);

        let errorMessage = 'Unexpected error while placing your order.';

        try {
          if (error?.response?.data) {
            errorMessage =
              error.response.data.message ||
              error.response.data.error ||
              error.message ||
              errorMessage;
          } else if (error?.message) {
            errorMessage = error.message;
          }
        } catch (e) {
          console.warn('Error extracting message:', e);
        }

        if (this?.$toast?.error) {
          this.$toast.error(errorMessage);
        } else {
          window.location.href = '/orders/user';
        }

      } finally {
        this.loading = false;
      }
    },


    async createOrder() {
      // Validate addressId
      if (!this.shippingDetails.addressId) {
        this.$toast.error('The address id field is required.');
        return;
      }
      const totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const paymentMethod = this.selectedPaymentMethod === 3 ? 'cod' : String(this.selectedPaymentMethod);
      const orderData = {
        shipping_details: this.shippingDetails,
        address_id: this.shippingDetails.addressId,
        payment_method: paymentMethod,
        items: this.cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        total_price: totalPrice
      };

      try {
        const orderResponse = await axios.post(`${API_URL}/api/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (orderResponse.data.success) {
          console.log(orderResponse)

          // this.$toast.success(this.$t('checkout.orderPlacedSuccessfully'));
          window.location.href = '/orders/user';
        } else {
          throw new Error(orderResponse.data.error || this.$t('checkout.errorPlacingOrder'));
        }
      } catch (error) {
        console.error(error);
        let message = this.$t('checkout.errorPlacingOrder');


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
    },
  },
  computed: {
  // المجموع الفرعي (أسعار المنتجات فقط)
  subTotal() {
    // استخدم السعر الأصلي وحول حسب العملة المختارة
    return this.cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + convertToAED(price, this.currency) * quantity;
    }, 0).toFixed(2);
  },

  // سعر التوصيل بناءً على الدولة
  deliveryCharge() {
    const countryId = this.shippingDetails.countryId;
    let charge = 20;
    if (countryId === 57) charge = 10;
    return convertToAED(charge, this.currency).toFixed(2);
  },

  taxAmount() {
    return 0;
  },

  // المجموع النهائي
  totalAmount() {
    const subtotal = parseFloat(this.subTotal);
    const delivery = parseFloat(this.deliveryCharge);
    const tax = parseFloat(this.taxAmount);
    return (subtotal + delivery + tax).toFixed(2);
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