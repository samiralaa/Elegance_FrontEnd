<template>
  <header class="header">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container-fluid">
        <div class="d-flex justify-content-between mx-5">
          <div class="top-bar-left">
            <router-link to="/register" class="btn join-link">{{ $t('header.joinUs') }}</router-link>
          </div>
          <div class="top-bar-right">
            <div class="currency">{{ $t('currencies') }}</div>
            <language-switcher />
          </div>
        </div>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid mx-5">
        <a class="navbar-brand" href="#">
          <img src="@/assets/images/EleganceLogo.png" alt="Logo" height="50" />
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">{{ $t('header.home')
              }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/product-listing" class="nav-link" :class="{ active: $route.path === '/product-listing' }">{{
                $t('header.products') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link" :class="{ active: $route.path === '/contact' }">{{
                $t('header.contactUs') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">{{
                $t('header.aboutUs') }}</router-link>
            </li>
          </ul>

          <!-- Action Buttons -->
          <button class="search-btn mx-2" @click="toggleSearchDialog">
            <fa icon="search" />
          </button>

          <!-- 🛒 Cart Button -->
          <a class="cart-btn mx-2" @click="showCartModal()">
            <fa icon="shopping-cart" />
            <span v-if="cartCount > 0" class="badge bg-danger">{{ cartCount }}</span>
          </a>



          <!-- ❤️ Favorite Button -->
          <button class="favorite-btn mx-2" @click="fetchFavorites">
            <fa icon="heart" />
            <span v-if="favoritesCount > 0" class="favorite-count">{{ favoritesCount }}</span>
          </button>

          <!-- Favorites Modal -->
          <div v-if="showFavoritesModal" class="favorites-modal">
            <div class="modal-content">
              <h4>My Favorites</h4>
              <ul v-if="favorites.length">
                <li v-for="favorite in favorites" :key="favorite.id" class="favorite-item">
                  <img :src="getFavoriteProductImage(favorite)" alt="Product Image" class="product-image" />
                  <div class="product-info">
                    <h5>{{ currentLang === 'ar' ? favorite.product.name_ar : favorite.product.name_en }}</h5>
                    <p>{{ favorite.product.price }}</p>
                  </div>
                </li>
              </ul>
              <p v-else>No favorites yet</p>
              <button class="btn btn-secondary mt-3" @click="showFavoritesModal = false">{{ $t('header.close')
              }}</button>
            </div>
          </div>

          <!-- 👤 Auth Controls -->
          <template v-if="!isAuthenticated">
            <router-link to="/Account/Login" class="login-btn btn">{{ $t('header.login') }}</router-link>
          </template>
          <template v-else>
            <div class="profile-dropdown">
              <button class="profile-btn" @click="toggleProfileMenu">
                <span class="user-name me-2">{{ userName }}</span>
                <fa icon="user" />
              </button>
              <div v-if="showProfileMenu" class="dropdown-menu show">
                <router-link to="/profile" class="dropdown-item">{{ $t('header.profile') }}</router-link>
                <router-link to="/orders/user" class="dropdown-item">{{ $t('header.orders') }}</router-link>
                <button class="dropdown-item" @click="logout" :disabled="isLoggingOut">
                  <span v-if="isLoggingOut" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ $t('header.logout') }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <!-- 🔍 Search Modal -->
    <div v-if="showSearchDialog" class="custom-search-modal">
      <div class="modal-content">
        <input type="text" class="form-control search-input" placeholder="Search products..." v-model="searchQuery"
          @input="filterProducts" />
        <ul v-if="filteredProducts.length">
          <li v-for="product in filteredProducts" :key="product.id" class="product-item">

            <img :src="getProductImage(product)" alt="Product Image" class="product-image" />
            <div class="product-info">
              <h5>{{ currentLang === 'ar' ? product.name_ar : product.name_en }}</h5>
              <p>{{ product.price }} {{ product.currency?.name_en }}</p>
            </div>
          </li>
        </ul>
        <p v-else-if="searchQuery">No results found.</p>
        <button class="btn btn-secondary mt-3" @click="toggleSearchDialog">{{ $t('header.close') }}</button>
      </div>
    </div>

    <div v-if="showCartModalFlag" class="modal-overlay d-flex justify-content-center align-items-center">
      <div class="cart-modal bg-white rounded-4 shadow p-4 position-relative">

        <!-- Close Button (Top Right) -->
        <button type="button" class="btn-close position-absolute top-0 end-0 m-3" @click="showCartModalFlag = false"
          aria-label="Close"></button>

        <!-- Title -->
        <h4 class="mb-3">🛒 {{ $t('Cart Items') }}</h4>

        <!-- Cart List -->
        <div class="cart-content overflow-auto" style="max-height: 60vh;">
          <ul v-if="cartItems.length" class="list-unstyled">
  <li v-for="item in cartItems" :key="item.id" class="d-flex align-items-center border-bottom py-2 gap-3">
    <img :src="getProductImageToCart(item)" alt="Product Image" class="product-image" />

    <div class="flex-grow-1">
      <h6 class="mb-1">{{ currentLang === 'ar' ? item.product.name_ar : item.product.name_en }}</h6>

      <!-- Quantity and Price -->
      <div class="d-flex align-items-center gap-2">
        <small class="text-muted">
          {{ item.price }} {{ currentLang === 'ar' ? item.currency.name_ar : item.currency.name_en }} ×
        </small>
        <input
          type="number"
          v-model.number="item.quantity"
          @change="updateQuantity(item)"
          min="1"
          class="form-control form-control-sm"
          style="width: 70px;"
        />
      </div>
    </div>
  </li>
