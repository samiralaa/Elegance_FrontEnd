<template>
  <div class="custom-search-modal">
    <div class="modal-content">
      <input 
        type="text" 
        class="form-control search-input" 
        :placeholder="$t('header.searchPlaceholder')" 
        :value="searchQuery"
        @input="$emit('search', $event.target.value)" 
      />
      <ul v-if="products.length">
        <li v-for="product in products" :key="product.id" class="product-item">
          <img :src="getProductImage(product)" alt="Product Image" class="product-image" />
          <div class="product-info">
            <h5>{{ currentLang === 'ar' ? product.name_ar : product.name_en }}</h5>
            <p>{{ product.price }} {{ product.currency?.name_en }}</p>
          </div>
        </li>
      </ul>
      <p v-else-if="searchQuery">No results found.</p>
      <button class="btn btn-secondary mt-3" @click="$emit('close')">{{ $t('header.close') }}</button>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/store/index.js';

export default {
  name: 'SearchModal',
  props: {
    products: {
      type: Array,
      default: () => []
    },
    searchQuery: {
      type: String,
      default: ''
    },
    currentLang: {
      type: String,
      default: 'en'
    }
  },
  methods: {
    getProductImage(product) {
      if (product.images && product.images[0]?.path) {
        return `${API_URL}/${product.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    }
  },
  emits: ['close', 'search']
}
</script>

<style scoped>
.custom-search-modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 20px 30px;
  border-radius: 8px;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
  overflow-y: auto;
  max-height: 80vh;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.product-item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex-grow: 1;
}

.product-info h5 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.product-info p {
  margin: 5px 0 0;
  color: #8b6b3d;
}
</style> 