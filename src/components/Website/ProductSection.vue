<template>
  <div class="products-section">
    <div class="container">
      <div class="title mt-5">
        <fa class="fa-icon" :icon="['fas','shopping-basket']" />
        <h2>{{ $t('home.products') }}</h2>
      </div>
      <div class="row g-4">
        <div class="col-6 col-md-4 col-lg-3" v-for="product in products" :key="product.id">
          <div class="card h-100">
            <div class="img-container">
              <router-link :to="`/read/products/${product.id}`">
                <img 
                  v-if="product.images.length"
                  :src="getImageUrl(product.images[0].path)"
                  :alt="product.name_en" 
                  class="card-img-top"
                />
              </router-link>
              <div class="card-btns">
                <router-link :to="`/read/products/${product.id}`" class="eye-btn btn mx-2">
                  <fa icon="eye" />
                </router-link>
                <button @click="addToCart(product)" class="btn cart-btn disable">
                  {{ $t('home.add-to-cart') }}
                </button>
                <button @click="addToCart(product)" class="d-none btn cart-btn enable">
                  <fa icon="cart-plus" />
                </button>
                <button 
                  @click="addToFavorites(product)" 
                  class="love-btn btn mx-2"
                  :class="{ 'active': isInFavorites(product.id) }"
                >
                  <fa :icon="isInFavorites(product.id) ? 'fas fa-heart' : 'far fa-heart'" />
                </button>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ product.name_en }}</h5>
              <p class="card-text">{{ product.price }} {{ product.currency.name_en }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Dialog -->
    <el-dialog
      v-model="showSuccessDialog"
      title="Success"
      width="30%"
      :before-close="() => (showSuccessDialog = false)"
    >
      <span>{{ successMessage }}</span>
      <template #footer>
        <el-button type="primary" @click="showSuccessDialog = false">OK</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { useFavoritesStore } from '@/store/favorites'
import { useCartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'

const products = ref([])
const showSuccessDialog = ref(false)
const successMessage = ref('')
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://elegance_backend.test/api/website/products/section', {
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
    const response = await axios.get('http://elegance_backend.test/api/favorites', {
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

const getImageUrl = (path) => `http://elegance_backend.test/storage/${path}`

const isInFavorites = (productId) => {
  return favoritesStore.favorites.some(favorite => favorite.product_id === productId)
}

const getFavoriteId = (productId) => {
  return favoritesStore.favorites.find(favorite => favorite.product_id === productId)?.id
}

const addToFavorites = async (product) => {
  try {
    // Check if product is already in favorites
    if (isInFavorites(product.id)) {
      // Remove from favorites
      const favoriteId = getFavoriteId(product.id);
      if (favoriteId) {
        await favoritesStore.removeFromFavorites(favoriteId);
      }
      successMessage.value = 'Product removed from favorites'
    } else {
      // Add to favorites
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
    const payload = {
      product_id: product.id,
      quantity: 1,
      price: product.price,
    }

    if (product.amounts) {
      console.log('Amounts:', product.amounts);
      payload.amount_id = product.amount_id
    }

    const response = await axios.post('http://elegance_backend.test/api/cart-items', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    if (response.data.message) {
      successMessage.value = response.data.message
      showSuccessDialog.value = true
      
      // Immediately increment the cart count
      cartStore.incrementCount()
      
      // Then fetch the actual count from the server
      await cartStore.fetchCartCount()
    }
  } catch (error) {
    console.error('Cart error:', error)
    ElNotification({
      title: '❌',
      message: error.response?.data?.message || 'Login required to add to cart',
      type: 'error'
    })
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.title {
  margin-bottom: 15px;
  color: #8b6b3d;
  display: flex;
  align-items: center;
  gap: 10px;
}

.fa-icon {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.card {
  padding: 0;
  border: none;
  box-shadow: 0 10px 20px #2334de1a;
  transition: all 0.2s ease-in;
  z-index: 1;
}

.img-container {
  overflow: hidden;
  border-radius: 0.5rem;
  position: relative;
}

.card:hover img {
  scale: 1.1;
}

.card:hover .card-btns {
  transform: translateY(0px);
}

.card::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  height: 105%;
  width: 105%;
  background-color: #8b6b3d;
  border-radius: 8px;
  transform: translate(-50%, -50%) scale(0);
  z-index: -1;
  transition: transform 0.3s ease;
}

.card:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.card-btns {
  position: absolute;
  display: flex;
  width: 100%;
  align-items: center;
  bottom: 0;
  transform: translateY(100px);
  z-index: 1;
  justify-content: center;
  margin: 30px 0;
  transition: all 0.5s ease-in-out;
}

.love-btn,
.eye-btn {
  background-color: #8b6b3d;
  color: #fff;
  transition: all 0.2s ease-in-out;
}

.love-btn.active {
  background-color: #ff0000;
  color: #fff;
}

.love-btn i {
  font-size: 1.2rem;
  transition: all 0.2s ease-in-out;
}

.love-btn:hover {
  scale: 1.2;
}

.cart-btn {
  background-color: #fff;
  transition: all 0.2s ease-in-out;
}

.cart-btn:hover {
  color: #333;
}

.cart-btn:hover,
.eye-btn:hover {
  scale: 1.2;
}

.card-title {
  color: #8b6b3d;
  transition: all 0.2s ease-in;
}

.card:hover .card-title {
  color: #fff;
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
}

@media (max-width: 576px) {
  .card-body {
    padding: 1rem 0.5rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-text {
    font-size: 0.9rem;
  }
}
</style>