</ul>

          <div v-else class="text-center text-muted py-4">
            🛍️ {{ $t('Cart is empty') }}
          </div>
        </div>

        <!-- Total Price -->
        <div v-if="cartItems.length" class="d-flex justify-content-between mt-3">
          <span><strong>{{ $t('Total') }}:</strong></span>
          <span>
            {{ totalCartValue }} {{ currentLang === 'ar' ? cartItems[0].currency.name_ar : cartItems[0].currency.name_en
            }}
          </span>
        </div>

        <!-- Footer -->
        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-outline-secondary" @click="showCartModalFlag = false">
            {{ $t('Close') }}
          </button>
          <button class="btn btn-primary" @click="checkout">
            {{ $t('Checkout') }}
          </button>
        </div>

      </div>
    </div>





  </header>
</template>

<script>
import axios from 'axios';
import LanguageSwitcher from '../LanguageSwitcher.vue';
import { API_URL } from '@/store/index.js';


export default {
  name: 'Header',
  components: {
    LanguageSwitcher,
  },
  data() {
    return {
      searchQuery: "",
      showSearchDialog: false,
      products: [],
      filteredProducts: [],
      showProfileMenu: false,
      isLoggingOut: false,
      userProfile: null,
      isLoadingProfile: false,
      favorites: [],
      favoritesCount: 0,
      showFavoritesModal: false,
      cartItems: [],
      cartCount: 0,
      showCartModalFlag: false,


    };
  },
  computed: {
    totalCartValue() {
      return this.cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
      }, 0).toFixed(2);
    },
    isAuthenticated() {
      return localStorage.getItem('auth_token');
    },
    userName() {
      return this.userProfile?.name || '';
    },
    currentLang() {
      return localStorage.getItem('lang') || 'en';
    }
  },
  created() {

    if (this.isAuthenticated) {
      this.fetchUserProfile();
      this.fetchCartItems(); // ⬅️ Fetch cart items on load
    }
  },
  methods: {
    showCartModal() {
      if (!this.isAuthenticated) {
        this.$router.push('/Account/Login');
        return;
      }
      this.getCartItems(); // fetch data
      this.showCartModalFlag = true; // show modal
    },

    getCartItems() {
      const token = localStorage.getItem('token'); // or wherever you store the token


      axios.get('http://127.0.0.1:8000/api/cart-items', {

        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      })
        .then(response => {
          this.cartItems = response.data.data.original.data;
        })
        .catch(error => {
          console.error("Failed to fetch cart items", error);
        });
    },

    getProductImage(product) {
      // Replace with your actual logic if you have product image URLs
      return product.images.path || '/images/default.jpg';
    },
    getProductImage(product) {
      const imagePath = product.images && product.images[0]?.path ? product.images[0].path : '';
      return `${API_URL}/${imagePath}`;
    },
    getProductImageToCart(item) {
      if (item.images && Array.isArray(item.images)) {
        return `${API_URL}/${item.images[0]}`;
      }
      return `${API_URL}/images/default.jpg`;
    },
    getFavoriteProductImage(fav) {
      return `${API_URL}/${fav?.product?.images[0]?.path || ''}`;
    },

    checkout() {
      if (this.cartItems.length === 0) {
        this.$toast.warning('Your cart is empty.');
        return;
      }
      this.$router.push('/checkout');
    },

    async updateQuantity(item) {
    const originalQuantity = item.quantity;
    try {
      const response = await axios.post(`${API_URL}/api/cart-items/${item.id}`, {
        quantity: item.quantity
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      this.totalCartValue = this.calculateTotal();
      this.$toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Failed to update quantity', error);
      item.quantity = originalQuantity;
      this.totalCartValue = this.calculateTotal();
      this.$toast.error('Failed to update cart');
    }
  },

  calculateTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  },
    async fetchUserProfile() {
      try {
        this.isLoadingProfile = true;
        const response = await axios.get(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
        });
        this.userProfile = response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.$toast.error('Failed to load user profile');
      } finally {
        this.isLoadingProfile = false;
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get(`${API_URL}/api/website/products/section`);
        this.products = response.data.data.slice(0, 5) || [];
        this.filteredProducts = this.products;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    toggleSearchDialog() {
      this.showSearchDialog = !this.showSearchDialog;
      if (this.showSearchDialog) {
        this.searchQuery = '';
        if (this.products.length === 0) {
          this.fetchProducts();
        } else {
          this.filteredProducts = this.products;
        }
      }
    },
    filterProducts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name_en?.toLowerCase().includes(query) ||
        product.name_ar?.toLowerCase().includes(query)
      );
    },
    async fetchFavorites() {
      if (!this.isAuthenticated) {
        this.$router.push('/Account/Login');
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.favorites = response.data;
        this.favoritesCount = this.favorites.length;
        this.showFavoritesModal = true;
      } catch (error) {
        console.error('Error fetching favorites:', error);
        this.$toast.error('Failed to load favorites');
      }
    },
    async fetchCartItems() {
      try {
        const response = await axios.get(`${API_URL}/api/cart-items`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.cartItems = response.data;
        this.cartCount = this.cartItems.length;
      } catch (error) {
        console.error('Error fetching cart items:', error);
        this.$toast.error('Failed to load cart items');
      }
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    async logout() {
      try {
        this.isLoggingOut = true;
        await axios.post(`${API_URL}/api/logout`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        this.$router.push('/Account/Login');
        this.showProfileMenu = false;
        this.$toast.success('Logged out successfully');
      } catch (error) {
        console.error('Logout error:', error);
        this.$toast.error('Logout failed');
      } finally {
        this.isLoggingOut = false;
      }
    }
  }
};
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-dropdown {
  position: relative;
}

.profile-btn {
  background: transparent;
  border: none;
  color: #8b6b3d;
  cursor: pointer;
  padding: 0.5em;
}

.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #8b6b3d;
}

.custom-search-modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 20px 30px;
  border-radius: 8px;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
  overflow-y: auto;
  max-height: 80vh;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.product-item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex-grow: 1;
}

