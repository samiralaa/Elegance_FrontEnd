<template>
  <div class="products-section">
    <div class="container">
      <div class="title mt-5">
        <fa class="fa-icon" :icon="['fas', 'star']"></fa>
        <h2>{{ $t('home.best-selling') }}</h2>
      </div>
      <div class="row g-4">
        <el-col
          v-for="product in products"
          :key="product.id"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
        >
          <div class="card my-3">
            <div class="img-container p-3 rounded">
              <router-link :to="`/read/products/${product.id}`">
                <img
                  v-if="product.images.length"
                  :src="getImageUrl(product.images[0].path)"
                  :alt="product.name_en"
                  class="product-img card-img bg-light"
                />
              </router-link>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ product.name_en }}</h5>
              <span v-if="product.old_price" class="price-old">{{ product.old_price }} {{ product.currency.name_en }}</span>
              <span class="card-text card-price">
                {{ product.price }} {{ product.currency.name_en }}
              </span>
            </div>
            <div class="product-actions d-flex justify-content-center flex-wrap gap-2">
              <router-link :to="`/read/products/${product.id}`" class="btn btn-light rounded-circle shadow-sm" title="View">
                <fa icon="eye" />
              </router-link>
              <button @click="addToCart(product)" class="btn btn-light shadow-sm rounded-circle">
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

        </el-col>
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

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElNotification } from 'element-plus';
import { useFavoritesStore } from '@/store/favorites'
import { useCartStore } from '@/store/cart'
const products = ref([]);
const showSuccessDialog = ref(false);
const successMessage = ref('');
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()

const fetchProducts = async () => {
  try {
    const response = await axios.get('https://backend.webenia.org/api/website/products/section');

    if (response.data.status && response.data.data) {
      products.value = response.data.data;
      // Fetch favorites after getting products
      await fetchFavorites();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

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

const getImageUrl = (path) => {
  return `https://backend.webenia.org/public/storage/${path}`;
};

const isInFavorites = (productId) => {
  return favoritesStore.favorites.some(favorite => favorite.product_id === productId)
}

const getFavoriteId = (productId) => {
  const favorite = favoritesStore.favorites.find(favorite => favorite.product_id === productId)
  return favorite ? favorite.id : null
}

const addToFavorites = async (product) => {
  try {
    // Check if product is already in favorites
    if (isInFavorites(product.id)) {
      // Get the favorite ID and remove from favorites
      const favoriteId = getFavoriteId(product.id)
      if (favoriteId) {
        await favoritesStore.removeFromFavorites(favoriteId)
        successMessage.value = 'Product removed from favorites'
      }
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
};

const addToCart = async (product) => {
  try {
    const userId = localStorage.getItem('user_id');
    const response = await axios.post(
      'https://backend.webenia.org/api/cart-items',
      {
        product_id: product.id,
        quantity: 1,
        price: product.price,
        user_id: userId
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (response.data.message) {
      successMessage.value = response.data.message || 'Product added to cart';
      showSuccessDialog.value = true;
      cartStore.incrementCount()
      
      // Then fetch the actual count from the server
      await cartStore.fetchCartCount()
      console.log(`Product "${product.name_en}" (ID: ${product.id}) added to cart successfully.`);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (error.response?.status === 401) {
      ElNotification({
        title: '⚠️ Unauthorized',
        message: 'Please login to add to cart.',
        type: 'error',
      });
    } else {
      ElNotification({
        title: '❌ Error',
        message: error.response?.data?.message || 'Something went wrong.',
      });
    }
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
<style scoped>
.products-section {
  padding-bottom: 2rem;
}
.title {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8b6b3d;
}
.fa-icon {
  font-size: 1.2rem;
  background-color: #8b6b3d;
  border-radius: 50%;
  padding: 8px;
  color: #fff;
}

.card {
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  overflow: hidden;
  border: none;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.img-container {
  width: 150px;
  height: 150px;
  position: relative;
  aspect-ratio: 1 / 1;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: scale 0.3s ease;
}

.card:hover img {
  scale: 1.1;
}

.card-title {
  font-size: 1.2rem;
  color: #a67c52;
}

.card-text {
  font-size: 1rem;
  color: #444;
}


.card-body{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
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

.love-btn.active {
  background-color: #ff4d4d;
  color: white;
}

@media (max-width: 768px) {
  .card {
    flex-direction: row;
  }
  .img-container {
    width: 100%;
    height: auto;
  }
  .img-container img {
    height: auto;
  }
  .card-btns {
    justify-content: center;
  }
}
</style>
