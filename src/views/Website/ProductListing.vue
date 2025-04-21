<template>
     <Header />
    <div class="shop-container" dir="rtl">
      <!-- Sidebar Filters -->
      <aside class="sidebar">
        <h3 class="sidebar-title">Categories</h3>
        <div v-for="cat in categories" :key="cat.id" class="filter-item">
          <label class="checkbox-container">
            {{ cat.name }}
            <input
              type="checkbox"
              v-model="selectedCategories"
              :value="cat.id"
            />
            <span class="checkmark"></span>
          </label>
        </div>
  
        <h3 class="sidebar-title">PRICE</h3>
       
      </aside>
  
      <!-- Product Grid -->
      <section class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="image-container">
            <img 
              v-if="product.images && product.images.length"
              :src="getImageUrl(product.images[0].path)"
              :alt="product.name" 
            />
            <div v-if="product.sale" class="sale-badge">Sale</div>
            <div class="product-actions">
              <button @click="addToCart(product)" class="action-btn cart-btn">
                <fa icon="cart-plus" />
              </button>
              <button @click="addToFavorites(product)" class="action-btn love-btn">
                <fa icon="heart" />
              </button>
            </div>
          </div>
          <div class="product-info">
            <h4>{{ product.name }}</h4>
            <div class="prices">
              <span class="price-new">{{ product.price }} {{ product.currency?.name_en || 'AED' }}</span>
              <span v-if="product.old_price" class="price-old">{{ product.old_price }}</span>
            </div>
          </div>
        </div>
      </section>
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
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import Header from "@/components/Website/Header.vue";

  const categories = ref([])
  const products = ref([])
  const showSuccessDialog = ref(false)
  const successMessage = ref('')
  
  const selectedCategories = ref([])
  const priceRange = ref({ min: 0, max: 5000 })
  const priceRangeLimit = { min: 0, max: 5000 }
  
  const getImageUrl = (path) => `https://elegance_commers.test/storage/${path}`

  const addToFavorites = async (product) => {
    try {
      const response = await axios.post(
        'https://elegance_commers.test/api/favorites',
        { product_id: product.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )

      if (response.data.message) {
        product.isFavorited = !product.isFavorited
        successMessage.value = response.data.message
        showSuccessDialog.value = true
      }
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
        payload.amount_id = product.amount_id
      }

      const response = await axios.post('https://elegance_commers.test/api/cart-items', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })

      if (response.data.message) {
        successMessage.value = response.data.message
        showSuccessDialog.value = true
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
  
  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://elegance_commers.test/api/website')
      categories.value = res.data.data || []
    } catch (err) {
      console.error('Error loading categories', err)
    }
  }
  
  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://elegance_commers.test/api/website/products/section')
      products.value = res.data.data || []
    } catch (err) {
      console.error('Error loading products', err)
    }
  }
  
  onMounted(() => {
    fetchCategories()
    fetchProducts()
  })
  
  const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCategory =
      selectedCategories.value.length === 0 || selectedCategories.value.includes(p.category_id)

    const isPriceAtDefault =
      priceRange.value.min === priceRangeLimit.min &&
      priceRange.value.max === priceRangeLimit.max

    const matchPrice = isPriceAtDefault
      ? true
      : (p.price >= priceRange.value.min && p.price <= priceRange.value.max)

    return matchCategory && matchPrice
  })
})

  </script>
  
  <style scoped>
  .shop-container {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    background: #fff;
    font-family: 'Cairo', sans-serif;
  }
  
  .sidebar {
    width: 250px;
    padding: 1rem;
    border-left: 1px solid #eee;
  }
  
  .sidebar-title {
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #444;
  }
  
  .filter-item {
    margin-bottom: 1rem;
  }
  
  .checkbox-container {
    display: block;
    position: relative;
    padding-right: 35px;
    cursor: pointer;
    font-size: 16px;
    user-select: none;
  }
  
  .checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  
  .checkmark {
    position: absolute;
    right: 0;
    top: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 4px;
  }
  
  .checkbox-container:hover input ~ .checkmark {
    background-color: #ccc;
  }
  
  .checkbox-container input:checked ~ .checkmark {
    background-color: #222;
  }
  
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }
  
  .checkbox-container input:checked ~ .checkmark:after {
    display: block;
  }
  
  .checkmark:after {
    right: 6px;
    top: 2px;
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  .price-range input {
    width: 100%;
    margin: 10px 0;
  }
  
  .price-values {
    text-align: center;
    font-size: 14px;
    color: #333;
  }
  
  .products-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1.5rem;
  }
  
  .product-card {
    border: 1px solid #eee;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    text-align: center;
    transition: box-shadow 0.3s;
  }
  
  .product-card:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .image-container {
    position: relative;
    background: #f9f9f9;
    overflow: hidden;
  }
  
  .image-container img {
    width: 100%;
    height: auto;
    transition: transform 0.3s ease;
  }

  .product-card:hover .image-container img {
    transform: scale(1.1);
  }

  .product-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .product-card:hover .product-actions {
    transform: translateY(0);
  }

  .action-btn {
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    transform: scale(1.1);
  }

  .cart-btn {
    background-color: #fff;
    color: #8b6b3d;
  }

  .love-btn {
    background-color: #8b6b3d;
    color: #fff;
  }
  
  .sale-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #ff4c4c;
    color: white;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 5px;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .prices {
    margin-top: 0.5rem;
  }
  
  .price-new {
    font-weight: bold;
    color: #8b6500;
    font-size: 16px;
  }
  
  .price-old {
    text-decoration: line-through;
    color: #aaa;
    margin-right: 8px;
  }
  </style>
  