<template>
  <div class="brand-detail">
    <!-- Brand Header -->
    <div class="brand-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-3">
            <img :src="getBrandImage(brand)" :alt="currentLang === 'ar' ? brand.name_ar : brand.name_en" class="brand-logo">
          </div>
          <div class="col-md-9">
            <h1 class="brand-name">{{ currentLang === 'ar' ? brand.name_ar : brand.name_en }}</h1>
            <p class="brand-description">{{ currentLang === 'ar' ? brand.description_ar : brand.description_en }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Section -->
    <div class="categories-section py-5">
      <div class="container">
        <h2 class="section-title mb-4">{{ $t('Categories') }}</h2>
        <div class="row">
          <div v-for="category in brand.categories" :key="category.id" class="col-md-4 col-lg-3 mb-4">
            <div class="category-card">
              <router-link :to="`/category/${category.id}`" class="text-decoration-none">
                <div class="category-image">
                  <img :src="getCategoryImage(category)" :alt="currentLang === 'ar' ? category.name_ar : category.name_en">
                </div>
                <div class="category-info">
                  <h3 class="category-name">{{ currentLang === 'ar' ? category.name_ar : category.name_en }}</h3>
                  <p class="category-description">{{ currentLang === 'ar' ? category.description_ar : category.description_en }}</p>
                  <span class="product-count">{{ category.products.length }} {{ $t('Products') }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <div class="products-section py-5 bg-light">
      <div class="container">
        <h2 class="section-title mb-4">{{ $t('Products') }}</h2>
        <div class="row">
          <div v-for="category in brand.categories" :key="category.id">
            <div v-if="category.products.length > 0" class="category-products mb-5">
              <h3 class="category-title mb-4">{{ currentLang === 'ar' ? category.name_ar : category.name_en }}</h3>
              <div class="row">
                <div v-for="product in category.products" :key="product.id" class="col-md-4 col-lg-3 mb-4">
                  <div class="product-card">
                    <router-link :to="`/product/${product.id}`" class="text-decoration-none">
                      <div class="product-image">
                        <img :src="getProductImage(product)" :alt="currentLang === 'ar' ? product.name_ar : product.name_en">
                      </div>
                      <div class="product-info">
                        <h4 class="product-name">{{ currentLang === 'ar' ? product.name_ar : product.name_en }}</h4>
                        <p class="product-price">{{ product.price }} {{ $t('SAR') }}</p>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/store/index.js';

export default {
  name: 'BrandDetail',
  data() {
    return {
      brand: {
        categories: []
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
    this.fetchBrandDetails();
  },
  methods: {
    async fetchBrandDetails() {
      try {
        const brandId = this.$route.params.id;
        const response = await axios.get(`${API_URL}/api/website/brands/${brandId}`);
        this.brand = response.data.data;
      } catch (error) {
        console.error('Error fetching brand details:', error);
        this.error = 'Failed to load brand details';
      } finally {
        this.loading = false;
      }
    },
    getBrandImage(brand) {
      if (brand.images && brand.images.length > 0 && brand.images[0].path) {
        return `${API_URL}/${brand.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },
    getCategoryImage(category) {
      if (category.images && category.images.length > 0 && category.images[0].path) {
        return `${API_URL}/${category.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },
    getProductImage(product) {
      if (product.images && product.images.length > 0 && product.images[0].path) {
        return `${API_URL}/${product.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    }
  }
};
</script>

<style scoped>
.brand-detail {
  padding-top: 2rem;
}

.brand-header {
  background-color: #f8f9fa;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.brand-logo {
  width: 100%;
  max-width: 200px;
  height: auto;
  object-fit: contain;
}

.brand-name {
  color: #8B6B3D;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.brand-description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.section-title {
  color: #8B6B3D;
  font-size: 2rem;
  font-weight: 600;
}

.category-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-image {
  height: 200px;
  overflow: hidden;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-info {
  padding: 1rem;
}

.category-name {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.category-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.product-count {
  color: #8B6B3D;
  font-size: 0.9rem;
  font-weight: 500;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-name {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.product-price {
  color: #8B6B3D;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.category-title {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #8B6B3D;
}

@media (max-width: 768px) {
  .brand-header {
    padding: 2rem 0;
  }

  .brand-logo {
    max-width: 150px;
    margin-bottom: 1rem;
  }

  .brand-name {
    font-size: 2rem;
  }

  .category-image,
  .product-image {
    height: 150px;
  }
}
</style> 