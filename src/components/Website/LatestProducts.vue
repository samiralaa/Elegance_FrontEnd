<template>
<<<<<<< Updated upstream
  <!-- <div class="latest-products">
    <h2 class="title">Latest Products</h2>
=======
  <div class="latest-products">
    <h2 class="title">{{ $t('LatestProducts.LatestProducts') }}</h2>
>>>>>>> Stashed changes
    <el-row :gutter="20">
      <el-col v-for="product in products" :key="product.id" :span="6">
        <el-card class="product-card" shadow="hover">
          <div class="image-wrapper">
            <router-link class="router-link" :to="`/read/products/${product.id}`">
              <img
                v-if="product.images.length"
                :src="getImageUrl(product.images[0].path)"
                :alt="product.name_en"
                class="product-image"
              />
            </router-link>
          </div>
          <div class="product-info">
            <router-link :to="`/read/products/${product.id}`" class="product-title">
              <h3>{{ product.name_en }}</h3>
            </router-link>
            <div class="card-btns">
              <router-link :to="`/product/${product.id}`" class="eye-btn btn mx-2">
                <fa icon="eye"></fa>
              </router-link>
              <a @click="addToCart(product)" class="cart-btn btn mx-2">
                {{ $t('home.add-to-cart') }}
              </a>
              <a @click="addToFavorites(product)" class="love-btn btn mx-2">
                <fa icon="heart" /> 
              </a>
            </div>
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
      <div v-for="product in products" :key="product.id" :span="6" class="row d-flex justify-content-center g-4">

          <div class="card">
            <div class="img-container">
              <router-link :to="`/read/products/${product.id}`">
                <img 
                  v-if="product.images.length"
                  :src="getImageUrl(product.images[0].path)"
                  :alt="product.name_en" 
                  class="card-img-top"
                />
              </router-link>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ product.name_en }}</h5>
              <div class="card-btns">
                <router-link :to="`/product/${product.id}`" class="eye-btn btn">
                  <fa icon="eye"></fa>
                </router-link>
                <a @click="addToCart(product)" class="cart-btn btn">
                  {{ $t('home.add-to-cart') }}
                </a>
                <a @click="addToFavorites(product)" class="love-btn btn">
                  <fa icon="heart" /> 
                </a>
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
import { StarFilled, ShoppingCart } from '@element-plus/icons-vue'

const products = ref([])

const fetchLatestProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/website/latest/products')
    if (response.data.status) {
      products.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching latest products:', error)
  }
}

const getImageUrl = (path) => {
  return `http://127.0.0.1:8000/storage/${path}`
}

const addToFavorites = (product) => {
  console.log('Favorite:', product.name_en)
}

const addToCart = (product) => {
  console.log('Add to cart:', product.name_en)
}

onMounted(fetchLatestProducts)
</script>

<style scoped>
/* .latest-products {
  padding: 20px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
.product-card {
  transition: box-shadow 0.3s ease;
}
.image-wrapper {
  position: relative;
}
.image-wrapper{
  height: 220px !important;
  width: 220px !important;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
}
.product-info {
  text-align: center;
  margin-top: 10px;
}
.product-title {
  color: inherit;
  text-decoration: none;
}
.product-title:hover {
  color: #409EFF;
}
.category {
  font-size: 13px;
  color: #999;
}
.action-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.product-card:hover .action-icons {
  opacity: 1;
}
.action-icons > * {
  background-color: white;
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.2s;
}
.action-icons > *:hover {
  transform: scale(1.2);
} */

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
    align-self: start;
  }
  .card{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    border: none;
    box-shadow: none !important;
    transition: all 0.2s ease-in;
    z-index: 1;
    width: fit-content;
  }
  .img-container{
    display: flex;
    overflow: hidden;
    border-radius: 50%;
    position: relative;
    width: 220px;
    height: 220px;
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
  .card:hover .love-btn,
  .card:hover .eye-btn{
    background-color: #fff;
    color: #333;
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
    display: flex;
    width: fit-content;
    z-index: 1;
    justify-content: center;
    margin:0;
    transition: all 0.5s ease-in-out;
    gap: 10px;
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
    scale: 1.1;
  }
  .products-section .container .row{
    display: flex;
    justify-content: space-between;
  }
  .card-title{
    color: #8b6b3d;
    text-align: center;
    transition: all 0.2s ease-in;
  }
  .card:hover .card-title{
    color: #fff;
  }
</style>
