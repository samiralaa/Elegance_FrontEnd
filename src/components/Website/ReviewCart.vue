<template>
  <div class="review-cart">
    <div class="cart-items" v-if="cartItems.length">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.name">
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p>{{ item.price }} x {{ item.quantity }}</p>
        </div>
        <div class="item-total">
          {{ calculateItemTotal(item) }}
        </div>
      </div>
      <div class="cart-total">
        <h3>Total: {{ cartTotal }}</h3>
      </div>
    </div>

    <div class="payment-form">
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div id="card-element"></div>
          <div id="card-errors" role="alert" v-if="error">{{ error }}</div>
        </div>
        <button type="submit" :disabled="processing">
          {{ processing ? 'Processing...' : 'Pay Now' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  name: 'ReviewCart',
  data() {
    return {
      stripe: null,
      card: null,
      error: null,
      processing: false,
      cartItems: [],
      cartTotal: 0
    };
  },
  async mounted() {
    // Initialize Stripe
    this.stripe = await loadStripe('your-publishable-key');
    const elements = this.stripe.elements();
    
    // Create card element
    this.card = elements.create('card');
    this.card.mount('#card-element');

    // Handle real-time validation errors
    this.card.addEventListener('change', (event) => {
      if (event.error) {
        this.error = event.error.message;
      } else {
        this.error = null;
      }
    });

    // Load cart items
    this.loadCartItems();
  },
  methods: {
    loadCartItems() {
      // Implement cart items loading logic
      this.cartItems = [];
      this.calculateTotal();
    },
    calculateItemTotal(item) {
      return (item.price * item.quantity).toFixed(2);
    },
    calculateTotal() {
      this.cartTotal = this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0).toFixed(2);
    },
    async handleSubmit() {
      this.processing = true;
      this.error = null;

      try {
        // Get payment intent from your backend
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: this.cartTotal * 100 // Convert to cents
          })
        });

        const data = await response.json();

        // Confirm card payment
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: {
              card: this.card,
            }
          }
        );

        if (error) {
          this.error = error.message;
        } else if (paymentIntent.status === 'succeeded') {
          // Payment successful - handle order completion
          this.$emit('payment-success', paymentIntent);
        }
      } catch (err) {
        this.error = 'An error occurred while processing your payment.';
      }

      this.processing = false;
    }
  }
};
</script>

<style scoped>
.review-cart {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.cart-items {
  margin-bottom: 30px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
}

.item-details {
  flex-grow: 1;
}

.item-details h3 {
  margin: 0;
  font-size: 1.1em;
}

.cart-total {
  text-align: right;
  padding: 15px;
  font-size: 1.2em;
}

.payment-form {
  max-width: 500px;
  margin: 0 auto;
}

#card-element {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
}

#card-errors {
  color: #dc3545;
  margin-bottom: 15px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #5469d4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:disabled {
  background-color: #879fff;
  cursor: not-allowed;
}
</style>