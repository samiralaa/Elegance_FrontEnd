<template>
  <div class="modal-overlay d-flex justify-content-center align-items-center">
    <div class="favorites-modal bg-white rounded-4 shadow p-4 position-relative">
      <!-- Close Button -->
      <button type="button" class="btn-close position-absolute top-0 end-0 m-3" @click="$emit('close')" aria-label="Close"></button>

      <!-- Title -->
      <h4 class="mb-3">❤️ {{ $t('Favorites') }}</h4>

      <!-- Favorites List -->
      <div class="favorites-content overflow-auto" style="max-height: 60vh;">
        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <ul v-else-if="favorites && favorites.length" class="list-unstyled">
          <li v-for="favorite in favorites" :key="favorite.id" class="favorite-item d-flex align-items-center border-bottom py-3 gap-3">
            <img 
              :src="getProductImage(favorite.product)" 
              :alt="currentLang === 'ar' ? favorite.product.name_ar : favorite.product.name_en" 
              class="product-image" 
            />

            <div class="flex-grow-1">
              <h6 class="mb-1">{{ currentLang === 'ar' ? favorite.product.name_ar : favorite.product.name_en }}</h6>
              <p class="text-muted mb-2 small">{{ currentLang === 'ar' ? favorite.product.description_ar : favorite.product.description_en }}</p>
              
              <!-- Price -->
              <div class="d-flex align-items-center justify-content-between">
                <span class="price">
                  {{ favorite.product.price }} {{ favorite.product.currency_id }}
                </span>
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-sm btn-outline-primary" 
                    @click="addToCart(favorite.product)"
                    :disabled="isLoading"
                  >
                    <fa icon="shopping-cart" />
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger" 
                    @click="removeFavorite(favorite.id)"
                    :disabled="isLoading"
                  >
                    <fa icon="trash" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div v-else class="text-center text-muted py-4">
          ❤️ {{ $t('No favorites yet') }}
        </div>
      </div>

      <!-- Footer -->
      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-outline-secondary" @click="$emit('close')">
          {{ $t('Close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/store/index.js';
import { ElNotification } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import { useFavoritesStore } from '@/store/favorites';
import { storeToRefs } from 'pinia';

export default {
  name: 'FavoritesModal',
  components: {
    fa: FontAwesomeIcon
  },
  props: {
    currentLang: {
      type: String,
      default: 'en'
    }
  },
  setup() {
    const { t } = useI18n();
    const favoritesStore = useFavoritesStore();
    const { favorites, isLoading } = storeToRefs(favoritesStore);

    return { 
      t,
      favorites,
      isLoading,
      favoritesStore
    };
  },
  async created() {
    await this.favoritesStore.fetchFavorites();
  },
  methods: {
    getProductImage(product) {
      if (product && product.images && product.images.length > 0) {
        return `${API_URL}/${product.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },
    async removeFavorite(favoriteId) {
      try {
        await this.favoritesStore.removeFromFavorites(favoriteId);
        ElNotification({
          title: this.t('success'),
          message: this.t('favorite_removed'),
          type: 'success',
        });
        this.$emit('favorite-removed', favoriteId);
      } catch (error) {
        console.error('Error removing favorite:', error);
        ElNotification({
          title: this.t('error'),
          message: error.response?.data?.message || this.t('remove_favorite_error'),
          type: 'error',
        });
      }
    },
    async addToCart(product) {
      if (!product || !product.price) {
        ElNotification({
          title: this.t('error'),
          message: this.t('invalid_product'),
          type: 'error',
        });
        return;
      }

      try {
        const response = await axios.post(`${API_URL}/api/cart-items`, {
          product_id: product.id,
          quantity: 1,
          price: parseFloat(product.price)
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (response.data.status) {
          ElNotification({
            title: this.t('success'),
            message: this.t('added_to_cart'),
            type: 'success',
          });
          this.$emit('close');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        const errorMessage = error.response?.data?.message || this.t('add_to_cart_error');
        ElNotification({
          title: this.t('error'),
          message: errorMessage,
          type: 'error',
        });
      }
    }
  },
  emits: ['close', 'favorite-removed']
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

.favorites-modal {
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

.favorites-content {
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.favorites-content::-webkit-scrollbar {
  width: 6px;
}

.favorites-content::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.favorite-item {
  transition: background-color 0.3s ease;
}

.favorite-item:hover {
  background-color: #f8f9fa;
}

.price {
  font-weight: 600;
  color: #8B6B3D;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.btn-outline-primary {
  border-color: #8B6B3D;
  color: #8B6B3D;
}

.btn-outline-primary:hover {
  background-color: #8B6B3D;
  color: white;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-image {
    width: 60px;
    height: 60px;
  }
  
  .favorite-item {
    padding: 0.75rem 0;
  }
}
</style> 