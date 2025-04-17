<template>
  <div class="products-section">
    <div class="container">
      <div class="title mt-5">
        <fa class="fa-icon" :icon="['fas','star']"></fa>
        <h2>{{ $t('home.best-selling') }}</h2>
      </div>
      <div class="row">
        <el-col 
          v-for="product in products" 
          :key="product.id" 
          :xs="24" :sm="24" :md="12" :lg="12"
        >
          <div class="card my-3">
            <div class="img-container">
              <router-link :to="`/read/products/${product.id}`">
                <img 
                  v-if="product.images.length"
                  :src="getImageUrl(product.images[0].path)"
                  :alt="product.name_en"
                />
              </router-link>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ product.name_en }}</h5>
              <p class="card-text">{{ product.price }} {{ product.currency.name_en }}</p>
            </div>
            <div class="card-btns">
              <router-link :to="`/product/${product.id}`" class="btn eye-btn">
                <fa icon="eye"></fa>
              </router-link>
              <button @click="addToCart(product)" class="btn cart-btn">
                <fa icon="cart-plus"></fa>
              </button>
              <button @click="addToFavorites(product)" class="btn love-btn">
                <fa icon="heart"></fa>
              </button>
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

const products = ref([])

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/website/products/section')
    if (response.data.status && response.data.data) {
      products.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const getImageUrl = (path) => {
  return `http://127.0.0.1:8000/storage/${path}`
}

const addToFavorites = (product) => {
  console.log('Add to Favorites:', product)
}

const addToCart = (product) => {
  console.log('Add to Cart:', product)
}

onMounted(() => {
  fetchProducts()
})
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
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  border: none;
  box-shadow: 0 10px 20px #2334de1a;
  overflow: hidden;
  transition: 0.3s ease-in-out;
  padding: 1rem;
  gap: 1rem;
  z-index: 0;
}

.img-container {
  flex: 0 0 150px;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #8b6b3d;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease-in;

}

.card-text {
  color: #333;
  font-size: 1rem;
  transition: all 0.2s ease-in;

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
  flex-direction: column;
  z-index: 1;
  gap: 10px;
  justify-content: center;
  margin: 30px;
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

.card:hover .love-btn,
.card:hover .eye-btn{
  background-color: #fff;
  color: #333;
}

.card:hover .card-title,
.card:hover .card-text{
  color: #fff;
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
