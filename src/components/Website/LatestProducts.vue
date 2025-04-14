<template>
  <div class="latest-products">
    <h2 class="title">Latest Products</h2>
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
            <router-link :to="`/read/products/${product.id}`" class="product-title">
              <h3>{{ product.name_en }}</h3>
            </router-link>
            <p>
              {{ product.price }} {{ product.currency.name_en }}
            </p>
            <p class="category">
              Category: {{ product.category.name_en }}
            </p>
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

const fetchLatestProducts = async () => {
  try {
    const response = await axios.get('https://elegance_commers.test/api/website/latest/products')
    if (response.data.status) {
      products.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching latest products:', error)
  }
}

const getImageUrl = (path) => {
  return `https://elegance_commers.test/storage/${path}`
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
.latest-products {
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
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
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
}
</style>
