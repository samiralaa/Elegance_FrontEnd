<template>
  <div class="favorites-modal">
    <div class="modal-content">
      <h4 class="modal-title">❤️ {{ $t('header.myFavorites') }}</h4>
      <ul v-if="favorites.length" class="favorites-list">
        <li v-for="favorite in favorites" :key="favorite.id" class="favorite-item">
          <img :src="getFavoriteProductImage(favorite)" alt="Product Image" class="product-image" />
          <div class="product-info">
            <h5>{{ currentLang === 'ar' ? favorite.product.name_ar : favorite.product.name_en }}</h5>
            <p>{{ favorite.product.price }} {{ favorite.product.currency?.name_en }}</p>
          </div>
        </li>
      </ul>
      <p v-else class="text-center text-muted">{{ $t('header.noFavorites') }}</p>
      <button class="btn btn-secondary mt-3" @click="$emit('close')">{{ $t('header.close') }}</button>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/store/index.js';

export default {
  name: 'FavoritesModal',
  props: {
    favorites: {
      type: Array,
      default: () => []
    },
    currentLang: {
      type: String,
      default: 'en'
    }
  },
  methods: {
    getFavoriteProductImage(favorite) {
      if (favorite.product && favorite.product.images && favorite.product.images.length > 0) {
        if (typeof favorite.product.images[0] === 'string') {
          return `${API_URL}/${favorite.product.images[0]}`;
        }
        if (favorite.product.images[0].path) {
          return `${API_URL}/${favorite.product.images[0].path}`;
        }
      }
      return '/placeholder-image.jpg';
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.favorites-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  color: #8b6b3d;
  margin-bottom: 20px;
  font-weight: 600;
}

.favorites-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  transition: all 0.2s ease;
}

.favorite-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.product-info h5 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.product-info p {
  margin: 5px 0 0;
  color: #8b6b3d;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 