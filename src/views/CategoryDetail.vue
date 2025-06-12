<template>
  <div>
    <Header />
    
    <div class="category-detail">
      <!-- Category Header -->
      <div class="category-header">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-4">
              <img :src="getCategoryImage(category)" :alt="currentLang === 'ar' ? category.name_ar : category.name_en" class="category-image">
            </div>
            <div class="col-md-8">
              <div class="brand-info mb-3">
                <router-link :to="`/brand/${category.brand.id}`" class="brand-link">
                  <img :src="getBrandImage(category.brand)" :alt="currentLang === 'ar' ? category.brand.name_ar : category.brand.name_en" class="brand-logo">
                  <span class="brand-name">{{ currentLang === 'ar' ? category.brand.name_ar : category.brand.name_en }}</span>
                </router-link>
              </div>
              <h1 class="category-name">{{ currentLang === 'ar' ? category.name_ar : category.name_en }}</h1>
              <p class="category-description">{{ currentLang === 'ar' ? category.description_ar : category.description_en }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="products-section py-5">
        <div class="container">
          <div class="section-header d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title">{{ $t('Products') }}</h2>
            <div class="products-count">{{ category.products.length }} {{ $t('Products') }}</div>
          </div>
          
          <div class="row">
            <div v-for="product in category.products" :key="product.id" class="col-md-4 col-lg-3 mb-4">
              <div class="product-card">
                <div class="product-image">
                  <img :src="getProductImage(product)" :alt="currentLang === 'ar' ? product.name_ar : product.name_en">
                  <div class="product-actions">
                    <button @click="addToFavorites(product)" class="action-btn favorite-btn" :class="{ 'active': isInFavorites(product) }">
                      <i class="fas" :class="isInFavorites(product) ? 'fa-heart' : 'fa-heart-o'"></i>
                    </button>
                  </div>
                </div>
                <div class="product-info">
                  <router-link :to="`/product/${product.id}`" class="text-decoration-none">
                    <h3 class="product-name">{{ currentLang === 'ar' ? product.name_ar : product.name_en }}</h3>
                    <p class="product-description">{{ currentLang === 'ar' ? product.description_ar : product.description_en }}</p>
                    <div class="product-price">{{ product.price }} {{ $t('SAR') }}</div>
                  
                  </router-link>
                  <div class="product-actions-bottom">
                    <button 
                      @click="addToCart(product)" 
                      class="btn btn-primary add-to-cart-btn"
                      :disabled="!product.is_available"
                    >
                      <i class="fas fa-shopping-cart"></i> {{ $t('Add to Cart') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/store/index.js';
import Header from '@/components/Website/Header.vue';
import Footer from '@/components/Website/Footer.vue';
import { useStore } from 'vuex';

export default {
  name: 'CategoryDetail',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      category: {
        brand: {},
        products: []
      },
      loading: true,
      error: null
    };
  },
  computed: {
    currentLang() {
      return localStorage.getItem('lang') || 'en';
    }
  },
  created() {
    this.fetchCategoryDetails();
    if (this.isAuthenticated) {
      this.$store.dispatch('favorites/fetchFavorites');
    }
  },
  methods: {
    async fetchCategoryDetails() {
      try {
        const categoryId = this.$route.params.id;
        const response = await axios.get(`${API_URL}/api/website/category/${categoryId}`);
        this.category = response.data.data;
      } catch (error) {
        console.error('Error fetching category details:', error);
        this.error = 'Failed to load category details';
      } finally {
        this.loading = false;
      }
    },
    getCategoryImage(category) {
      if (category.images && category.images.length > 0 && category.images[0].path) {
        return `${API_URL}/${category.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },
    getBrandImage(brand) {
      if (brand.images && brand.images.length > 0 && brand.images[0].path) {
        return `${API_URL}/${brand.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },
    getProductImage(product) {
      if (product.images && product.images.length > 0 && product.images[0].path) {
        return `${API_URL}/${product.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', {
        id: product.id,
        name: this.currentLang === 'ar' ? product.name_ar : product.name_en,
        price: product.price,
        image: this.getProductImage(product),
        quantity: 1
      });
    },
    async addToFavorites(product) {
      if (!this.isAuthenticated) {
        this.$router.push('/Account/Login');
        return;
      }
      try {
        await this.$store.dispatch('favorites/toggleFavorite', product);
      } catch (error) {
        console.error('Error toggling favorite:', error);
        this.$toast.error('Failed to update favorites');
      }
    },
    isInFavorites(product) {
      return this.$store.getters['favorites/isInFavorites'](product.id);
    }
  }
};
</script>

<style scoped>
.category-detail {
  padding-top: 2rem;
  min-height: calc(100vh - 200px);
}

.category-header {
  background-color: #f8f9fa;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.category-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #8B6B3D;
  transition: opacity 0.3s ease;
}

.brand-link:hover {
  opacity: 0.8;
}

.brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 500;
}

.category-name {
  color: #333;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.category-description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.section-header {
  border-bottom: 2px solid #8B6B3D;
  padding-bottom: 1rem;
}

.section-title {
  color: #8B6B3D;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.products-count {
  color: #666;
  font-size: 1.1rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: scale(1.1);
}

.favorite-btn.active {
  color: #dc3545;
}

.product-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  color: #8B6B3D;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.product-status {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  background-color: #dc3545;
  color: white;
  margin-bottom: 1rem;
}

.product-status.available {
  background-color: #28a745;
}

.product-actions-bottom {
  margin-top: auto;
}

.add-to-cart-btn {
  width: 100%;
  background-color: #8B6B3D;
  border-color: #8B6B3D;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  background-color: #7a5c33;
  border-color: #7a5c33;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .category-header {
    padding: 2rem 0;
  }

  .category-image {
    max-width: 200px;
    margin-bottom: 1rem;
  }

  .category-name {
    font-size: 2rem;
  }

  .product-image {
    height: 150px;
  }
}
</style>
