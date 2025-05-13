<template>
  <div class="checkout-step">
    <h2>{{ $t('checkout.reviewCart') }}</h2>
    <div class="cart-items">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="getProductImage(item)" :alt="item.product.name_en" class="item-image">
        <div class="item-details">
          <h3>{{ currentLang === 'ar' ? item.product.name_ar : item.product.name_en }}</h3>
          <p class="item-price">{{ item.price }} {{ currentLang === 'ar' ? item.currency.name_ar : item.currency.name_en }}</p>
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
    <button class="btn-primary" @click="$emit('next-step')" :disabled="!cartItems.length">
      {{ $t('checkout.continueToShipping') }}
    </button>
  </div>
</template>

<script>
import { API_URL } from '@/store/index.js';
import axios from 'axios';

export default {
  name: 'CartReview',
  props: {
    cartItems: {
      type: Array,
      required: true
    },
    shippingCost: {
      type: Number,
      required: true
    }
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
  methods: {
    getProductImage(item) {
      if (item.images && Array.isArray(item.images)) {
        return `${API_URL}/${item.images[0]}`;
      }
      return `${API_URL}/images/default.jpg`;
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
          item.quantity = updatedItem.quantity ?? newQuantity;
          item.price = updatedItem.price ?? item.price;
          this.$toast.success(this.$t('checkout.quantityUpdated'));
          this.$emit('update-cart', [...this.cartItems]);
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
        this.$emit('update-cart', this.cartItems.filter(item => item.id !== itemId));
        this.$toast.success(this.$t('checkout.itemRemoved'));
      } catch (error) {
        console.error('Error removing item:', error);
        this.$toast.error(this.$t('checkout.errorRemovingItem'));
      }
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

.btn-primary {
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #8b6b3d;
  color: #fff;
  border: none;
  width: 100%;
}

.btn-primary:hover {
  background: #725932;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 