.product-info h5 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.product-info p {
  margin: 5px 0 0;
  color: #8b6b3d;
}

.search-btn,
.cart-btn,
.favorite-btn {
  position: relative;
  padding: 1em;
  background: transparent;
  border: none;
  cursor: pointer;
  isolation: isolate;
  overflow: hidden;
  color: #8b6b3d;
  border-radius: 50%;
}

.search-btn::after,
.cart-btn::after,
.favorite-btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  height: 45px;
  width: 45px;
  background-color: #8b6b3d;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  z-index: -1;
  transition: transform 0.3s ease;
}

.search-btn:hover,
.cart-btn:hover,
.favorite-btn:hover {
  color: #fff;
}

.search-btn:hover::after,
.cart-btn:hover::after,
.favorite-btn:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.login-btn {
  background-color: #8b6b3d;
  color: #fff;
}

.login-btn:hover {
  background-color: #725932;
}

.login-btn:focus {
  color: #fff !important;
}

.nav-link.active,
.nav-link:hover {
  color: #8B6B3D;
}

.nav-link {
  color: #333;
  font-weight: 500;
}

.header {
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-bar {
  background: #8B6B3D;
  color: #fff;
  padding: 8px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar .container-fluid {
  font-size: 0.9rem;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.join-link {
  color: #fff;
  text-decoration: none;
}

[dir="rtl"] .top-bar-right {
  flex-direction: row-reverse;
}

[dir="rtl"] .main-nav ul {
  flex-direction: row-reverse;
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }

  .header-actions {
    gap: 0.5rem;
  }

  .auth-btn {
    padding: 0.5rem 1rem;
  }
}

.custom-search-modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  z-index: 9999;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.search-btn,
.cart-btn,
.favorite-btn {
  position: relative;
  padding: 1em;
  background: transparent;
  border: none;
  cursor: pointer;
  isolation: isolate;
  overflow: hidden;
  color: #8b6b3d;
  border-radius: 50%;
}

.search-btn::after,
.cart-btn::after,
.favorite-btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  height: 45px;
  width: 45px;
  background-color: #8b6b3d;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  z-index: -1;
  transition: transform 0.3s ease;
}

.search-btn:hover,
.cart-btn:hover,
.favorite-btn:hover {
  color: #fff;
}

.search-btn:hover::after,
.cart-btn:hover::after,
.favorite-btn:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.favorite-count {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: scale(1);
  transition: transform 0.2s ease;
}

.favorite-btn:hover .favorite-count {
  transform: scale(1.1);
}

.favorites-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.favorites-modal .modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  color: #8b6b3d;
  margin-bottom: 20px;
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  transition: all 0.2s ease;
}

.favorite-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.favorite-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.favorite-item .product-info h5 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.favorite-item .product-info p {
  margin: 5px 0 0;
  color: #8b6b3d;
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1050;
  backdrop-filter: blur(2px);
  padding: 1rem;
}

.cart-modal {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  animation: fadeInUp 0.3s ease-in-out;
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.cart-content {
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.cart-content::-webkit-scrollbar {
  width: 6px;
}

.cart-content::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}
@media (max-width: 576px ) {
  .navbar .container-fluid,
  .top-bar .container-fluid > div{
    margin: 0 !important;
  }
  .navbar-brand img {
    height: 40px;
  }
  .navbar-toggler-icon {
    width: 1.2em;
    height: 1.2em;
  }
  .navbar-toggler {
    padding: 0.5em;
  }
  .navbar-nav .nav-link {
    padding: 0.5em 1em;
  }
  .navbar-nav .nav-link.active {
    background-color: #8b6b3d;
    color: #fff;
  }
}
</style>
