<template>
  <!-- <p>Products</p>
  <div class="product-section">
    <el-row :gutter="20">
      <el-col v-for="product in products" :key="product.id" :span="6">
        <el-card class="product-card" shadow="hover">
          <div class="image-wrapper">
            <router-link :to="`/read/products/${product.id}`">
              <img
                v-if="product.images.length"
                :src="getImageUrl(product.images[0].path)"
                :alt="product.name_en"
                class="product-image"
              />
            </router-link>
            <div class="action-icons">
              <StarFilled @click="addToFavorites(product)" />
              <ShoppingCart @click="addToCart(product)" />
            </div>
          </div>

          <div class="product-info">
            <router-link :to="`/product/${product.id}`">
              <h3 class="product-title">{{ product.name_en }}</h3>
            </router-link>
            <p>{{ product.price }} {{ product.currency.name_en }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div> -->
  <div class="products-section">
    <div class="container">
      <div class="title mt-5">
        <fa class="fa-icon" :icon="['fas','shopping-basket']"></fa>
        <h2>{{ $t('home.products') }}</h2>
      </div>
      <div class="row g-4">
        <div 
          class="col-6 col-md-4 col-lg-3" 
          v-for="product in products" 
          :key="product.id"
        >
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
                <router-link :to="`/product/${product.id}`" class="eye-btn btn mx-2">
                  <fa icon="eye"></fa>
                </router-link>
                <button @click="addToCart(product)" class="btn cart-btn disable">
                  {{ $t('home.add-to-cart') }}
                </button>
                <button @click="addToCart(product)" class="d-none btn cart-btn enable">
                  <fa icon="cart-plus"></fa>
                </button>
                <button @click="addToFavorites(product)" class="love-btn btn mx-2">
                  <fa icon="heart" /> 
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])

const fetchProducts = async () => {
  try {
    const response = await axios.get('https://elegance_commers.test/api/website/products/section')
    if (response.data.status && response.data.data) {
      products.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const getImageUrl = (path) => {
  return `https://elegance_commers.test/storage/${path}`
}

const addToFavorites = async (product) => {
    try {
      const response = await axios.post('https://elegance_commers.test/api/favorites', { product_id: product.id }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.data.success) {
        console.log('test');
        product.isFavorited = !product.isFavorited
        ElNotification({
          title: 'Success',

          message: response.data.message || 'Product added to favorites',
          type: 'success',
        })
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      if (error.response?.status === 401) {
        ElNotification({
          title: 'Error',
          message: 'Please login to add favorites',
          type: 'error',
        })
      } else {
        ElNotification({
          title: 'Error',
          message: error.response?.data?.message || 'Failed to add to favorites',
          type: 'error',
        })
      }
    }
  }

const addToCart = (product) => {
  console.log('Add to Cart:', product)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* new */
  .title{
    margin-bottom: 15px;
    color: #8b6b3d;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .fa-icon{
    font-size: 1.8rem;
    margin-bottom: 8px;
  }

  .card{
    padding: 0;
    border: none;
    box-shadow: 0 10px 20px #2334de1a;
    transition: all 0.2s ease-in;
    z-index: 1;
  }
  .img-container{
    overflow: hidden;
    border-radius: 0.5rem;
    position: relative;
  }
  .card:hover{
    color: #fff;
  }
  img{
    z-index: 0;
    transition: all 0.2s ease-in-out;
  }
  .card:hover img{
    scale: 1.1;
  }
  .card:hover .card-btns{
    transform: translateY(0px);
  }
  .card::after{
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
  .card-btns{
    position: absolute;
    display: flex;
    width: 100%;
    align-items: center;
    bottom: 0;
    transform: translateY(100px);
    width: 100%;
    z-index: 1;
    justify-content: center;
    margin: 30px 0;
    transition: all 0.5s ease-in-out;
  }
  .love-btn,
  .eye-btn{
    background-color: #8b6b3d;
    color: #fff;
    transition: all 0.2s ease-in-out;
  }
  .cart-btn{
    background-color: #fff;
    transition: all 0.2s ease-in-out;
    
  }
  .cart-btn:hover{
    color: #333;
  }
  .cart-btn:hover,
  .love-btn:hover,
  .eye-btn:hover{
    scale: 1.2;
  }
  .card-title{
    color: #8b6b3d;
    transition: all 0.2s ease-in;
  }
  .card:hover .card-title{
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
    .card .img-container {
      height: auto;
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
