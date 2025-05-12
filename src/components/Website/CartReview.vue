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
    <button class="btn-primary" @click="nextStep" :disabled="!cartItems.length">
      {{ $t('checkout.continueToShipping') }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'CartReview',
  props: {
    cartItems: Array,
    subtotal: Number,
    total: Number,
    currency: String,
    shippingCost: Number,
    currentLang: String
  },
  methods: {
    getProductImage(item) {
      if (item.images && Array.isArray(item.images)) {
        return `${API_URL}/${item.images[0]}`;
      }
      return `${API_URL}/images/default.jpg`;
    },
    updateQuantity(item, change) {
      this.$emit('update-quantity', item, change);
    },
    removeItem(itemId) {
      this.$emit('remove-item', itemId);
    },
    nextStep() {
      this.$emit('next-step');
    }
  }
};
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
</style>