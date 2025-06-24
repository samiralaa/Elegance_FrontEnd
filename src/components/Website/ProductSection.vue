<template>
  <div class="products-section">
    <div class="container">
      <div class="title section-header d-flex align-items-center mb-4">
        <fa class="fa-icon me-2" :icon="['fas', 'shopping-basket']" />
        <h2 class="mb-0">{{ $t('home.products') }}</h2>
      </div>
      <div class="row g-3">
        <div class="col-6 col-md-4 col-lg-3" v-for="product in products" :key="product.id">
          <div class="product-card card border-0 h-100">
            <div class="position-relative overflow-hidden bg-light">
              <router-link :to="`/read/products/${product.id}`">
                <img
                  v-if="product.images.length"
                  :src="getImageUrl(product.images[0].path)"
                  :alt="product.name_en"
                  class="card-img-top product-img"
                />
              </router-link>
              <div v-if="!product.is_available" class="sale-badge">{{ $t('products.outOfStock') }}</div>
              <!-- Action Buttons -->
              <div class="product-actions d-flex justify-content-center gap-2 w-100">
                <router-link :to="`/read/products/${product.id}`" class="btn btn-light rounded-circle shadow-sm" title="View">
                  <fa icon="eye" />
                </router-link>
                <button 
                  @click="addToCart(product)" 
                  class="btn btn-light shadow-sm"
                  :class="{ 'disabled': !product.is_available }"
                  :disabled="!product.is_available"
                >
                  {{ $t('home.add-to-cart') }}
                </button>
                <button 
                  @click="addToCart(product)" 
                  class="d-none btn rounded-circle btn-light shadow-sm"
                  :class="{ 'disabled': !product.is_available }"
                  :disabled="!product.is_available"
                >
                  <fa icon="cart-plus" />
                </button>
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
                  -{{ product.discount[0].discount_value }}
                </span>
                <span v-if="product.discount && product.discount.length > 0" class="price-old">
                  {{ product.price }} {{ product.currency.name_en }}
                </span>
                <span class="card-text card-price">
                  {{ calculateDiscountedPrice(product) }} {{ product.currency.name_en }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Dialog -->

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { useFavoritesStore } from '@/store/favorites'
import { useCartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const products = ref([])
const showSuccessDialog = ref(false)
const successMessage = ref('')
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const { t } = useI18n()

const fetchProducts = async () => {
  try {
    const response = await axios.get('https://backend.webenia.org/api/website/products/section', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    })

    if (response.data.status && response.data.data) {
      products.value = response.data.data
      // Fetch favorites after getting products
      await fetchFavorites()
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const fetchFavorites = async () => {
  try {
    const response = await axios.get('https://backend.webenia.org/api/favorites', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    
    if (response.data.status && response.data.data) {
      // Update favorites store with the fetched favorites
      favoritesStore.setFavorites(response.data.data)
    }
  } catch (error) {
    console.error('Error fetching favorites:', error)
  }
}

const getImageUrl = (path) => `https://backend.webenia.org/public/storage/${path}`

const isInFavorites = (productId) => {
  return favoritesStore.favorites.some(favorite => favorite.product_id === productId)
}

const getFavoriteId = (productId) => {
  return favoritesStore.favorites.find(favorite => favorite.product_id === productId)?.id
}

const addToFavorites = async (product) => {
  try {
    if (isInFavorites(product.id)) {
      const favoriteId = getFavoriteId(product.id);
      if (favoriteId) {
        await favoritesStore.removeFromFavorites(favoriteId);
      }
      successMessage.value = 'Product removed from favorites'
    } else {
      const response = await favoritesStore.addToFavorites(product.id)
      successMessage.value = response.message
    }
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Favorite error:', error)
    ElNotification({
      title: '⚠️',
      message: error.response?.data?.message || 'Login required to favorite product',
      type: 'error'
    })
  }
}

const addToCart = async (product) => {
  try {
    const response = await axios.post(
      'https://backend.webenia.org/api/cart-items',
      {
        product_id: product.id,
        quantity: 1,
        price: parseFloat(product.price)
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      }
    )

    if (response.data.status) {
      ElNotification({
        title: t('success'),
        message: response.data.message ,
        type: 'success'
      })
    } else {
      ElNotification({
        title: t('error'),
        message: response.data.message,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    ElNotification({
      title: t('error'),
      message: error.response?.data?.message,
      type: 'error'
    })
  }
}

const calculateDiscountedPrice = (product) => {
  if (product.discount && product.discount.length > 0) {
    const discountValue = parseFloat(product.discount[0].discount_value)
    const originalPrice = parseFloat(product.price)
    const discountedPrice = originalPrice - (originalPrice * (discountValue / 100))
    return discountedPrice.toFixed(2)
  }
  return product.price
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.section-header {
  font-size: 1.6rem;
  font-weight: 600;
  color: #8b6b3d;
}


.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 1rem;
  overflow: hidden;
  background-color: #fff;
  padding: 0 !important;
}

.product-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.product-img {
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.product-actions {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
  transition: all 0.3s ease-in-out;
  z-index: 10;
  pointer-events: auto;
}

.product-card:hover .product-actions {
  transform: translateX(-50%) translateY(-30%);
  opacity: 1;
  pointer-events: auto;
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

.btn {
  font-size: 1.1rem;
}


.card-title {
  color: #8b6b3d;
  transition: all 0.2s ease-in;
  font-weight: 600;
  font-size: 1.2rem;
}

@media (max-width: 1200px) {
  .disable {
    display: none;
  }

  .enable {
    display: block !important;
  }

  .product-actions {
    position: absolute;
    bottom: 7%;
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

@media (max-width: 768px) {
  .card-title {
    font-size: 1.1rem;
  }

  .card-text {
    font-size: 0.95rem;
  }


  .btn {
    font-size: 0.9rem;
  }

}

@media (max-width: 576px) {
  .card-body {
    padding: 1rem 0.5rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-text {
    font-size: 0.8rem;
  }
}

.price-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.discount-badge {
  background-color: #ff4d4f;
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
}

.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
