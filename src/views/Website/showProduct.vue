<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
  <Header />
<DirectionSwitcher />
  <div class="product-show " :dir="direction">
    <el-row :gutter="20" class="product-container full-height-row flex-md-row flex-column-reverse">
      <el-col  :xs="24" :sm="24" :md="12"  :lg="14">
        <div class="product-details">
          <h1 class="product-title">{{ locale === 'ar' ? product.name_ar : product.name_en }}</h1>

          <div class="price-block">
            <span class="price-new"
              >{{ product.price }} {{ product.currency?.name_en }}</span
            >
            <span class="price-old" v-if="product.old_price"
              >{{ product.old_price }} {{ product.currency?.name_en }}</span
            >
          </div>

          <div class="description" v-html="locale === 'ar' ? product.description_ar : product.description_en"></div>

          <div class="quantity-section">
            <div class="quantity-control">
              <label>{{ $t('quantity') }}:</label>
              <el-button size="small" @click="decreaseQty">-</el-button>
              <span class="qty-number">{{ quantity }}</span>
              <el-button size="small" @click="increaseQty">+</el-button>
            </div>
          </div>
        </el-col>
  
        <el-col :span="12" class="image-col">
          <div class="image-wrapper">
            <img
              :src="selectedImage ? getImageUrl(selectedImage) : (product.images?.length ? getImageUrl(product.images[0].path) : placeholder)"
              class="main-image"
            />
            <div class="sale-badge" v-if="product.old_price">Sale</div>
          </div>
  
          <div class="thumbs" v-if="product.images?.length > 1">
            <img
              v-for="img in product.images"
              :key="img.id"
              :src="getImageUrl(img.path)"
              class="thumb"
              :class="{ active: selectedImage === img.path }"
              @click="setSelectedImage(img.path)"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script setup>
  import Header from '@/components/Website/Header.vue'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const product = ref({})
  const quantity = ref(1)
  const placeholder = '/default-image.jpg'
  const selectedImage = ref(null)
  
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`https://elegance_commers.test/api/website/show/products/${route.params.id}`)
      if (res.data.status) {
        product.value = res.data.data
        // Set default selected image if exists
        if (product.value.images?.length) {
          selectedImage.value = product.value.images[0].path
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  
  const getImageUrl = (path) => {
    return `https://elegance_commers.test/storage/${path}`
  }
  
  const increaseQty = () => {
    quantity.value++
  }
  
  const decreaseQty = () => {
    if (quantity.value > 1) quantity.value--
  }
  
  const setSelectedImage = (path) => {
    selectedImage.value = path
  }
  
  onMounted(fetchProduct)
  </script>
  
  <style scoped>
  .product-show {
    padding: 40px;
    font-family: 'Tajawal', sans-serif;
    direction: rtl;
  }
  .product-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .price-new {
    font-size: 24px;
    color: #000;
  }
  .price-old {
    font-size: 20px;
    color: #999;
    text-decoration: line-through;
  }
  .description {
    color: #666;
    font-size: 16px;
    margin: 20px 0;
    line-height: 1.8;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
  }
  .favorite-btn {
    border: none;
    background: #fff;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  }
  .add-to-cart {
    background-color: #a3852c;
    border-color: #a3852c;
    color: #fff;
  }
  .quantity-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .image-wrapper {
    position: relative;
  }
  .main-image {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    border-radius: 10px;
  }
  .sale-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: red;
    color: white;
    padding: 5px 10px;
    border-radius: 50px;
    font-weight: bold;
  }
  .thumbs {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }
  .thumb {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
  }
  .thumb:hover {
    transform: scale(1.05);
  }
  .thumb.active {
    border: 2px solid #a3852c;
  }
  .image-col {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  </style>
  