<template>
  <div class="modal-overlay d-flex justify-content-center align-items-center">
    <div class="cart-modal bg-white rounded-4 shadow p-4 position-relative">
      <!-- Close Button -->
      <button type="button" class="btn-close position-absolute top-0 end-0 m-3" @click="$emit('close')" aria-label="Close"></button>

      <!-- Title -->
      <h4 class="mb-3">🛒 {{ $t('cart.title') }}</h4>

      <!-- Cart List -->
      <div class="cart-content overflow-auto" style="max-height: 60vh;">
        <ul v-if="cartItems.length" class="list-unstyled">
          <li v-for="item in cartItems" :key="item.id" class="d-flex align-items-center border-bottom py-2 gap-3">
            <img :src="getProductImage(item)" alt="Product Image" class="product-image" />
            <div class="flex-grow-1">
              <h6 class="mb-1">
                {{ item.product ? (currentLang === 'ar' ? item.product.name_ar : item.product.name_en) : 'Product not available' }}
              </h6>

              <!-- Quantity and Price -->
              <div class="d-flex align-items-center gap-2">
                <small class="text-muted">
                  {{ item.price }} 
                  {{ item.currency ? (currentLang === 'ar' ? item.currency.name_ar : item.currency.name_en) : '' }} ×
                </small>
                <div class="quantity-control">
                  <el-button 
                    size="small" 
                    @click="decreaseQuantity(item)"
                    :disabled="item.quantity <= 1"
                    class="qty-btn"
                  >
                    <fa icon="minus" />
                  </el-button>
                  <span class="qty-number">{{ item.quantity }}</span>
                  <el-button 
                    size="small" 
                    @click="increaseQuantity(item)"
                    :disabled="item.quantity >= 99"
                    class="qty-btn"
                  >
                    <fa icon="plus" />
                  </el-button>
                </div>
                <button 
                  class="btn btn-sm btn-outline-danger ms-auto" 
                  @click="removeItem(item.id)"
                  :disabled="isLoading"
                >
                  <fa icon="trash" />
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div v-else class="text-center text-muted py-4">
          🛍️ {{ $t('cart.emptyCartMessage') }}
        </div>
      </div>

      <!-- Total Price -->
      <div v-if="cartItems.length" class="d-flex justify-content-between mt-3">
        <span><strong>{{ $t('cart.total') }}:</strong></span>
        <span>
          {{ totalValue }} 
          {{ cartItems[0]?.currency ? (currentLang === 'ar' ? cartItems[0].currency.name_ar : cartItems[0].currency.name_en) : '' }}
        </span>
      </div>

      <!-- Footer -->
      <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-outline-secondary" @click="$emit('close')">
          {{ $t('cart.close') }}
        </button>
        <button class="btn btn-primary" @click="$emit('checkout')">
          {{ $t('cart.checkout') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/store/index.js';
import { ElNotification } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '@/store/cart';

export default {
  name: 'CartModal',
  props: {
    cartItems: Array,
    totalValue: [Number, String],
    currentLang: {
      type: String,
      default: 'en'
    }
  },
  emits: ['close', 'checkout', 'update-quantity', 'item-removed'],
  data() {
    return {
      isLoading: false
    };
  },
  setup() {
    const { t } = useI18n();
    const cartStore = useCartStore();
    return { t, cartStore };
  },
  methods: {
    getProductImage(item) {
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        return `${API_URL}/public/storage/${item.images[0]}`;
      }
      return '/placeholder-image.jpg';
    },

    async updateCartItemQuantity(item) {
      try {
        const response = await axios.post(`${API_URL}/api/cart-items/${item.id}`, {
          quantity: item.quantity
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data.status) {
          this.$emit('update-quantity', item);
          ElNotification({
            title: this.t('cart.success'),
            message: this.t('cart.quantity_updated'),
            type: 'success',
            duration: 2000
          });
        } else {
          ElNotification({
            title: this.t('cart.error'),
            message: response.data.message || this.t('cart.update_failed'),
            type: 'error',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        ElNotification({
          title: this.t('cart.error'),
          message: error.response?.data?.message || this.t('cart.network_error'),
          type: 'error',
          duration: 3000
        });
      }
    },

    async increaseQuantity(item) {
      if (item.quantity < 99) {
        item.quantity++;
        await this.updateCartItemQuantity(item);
      } else {
        ElNotification({
          title: this.t('warning'),
          message: this.t('max_quantity_reached'),
          type: 'warning',
        });
      }
    },

    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        await this.updateCartItemQuantity(item);
      } else {
        ElNotification({
          title: this.t('warning'),
          message: this.t('min_quantity_reached'),
          type: 'warning',
        });
      }
    },

    async removeItem(itemId) {
      try {
        await this.cartStore.removeFromCart(itemId);
        ElNotification({
          title: this.t('success'),
          message: this.t('cart_item_removed'),
          type: 'success'
        });
      } catch (error) {
        ElNotification({
          title: this.t('error'),
          message: error.response?.data?.message || this.t('cart.remove_failed'),
          type: 'error'
        });
      }
    }

  }
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

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f8f8f8;
  padding: 5px;
  border-radius: 8px;
  width: fit-content;
}

.qty-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  color: #a3852c;
  transition: all 0.3s ease;
}

.qty-btn:hover:not(:disabled) {
  background-color: #a3852c;
  color: #fff;
  border-color: #a3852c;
}

.qty-btn:disabled {
  background-color: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

.qty-number {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 30px;
  text-align: center;
  padding: 0 8px;
}

@media (max-width: 768px) {
  .quantity-control {
    width: 100%;
    justify-content: center;
  }

  .qty-number {
    min-width: 25px;
  }
}
</style>
