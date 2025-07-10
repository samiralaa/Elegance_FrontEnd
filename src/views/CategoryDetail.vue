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
            <h2 class="section-title">{{ $t('Products.Products') }}</h2>
            <div class="products-count">{{ category.products.length }} {{ $t('Products.Products') }}</div>
          </div>
          <section class="products-grid">
            <div v-for="product in category.products" :key="product.id" class="product-card">
              <div class="image-container mb-3 bg-light rounded">
               <RouterLink :to="`/read/products/${product.id}`" class="product-link">
                 <img :src="getProductImage(product)" :alt="currentLang === 'ar' ? product.name_ar : product.name_en"/>
               </RouterLink>
                <div v-if="!product.is_available" class="sale-badge">{{ $t('products.outOfStock') }}</div>
                <div class="product-actions d-flex justify-content-center gap-5 w-100">
                  <router-link :to="`/read/products/${product.id}`" class="btn btn-light rounded-circle shadow-sm" title="View">
                    <fa icon="eye" />
                  </router-link>
                  <button
                    @click="addToFavorites(product)"
                    class="btn rounded-circle shadow-sm btn-light"
                    :class="isInFavorites(product.id) ? 'text-danger' : ''"
                    :title="isInFavorites(product.id) ? 'Remove from favorites' : 'Add to favorites'"
                  >
                    <fa :icon="isInFavorites(product.id) ? 'fas fa-heart' : 'far fa-heart'" />
                  </button>
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ product.name_en }}</h5>
                <div class="price-container">
                  <span v-if="product.discount && product.discount.length > 0" class="discount-badge">
                    {{ product.discount[0].discount_value }}% OFF
                  </span>

                  <span v-if="product.discount && product.discount.length > 0 && product.old_price" class="price-old">
                    {{ product.old_price }} {{ product.currency_code }}
                  </span>
                  <span class="card-text card-price">
                    {{ calculateDiscountedPrice(product) }} {{ product.currency_code }}
                  </span>
                </div>
              </div>
              <div class="addToCart-btn" :style="{ cursor: !product.is_available ? 'not-allowed' : 'pointer' }">
                <button 
                  :disabled="!product.is_available" 
                  @click="addToCart(product)" 
                  class="btn"
                >
                  {{ $t('products.addToCart') }}
                </button>
              </div>
            </div>
          </section>
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
import { ElNotification } from 'element-plus'
import { useFavoritesStore } from '@/store/favorites'

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
      error: null,
      lang: localStorage.getItem('lang') || 'en',
      favoritesStore: null,
    };
  },
  computed: {
    currentLang() {
      return this.lang === 'ar' ? 'ar' : 'en';
    }
  },
  created() {
    this.fetchCategoryDetails();
    this.favoritesStore = useFavoritesStore();
    if (localStorage.getItem('auth_token')) {
      this.favoritesStore.fetchFavorites();
    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loading = true;
        this.fetchCategoryDetails();
        if (localStorage.getItem('auth_token')) {
          this.favoritesStore.fetchFavorites();
        }
      }
    }
  },
