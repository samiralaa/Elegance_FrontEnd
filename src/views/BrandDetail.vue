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
    <div class="all-categories py-5">
      <div class="container">
        <div class="title">
          <i class="fas fa-th-large fa-icon"></i>
          <h2 class="section-title mb-0">{{ $t('Categories') }}</h2>
        </div>

        <div class="slider-wrapper">
          <div class="slider row slick-track">
            <div
              v-for="category in brand.categories"
              :key="category.id"
              class="col-md-4 col-lg-3"
            >
              <router-link
                :to="`/category/${category.id}`"
                class="card text-decoration-none"
              >
                <div class="category-content">
                  <img
                    :src="getCategoryImage(category)"
                    :alt="currentLang === 'ar' ? category.name_ar : category.name_en"
                  />
                  <p>{{ currentLang === 'ar' ? category.name_ar : category.name_en }}</p>
                  <span class="product-count">{{ category.products.length }} {{ $t('Products') }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Products Section -->
  <div class="products-section py-5">
    <div class="container">
      <h2 class="section-title mb-4">{{ $t('Products') }}</h2>

      <div v-for="category in brand.categories" :key="category.id">
        <div v-if="category.products.length > 0" class="category-products mb-5">
          <h3 class="category-title mb-4">{{ currentLang === 'ar' ? category.name_ar : category.name_en }}</h3>

          <div class="products-grid">
            <div v-for="product in category.products" :key="product.id" class="product-card">

              <div class="image-container">
                <img :src="getProductImage(product)" :alt="currentLang === 'ar' ? product.name_ar : product.name_en" />

                <div class="product-actions">
                  <router-link :to="`/read/products/${product.id}`" class="action-btn cart-btn">
                    <i class="fas fa-shopping-cart icon"></i>
                  </router-link>
                  <button @click="addToFavorites(product)" class="action-btn love-btn">
                    <i class="fas fa-heart icon"></i>
                  </button>
                </div>

                <div v-if="product.discount" class="sale-badge">{{ $t('Sale') }}</div>
              </div>

              <div class="product-info">
                <h4 class="product-title">{{ currentLang === 'ar' ? product.name_ar : product.name_en }}</h4>
                <div class="prices">
                  <span class="price-new">{{ product.price }} {{ $t('SAR') }}</span>
                  <span v-if="product.old_price" class="price-old">{{ product.old_price }} {{ $t('SAR') }}</span>
                </div>
                <div class="addToCart-btn mt-3">
                  <a  @click="addToCart(product)">{{ $t('products.addToCart') }}</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <el-dialog
    v-model="showSuccessDialog"
    title="🎉 Success"
    width="30%"
    :before-close="() => (showSuccessDialog = false)"
    :center="true"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <span>{{ successMessage }}</span>
    <template #footer>
      <el-button type="primary" @click="showSuccessDialog = false">OK</el-button>
    </template>
  </el-dialog>
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
      error: null,
      successMessage: '',
      showSuccessDialog: false,
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
        return `${API_URL}/public/storage/${brand.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },

    getCategoryImage(category) {
      if (category.images && category.images.length > 0 && category.images[0].path) {
        return `${API_URL}/public/storage/${category.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },

    getProductImage(product) {
      if (product.images && product.images.length > 0 && product.images[0].path) {
        return `${API_URL}/public/storage/${product.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },

    async addToFavorites(product) {
      try {
        const response = await axios.post(
          'https://backend.webenia.org/api/favorites',
          { product_id: product.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
          }
        );

        if (response.data.message) {
          product.isFavorited = !product.isFavorited;
          this.successMessage = response.data.message || 'Product added to favorites';
          this.showSuccessDialog = true;
          console.log(`Product "${product.name_en}" (ID: ${product.id}) added to favorites successfully.`);
        }
      } catch (error) {
        console.error('Error adding to favorites:', error);
        if (error.response?.status === 401) {
          this.$notify({
            title: '⚠️ Unauthorized',
            message: 'Please login to add to favorites.',
            type: 'error',
          });
        } else {
          this.$notify({
            title: '❌ Error',
            message: error.response?.data?.message || 'Something went wrong.',
            type: 'error',
          });
        }
      }
    },

    async addToCart(product) {
      try {
        const payload = {
          product_id: product.id,
          quantity: 1,
          price: product.price,
        };

        if (product.amounts) {
          console.log('Amounts:', product.amounts);
          payload.amount_id = product.amount_id;
        }

        const response = await axios.post(
          'https://backend.webenia.org/api/cart-items',
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
          }
        );

        if (response.data.message) {
          this.successMessage = response.data.message;
          this.showSuccessDialog = true;
        }
      } catch (error) {
        console.error('Cart error:', error);
        this.$notify({
          title: '❌',
          message: error.response?.data?.message || 'Login required to add to cart',
          type: 'error',
        });
      }
    },
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

.slider-wrapper {
  position: relative;
  overflow: hidden;
  padding: 16px 0;
}

.slick-track{
  width: 100%;
  overflow: hidden !important;
}

.nav-button {
  background-color: #8b6b3d;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background-color: #725932;
}

.slider {
  display: flex !important;
}

.card {
  background-color: #f7f7f7;
  border: none;
  padding: 12px;
  margin: 15px;
  transition: all 0.3s ease;
  text-align: center;
  text-decoration: none;
  width: 100%;

}

.card::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: #8b6b3d;
  border-radius: 8px;
  transform: translate(-50%, -50%) scale(0);
  z-index: -1;
  transition: transform 0.3s ease;
}

.card:hover {
  color: #fff;
  transform: scale(1.1);
  z-index: 1;
}

.product-count {
  background-color: rgba(139, 107, 61, 0.8);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #fff;
  transition: color 0.3s ease;
}

.card:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.category-content img {
  border-radius: 8px;
  width: 100%;
  height: auto;
}

.category-content p {
  margin-top: 8px;
  font-weight: bold;
}


@media (max-width: 1200px) {
  .scrollers {
    display: flex;
  }
}

@media (max-width: 768px) {
  .card:hover {
    transform: scale(1);
    color: #333 !important;
  }
  .card:hover::after {
    transform: translate(-50%, -50%) scale(0);
  }
}

@media (max-width: 576px) {
  .nav-button {
    font-size: 1.1rem;
  }
}


.products-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  .product-card {
    position: relative;
    background: #fff;
    text-align: center;
    transition: box-shadow 0.3s;
    height: fit-content;
  }
  .image-container {
    position: relative;
    background: #f9f9f9;
    overflow: hidden;
    border-radius: 5px;
  }
  .image-container img {
    width: 100%;
    height: auto;
    transition: transform 0.3s ease;
  }
  .product-card:hover .image-container img {
    transform: scale(1.1);
  }
  .product-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
  .product-card:hover .product-actions {
    transform: translateY(0);
  }
  .action-btn {
    border: none;
    border-radius: 10px;
    width: 100%;
    height: 45px;
    display: flex;
    margin: 1rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .icon {
    font-size: 1.2rem;
    transition: all 0.2s ease;
  }
  .action-btn:hover .icon {
    transform: scale(1.2);
  }
  .cart-btn {
    background-color: #fff;
    color: #8b6b3d;
  }
  .love-btn {
    background-color: #8b6b3d;
    color: #fff;
  }
  .sale-badge {
    position: absolute;
    top: 10px;
    left: -15px;
    background: #ff4c4c;
    color: white;
    padding: 4px 12px;
    font-size: 12px;
    border-radius: 5px;
  }
  .product-info {
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  .product-info .product-title {
    font-weight: bolder;
    font-size: 1.4rem;
  }
  .prices {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .price-new {
    color: #8b6500;
    font-size: 1.4rem;
    font-weight: bold;
  }
  .price-old {
    text-decoration: line-through;
    color: #aaa;
    font-size: 1.2rem;
    margin-right: 8px;
  }
  .addToCart-btn {
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
  }
  .addToCart-btn a {
    position: relative;
    padding: 0.75rem 1.5rem;
    color: #8b6b3d;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    width: 100%;
    overflow: hidden;
    z-index: 0;
    border-radius: 0;
  }
  .addToCart-btn a::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #8b6b3d;
    transition: height 0.3s ease;
    z-index: -1;
  }
  .addToCart-btn a:hover {
    color: #fff;
    border-radius: 6px;
  }
  .addToCart-btn a:hover::before {
    height: 100%;
  }
</style> 