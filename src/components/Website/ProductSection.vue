<template>
  <p>Products</p>
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
.product-section {
  padding: 20px;
}
.product-info {
  text-align: center;
}
.product-title {
  cursor: pointer;
  color: #333;
  transition: color 0.3s;
}
.product-title:hover {
  color: #a3852c;
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}
.image-wrapper {
  position: relative;
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
}
</style>
