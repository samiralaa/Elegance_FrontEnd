<template>
  <div class="products-section py-5">
    <div class="container">
      <div class="title section-header d-flex align-items-center mb-4">
        <fa class="fa-icon me-2" :icon="['fas', 'shopping-basket']" />
        <h2 class="mb-0">{{ $t('LatestProducts.LatestProducts') }}</h2>
      </div>

      <div class="row justify-content-center g-4">
        <el-col
          v-for="product in products"
          :key="product.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="d-flex justify-content-center"
        >
          <div class="product-card card h-100 w-100">
            <div class="img-container overflow-hidden bg-light m-2 rounded-circle">
              <router-link :to="`/read/products/${product.id}`">
                <img
                  v-if="product.images.length"
                  :src="getImageUrl(product.images[0].path)"
                  :alt="product.name_en"
                  class="product-img card-img-top"
                />
              </router-link>
              <div v-if="!product.is_available" class="sale-badge">{{ $t('products.outOfStock') }}</div>
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

              <div class="product-actions d-flex justify-content-center flex-wrap gap-2">
                <router-link :to="`/read/products/${product.id}`" class="btn btn-light rounded-circle shadow-sm" title="View">
                  <fa icon="eye" />
                </router-link>
                <button @click="addToCart(product)" :disabled="!product.is_available" class="btn btn-light shadow-sm">
                  {{ $t('home.add-to-cart') }}
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
          </div>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { useFavoritesStore } from '@/store/favorites'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'
import { useI18n } from 'vue-i18n'

const products = ref([])
const showSuccessDialog = ref(false)
const successMessage = ref('')
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const { t } = useI18n()

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://elegance_backend.test/api/website/products/section', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
    if (response.data.status && response.data.data) {
      products.value = response.data.data
      await fetchFavorites()
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const fetchFavorites = async () => {
  try {
    const response = await axios.get('http://elegance_backend.test/api/favorites', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    if (response.data.status && response.data.data) {
      favoritesStore.setFavorites(response.data.data)
    }
  } catch (error) {
    console.error('Error fetching favorites:', error)
  }
}

const getImageUrl = (path) => `http://elegance_backend.test/public/storage/${path}`

const isInFavorites = (productId) => {
  return favoritesStore.favorites.some(fav => fav.product_id === productId)
}

const getFavoriteId = (productId) => {
  return favoritesStore.favorites.find(fav => fav.product_id === productId)?.id
}

const addToFavorites = async (product) => {
  try {
    if (isInFavorites(product.id)) {
      const favoriteId = getFavoriteId(product.id)
      if (favoriteId) {
        await favoritesStore.removeFromFavorites(favoriteId)
        successMessage.value = 'Product removed from favorites'
      }
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

const calculateDiscountedPrice = (product) => {
  if (product.discount && product.discount.length > 0) {
    const discountValue = parseFloat(product.discount[0].discount_value)
    const originalPrice = parseFloat(product.price)
    const discountedPrice = originalPrice - (originalPrice * (discountValue / 100))
    return discountedPrice.toFixed(2)
  }
  return product.price
}

const addToCart = async (product) => {
  try {
    const payload = {
      product_id: product.id,
      quantity: 1,
      price: calculateDiscountedPrice(product),
    }

    if (product.amounts && product.amounts.length > 0) {
      payload.amount_id = product.amounts[0].id
    }

    const response = await axios.post('http://elegance_backend.test/api/cart-items', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })

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
  border: none;
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


.card-title {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.card-body{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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

.price-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 10px;
}

.discount-badge {
  background-color: #ff4d4f;
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
}

.sale-badge {
  position: absolute;
  top: 50px;
  left: 10px;
  background: #ff4c4c;
  color: white;
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 5px;
}

.btn {
  font-size: 1.1rem;
  border: none;
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
}

@media (max-width: 768px) {
  .card-title {
    font-size: 1.1rem;
    text-align: center;
  }

  .card-text {
    text-align: center;
    font-size: 0.95rem;
  }
  .product-card {
    margin: 0 2rem;
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
</style>