methods: {
  async fetchCategoryDetails() {
    try {
      const selectedCurrency =
        JSON.parse(localStorage.getItem('selectedCurrency')) || { code: 'USD' }
      const categoryId = this.$route.params.id;
      const response = await axios.get(
        `${API_URL}/api/website/category/${categoryId}`,
        {
          headers: {
            Currency: selectedCurrency.code,
          }
        }
      );
      this.category = response.data.data;
    } catch (error) {
      console.error('Error fetching category details:', error);
      this.error = 'Failed to load category details';
    } finally {
      this.loading = false;
    }
  },

  getCategoryImage(category) {
    if (category.images?.length > 0 && category.images[0].path) {
      return `${API_URL}/public/storage/${category.images[0].path}`;
    }
    return '/placeholder-image.jpg';
  },

  getBrandImage(brand) {
    if (brand.images?.length > 0) {
      const imagePath = brand.images[0].path;
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return `${API_URL}/public/storage/${imagePath.replace(/^\/+/, '')}`;
    }
    return '/placeholder-image.jpg';
  },

  getProductImage(product) {
    if (product.images?.length > 0 && product.images[0].path) {
      return `${API_URL}/public/storage/${product.images[0].path}`;
    }
    return '/placeholder-image.jpg';
  },

  async addToCart(product) {
    try {
      const selectedCurrency =
        JSON.parse(localStorage.getItem('selectedCurrency')) || { code: 'USD' }

      const response = await axios.post(
        'https://backend.webenia.org/api/cart-items',
        {
          product_id: product.id,
          quantity: 1,
          price: parseFloat(product.price)
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Currency: selectedCurrency.code,
          }
        }
      )

      if (response.data.status) {
        ElNotification({
          title: this.$t('success'),
          message: response.data.message,
          type: 'success'
        })
      } else {
        ElNotification({
          title: this.$t('error'),
          message: response.data.message,
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      ElNotification({
        title: this.$t('error'),
        message: error.response?.data?.message,
        type: 'error'
      })
    }
  },

  isInFavorites(productId) {
    return this.favoritesStore && this.favoritesStore.isInFavorites(productId)
  },

  async addToFavorites(product) {
    try {
      if (!localStorage.getItem('auth_token')) {
        ElNotification({
          title: this.$t('error'),
          message: this.$t('login_required_favorite') || 'Login required to favorite product',
          type: 'error'
        })
        return
      }
      if (this.isInFavorites(product.id)) {
        const favorite = this.favoritesStore.favorites.find(fav => fav.product_id === product.id)
        const favoriteId = favorite ? (favorite.favorite_id || favorite.id) : null
        if (favoriteId) {
          await this.favoritesStore.removeFromFavorites(favoriteId)
          ElNotification({
            title: this.$t('success'),
            message: this.$t('favorite_removed') || 'Product removed from favorites',
            type: 'success'
          })
        }
      } else {
        const response = await this.favoritesStore.addToFavorites(product.id)
        ElNotification({
          title: this.$t('success'),
          message: response.message || this.$t('favorite_added') || 'Product added to favorites',
          type: 'success'
        })
      }
    } catch (error) {
      console.error('Favorite error:', error)
      ElNotification({
        title: this.$t('error'),
        message: error.response?.data?.message || this.$t('login_required_favorite') || 'Login required to favorite product',
        type: 'error'
      })
    }
  },

  calculateDiscountedPrice(product) {
    if (product.discount && product.discount.length > 0) {
      const discountValue = parseFloat(product.discount[0].discount_value)
      const originalPrice = parseFloat(product.converted_price || product.price)
      const discountedPrice = originalPrice - (originalPrice * (discountValue / 100))
      return discountedPrice.toFixed(2)
    }
    return product.converted_price || product.price
  }
},
mounted() {
  this.fetchCategoryDetails();
  if (localStorage.getItem('auth_token')) {
    this.favoritesStore.fetchFavorites();
  }

  window.addEventListener('currency-changed', () => {
    this.fetchCategoryDetails();
  });
},

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
    height: 100%;
    display: flex;
    flex-direction: column;
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
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    z-index: 10;
  }

  .product-card:hover .product-actions {
    transform: translateX(-50%) translateY(-30%);
    opacity: 1;
  }

  .btn {
    font-size: 1.5rem;
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
    left: 10px;
    background: #ff4c4c;
    color: white;
    padding: 4px 12px;
    font-size: 12px;
    border-radius: 5px;
  }
  .card-body{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .card-title {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .card-price {
    background-color: #e8f5e9;
    display: inline-block;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.95rem;
    text-align: center;
    margin-bottom: 10px;
  }

  .price-old {
    text-decoration: line-through;
    color: #aaa;
    display: inline-block;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.95rem;
    text-align: center;
  }

  .card-title {
    color: #8b6b3d;
    transition: all 0.2s ease-in;
    font-weight: 600;
    font-size: 1.2rem;
  }

  .addToCart-btn {
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
  }
  .addToCart-btn button {
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
  .addToCart-btn button::before {
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
  .addToCart-btn button:hover {
    color: #fff;
    border-radius: 6px;
  }
  .addToCart-btn button:hover::before {
    height: 100%;
  }

  @media (max-width: 1200px) {
    .product-actions {
      position: absolute;
      bottom: 5%;
      left: 0%;
      opacity: 1;
      transform: translateX(0) translateY(0);
      z-index: 10;
    }

    
    .product-card:hover .product-actions {
      transform: translateX(0) translateY(0);
    }
    .card-body {
      flex-direction: column;
    }
  }
  .price-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .discount-badge {
    background-color: #ff4d4d;
    color: white;
    padding: 0.35rem 0.8rem;
    border-radius: 999px;
    font-size: 1.1rem;
    font-weight: 700;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(255,76,76,0.15);
  }

  .product-card.unavailable {
    opacity: 0.5;
    pointer-events: none;
    filter: grayscale(60%);
  }
</style>
