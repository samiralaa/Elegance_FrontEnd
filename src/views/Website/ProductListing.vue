<template>
  <Header />
  <div class="axil-breadcrumb-area mt-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 col-md-8">
          <div class="inner">
            <h1 class="title">{{ $t('products.title') }}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="shop-container" :dir="direction">
    <div class="container">
      <!-- Mobile Filter Button -->
      <div class="filter col-12">
        <a href="#" @click.prevent="toggleSidebar">{{ $t('products.filter') }}</a>
      </div>

      <!-- Sidebar Filters -->
      <aside class="sidebar">
        <div class="sidebar-container">
          <!-- Close Button -->
          <button class="close-btn" @click="toggleSidebar">&times;</button>

          <!-- Categories -->
          <h3 class="sidebar-title">{{ t('products.categories') }}</h3>
          <hr style="color: #8b6b3d; opacity: 1; border-top: 3px solid;" />
          <div v-for="cat in categories" :key="cat.id" class="filter-item">
            <label class="checkbox-container">
              {{ $i18n.locale === 'ar' ? cat.name_ar : cat.name_en }}
              <input
                type="checkbox"
                v-model="selectedCategories"
                :value="cat.id"
              />
              <span class="checkmark"></span>
            </label>
          </div>

          <!-- Price Range -->
          <h3 class="sidebar-title">{{ t('products.price') }}</h3>
          <hr style="color: #8b6b3d; opacity: 1; border-top: 3px solid;" />
          <div class="price-range">
            <input
              type="range"
              v-model.number="priceRange.min"
              :min="priceRangeLimit.min"
              :max="priceRangeLimit.max"
            />
            <input
              type="range"
              v-model.number="priceRange.max"
              :min="priceRangeLimit.min"
              :max="priceRangeLimit.max"
            />
            <div class="price-values">
              <span>{{ priceRange.min }} - {{ priceRange.max }} {{ t('AED') }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Overlay -->
      <div class="overlay" @click="toggleSidebar" v-if="isSidebarActive"></div>

      <!-- Product Grid -->
      <section class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="image-container mb-3 bg-light rounded">
            <img 
              v-if="product.images && product.images.length"
              :src="getImageUrl(product.images[0].path)"
              :alt="product.name" 
            />
            <div v-if="!product.is_available" class="sale-badge">{{ $t('products.outOfStock') }}</div>
            <div class="product-actions d-flex justify-content-center gap-5 w-100">
              <router-link :to="`/read/products/${product.id}`" class="btn btn-light rounded-circle shadow-sm" title="View">
                <fa icon="eye" />
              </router-link>
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
          <div class="card-body">
            <h5 class="card-title">{{ product.name_en }}</h5>
            <div class="price-container">
              <span v-if="product.discount && product.discount.length > 0" class="discount-badge">
                {{ product.discount[0].discount_value }}% OFF
              </span>
              <span v-if="product.old_price" class="price-old">{{ product.old_price }} {{ product.currency.name_en }}</span>
              <span class="card-text card-price">
                {{ calculateDiscountedPrice(product) }} {{ product.currency.name_en }}
              </span>
            </div>
          </div>
          <div class="addToCart-btn">
            <button 
              :disabled="!product.is_available" 
              @click="addToCart(product)" 
              class="btn"
            >
              {{ $t('products.addToCart') }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { ElNotification, ElDialog, ElButton } from 'element-plus'
  import Header from '@/components/Website/Header.vue'
  import { useI18n } from 'vue-i18n'
  import { useFavoritesStore } from '@/store/favorites'

  const { t } = useI18n()
  const direction = ref(document.documentElement.dir || 'ltr')

  // Data
  const categories = ref([])
  const products = ref([])
  const showSuccessDialog = ref(false)
  const successMessage = ref('')
  const selectedCategories = ref([])
  const priceRange = ref({ min: 0, max: 5000 })
  const priceRangeLimit = { min: 0, max: 5000 }
  const isSidebarActive = ref(false)
  const favoritesStore = useFavoritesStore()

  // Toggle Sidebar
  const toggleSidebar = () => {
    isSidebarActive.value = !isSidebarActive.value
    const sidebar = document.querySelector('.sidebar')
    const body = document.body;
    if (sidebar) {
      sidebar.classList.toggle('active', isSidebarActive.value)

      if (sidebar.classList.contains('active')) {
        body.classList.add('no-scroll');
      } else {
        body.classList.remove('no-scroll');
      }
    }
  }

  // Helpers
  const getImageUrl = (path) => `http://elegance_backend.test/public/storage/${path}`

  const isInFavorites = (productId) => {
    return favoritesStore.favorites.some(favorite => favorite.product_id === productId)
  }

  const getFavoriteId = (productId) => {
    const favorite = favoritesStore.favorites.find(favorite => favorite.product_id === productId)
    return favorite ? favorite.id : null
  }

  const addToFavorites = async (product) => {
    try {
      const response = await axios.post(
        'http://elegance_backend.test/api/favorites',
        { product_id: product.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );

      if (isInFavorites(product.id)) {
        const favoriteId = getFavoriteId(product.id)
        if (favoriteId) {
          await favoritesStore.removeFromFavorites(favoriteId)
          successMessage.value = 'Product removed from favorites'
        }
      } else {
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

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://elegance_backend.test/api/website')
      categories.value = res.data.data || []
    } catch (err) {
      console.error('Error loading categories', err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://elegance_backend.test/api/all/products')
      products.value = res.data.data || []
    } catch (err) {
      console.error('Error loading products', err)
    }
  }

  const addToCart = async (product) => {
    try {
      const response = await axios.post(
        'http://elegance_backend.test/api/cart-items',
        {
          product_id: product.id,
          quantity: 1,
          price: parseFloat(product.price)
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )

      if (response.data.status) {
        ElNotification({
          title: t('success'),
          message: response.data.message ,
          type: 'success'
        })
      } else {
        ElNotification({
          title: t('error'),
          message: response.data.message,
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      ElNotification({
        title: t('error'),
        message: error.response?.data?.message,
        type: 'error'
      })
    }
  }

  onMounted(() => {
    fetchCategories()
    fetchProducts()
  })

  const filteredProducts = computed(() => {
    return products.value.filter((p) => {
      const matchCategory =
        selectedCategories.value.length === 0 ||
        selectedCategories.value.includes(p.category_id)

      const isPriceAtDefault =
        priceRange.value.min === priceRangeLimit.min &&
        priceRange.value.max === priceRangeLimit.max

      const matchPrice = isPriceAtDefault
        ? true
        : p.price >= priceRange.value.min && p.price <= priceRange.value.max

      return matchCategory && matchPrice
    })
  })

  const calculateDiscountedPrice = (product) => {
    if (product.discount && product.discount.length > 0) {
      const discountValue = parseFloat(product.discount[0].discount_value)
      const originalPrice = parseFloat(product.price)
      const discountedPrice = originalPrice - (originalPrice * (discountValue / 100))
      return discountedPrice.toFixed(2)
    }
    return product.price
  };
</script>

<style scoped>
  .inner .title {
    color: #8b6500;
  }
  .shop-container .container {
    display: flex;
    gap: 2rem;
    padding: 2rem 0;
    background: #fff;
    font-family: 'Cairo', sans-serif;
    flex-wrap: wrap;
  }
  .sidebar {
    width: 300px;
    transition: left 0.3s ease-in-out;
    position: relative;
  }
  .sidebar-container {
    position: relative;
    padding: 2rem 1rem;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 1.5rem;
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    display: none;
  }
  .sidebar-title {
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #8b6b3d;
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
    position: relative;
    text-align: center;
    font-size: 14px;
    color: #333;
  }
  .products-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  .product-card {
    position: relative;
    background: #fff;
    text-align: center;
    transition: box-shadow 0.3s;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .image-container {
    position: relative;
    background: #f9f9f9;
    overflow: hidden;
    border-radius: 5px;
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
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    z-index: 10;
  }

  .product-card:hover .product-actions {
    transform: translateX(-50%) translateY(-30%);
    opacity: 1;
  }

  .btn {
    font-size: 1.5rem;
  }

  .action-btn {
    border: none;
    border-radius: 10px;
    width: 100%;
    height: 45px;
    display: flex;
    margin: 1rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .icon {
    font-size: 1.2rem;
    transition: all 0.2s ease;
  }
  .action-btn:hover .icon {
    transform: scale(1.2);
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
    padding: 4px 12px;
    font-size: 12px;
    border-radius: 5px;
  }
  .card-body{
    display: flex;
    flex: 0;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .card-title {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .card-price {
    background-color: #e8f5e9;
    display: inline-block;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.95rem;
    text-align: center;
    margin-bottom: 10px;
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

  .card-title {
    color: #8b6b3d;
    transition: all 0.2s ease-in;
    font-weight: 600;
    font-size: 1.2rem;
  }

  .addToCart-btn {
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
  }
  .addToCart-btn button {
    position: relative;
    padding: 0.75rem 1.5rem;
    color: #8b6b3d;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    width: 100%;
    overflow: hidden;
    z-index: 0;
    border-radius: 0;
  }
  .addToCart-btn button::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #8b6b3d;
    transition: height 0.3s ease;
    z-index: -1;
  }
  .addToCart-btn button:hover {
    color: #fff;
    border-radius: 6px;
  }
  .addToCart-btn button:hover::before {
    height: 100%;
  }

  .filter {
    display: none;
  }

  .filter a {
    color: #6b6b6b;
    font-size: 1.2rem;
    margin-right: 8px;
  }

  @media (max-width: 1200px) {
    .product-actions {
      position: absolute;
      bottom: 5%;
      left: 0%;
      opacity: 1;
      transform: translateX(0) translateY(0);
      z-index: 10;
    }

    
    .product-card:hover .product-actions {
      transform: translateX(0) translateY(0);
    }
    .card-body {
      flex-direction: column;
    }
  }

  @media (max-width: 768px) {

    .filter {
      display: block;
    }

    .close-btn {
      display: block;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: -320px;
      height: 100vh;
      width: 100%;
      max-width: 320px;
      background: #fff;
      z-index: 999;
      padding: 2rem 1rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 130px 10px;
    }

    .sidebar-container{
      height: 100%;
    }

    .sidebar.active {
      left: 0;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 998;
      display: none;
    }

    .sidebar.active ~ .overlay {
      display: block;
    }

    .sidebar.active {
      left: 0;
    }

    .no-scroll {
      overflow: hidden;
      position: fixed;
      width: 100%;
    }

    .sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
    }
  }

  .price-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .discount-badge {
    background-color: #ff4d4d;
    color: white;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
  }
</style>