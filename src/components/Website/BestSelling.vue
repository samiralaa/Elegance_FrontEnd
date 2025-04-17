<template>
  <div class="products-section">
    <div class="container">
      <div class="title mt-5">
        <fa class="fa-icon" :icon="['fas','star']"></fa>
        <h2>{{ $t('home.products') }}</h2>
      </div>
      <div class="row">
        <el-col v-for="product in products" :key="product.id" :span="6">
          <div class="card col-6 col-sm-12">
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
                <a @click="addToCart(product)" class="cart-btn btn mx-2">
                  <fa icon="cart-plus"></fa>
                </a>
                <a @click="addToFavorites(product)" class="love-btn btn mx-2">
                  <fa icon="heart" /> 
                </a>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ product.name_en }}</h5>
              <p class="card-text">{{ product.price }} {{ product.currency.name_en }}</p>
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
  import { StarFilled, ShoppingCart } from '@element-plus/icons-vue'
  
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
/* new */
  .title{
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #8b6b3d;
  }

  .fa-icon{
    font-size: 1.2rem;
    background-color: #8b6b3d;
    border-radius: 50%;
    padding: 8px;
    color: #fff;
    margin-bottom: 8px;
  }

  .card{
    flex: 0 0 calc(100% / 4 - 30px);
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
</style>
  