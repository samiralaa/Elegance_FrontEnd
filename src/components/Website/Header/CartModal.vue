<template>
  <div class="modal-overlay d-flex justify-content-center align-items-center">
    <div class="cart-modal bg-white rounded-4 shadow p-4 position-relative">
      <!-- Close Button -->
      <button type="button" class="btn-close position-absolute top-0 end-0 m-3" @click="$emit('close')" aria-label="Close"></button>

      <!-- Title -->
      <h4 class="mb-3">🛒 {{ $t('Cart Items') }}</h4>

      <!-- Cart List -->
      <div class="cart-content overflow-auto" style="max-height: 60vh;">
        <ul v-if="cartItems.length" class="list-unstyled">
          <li v-for="item in cartItems" :key="item.id" class="d-flex align-items-center border-bottom py-2 gap-3">
            <img :src="getProductImage(item)" alt="Product Image" class="product-image" />

            <div class="flex-grow-1">
              <h6 class="mb-1">{{ currentLang === 'ar' ? item.product.name_ar : item.product.name_en }}</h6>

              <!-- Quantity and Price -->
              <div class="d-flex align-items-center gap-2">
                <small class="text-muted">
                  {{ item.price }} {{ currentLang === 'ar' ? item.currency.name_ar : item.currency.name_en }} ×
                </small>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  @change="$emit('update-quantity', item)"
                  min="1"
                  class="form-control form-control-sm"
                  style="width: 70px;"
                />
              </div>
            </div>
          </li>
        </ul>

        <div v-else class="text-center text-muted py-4">
          🛍️ {{ $t('Cart is empty') }}
        </div>
      </div>

      <!-- Total Price -->
      <div v-if="cartItems.length" class="d-flex justify-content-between mt-3">
        <span><strong>{{ $t('Total') }}:</strong></span>
        <span>
          {{ totalValue }} {{ currentLang === 'ar' ? cartItems[0].currency.name_ar : cartItems[0].currency.name_en }}
        </span>
      </div>

      <!-- Footer -->
      <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-outline-secondary" @click="$emit('close')">
          {{ $t('Close') }}
        </button>
        <button class="btn btn-primary" @click="$emit('checkout')">
          {{ $t('Checkout') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/store/index.js';

export default {
  name: 'CartModal',
  props: {
    cartItems: {
      type: Array,
      required: true
    },
    totalValue: {
      type: [Number, String],
      required: true
    },
    currentLang: {
      type: String,
      default: 'en'
    }
  },
  methods: {
    getProductImage(item) {
      // Check if the item has a product and images array
      if (item.product && item.product.images && item.product.images.length > 0) {
        // If the image is a string (path), use it directly
        if (typeof item.product.images[0] === 'string') {
          return `${API_URL}/${item.product.images[0]}`;
        }
        // If the image is an object with path property
        if (item.product.images[0].path) {
          return `${API_URL}/${item.product.images[0].path}`;
        }
      }
      return '/placeholder-image.jpg';
    }
  },
  emits: ['close', 'checkout', 'update-quantity']
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1050;
  backdrop-filter: blur(2px);
  padding: 1rem;
}

.cart-modal {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  animation: fadeInUp 0.3s ease-in-out;
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.cart-content {
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.cart-content::-webkit-scrollbar {
  width: 6px;
}

.cart-content::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}
</style> 