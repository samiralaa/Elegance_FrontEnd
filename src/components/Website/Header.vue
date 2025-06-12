<template>
  <header class="header">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container-fluid">
        <div class="d-flex justify-content-between mx-5">
          <div class="top-bar-left">
            <router-link v-if="!isAuthenticated" to="/register" class="btn join-link">{{ $t('header.joinUs') }}</router-link>
          </div>
          <div class="top-bar-right">
            <currency-switcher />
            <language-switcher />
          </div>
        </div>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid mx-5">
        <router-link to="/" class="navbar-brand">
          <img src="@/assets/images/EleganceLogo.png" alt="Logo" height="50" />
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">{{ $t('header.home') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/product-listing" class="nav-link" :class="{ active: $route.path === '/product-listing' }">{{ $t('header.products') }}</router-link>
            </li>
            <li class="nav-item dropdown" @mouseenter="showBrandsDropdown = true" @mouseleave="showBrandsDropdown = false">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ $t('header.brands') }}
              </a>
              <ul class="dropdown-menu" :class="{ 'show': showBrandsDropdown }">
                <li v-for="brand in brands" :key="brand.id">
                  <router-link :to="`/brand/${brand.id}`" class="dropdown-item">
                    <div class="d-flex align-items-center">
                      <img :src="getBrandImage(brand)" :alt="currentLang === 'ar' ? brand.name_ar : brand.name_en" class="brand-image me-2">
                      <span>{{ currentLang === 'ar' ? brand.name_ar : brand.name_en }}</span>
                    </div>
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown" @mouseenter="showCategoriesDropdown = true" @mouseleave="showCategoriesDropdown = false">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ $t('header.categories') }}
              </a>
              <ul class="dropdown-menu" :class="{ 'show': showCategoriesDropdown }">
                <li v-for="category in categories" :key="category.id">
                  <router-link :to="`/category/${category.id}`" class="dropdown-item">
                    <div class="d-flex align-items-center">
                      <img :src="getCategoryImage(category)" :alt="currentLang === 'ar' ? category.name_ar : category.name_en" class="category-image me-2">
                      <span>{{ currentLang === 'ar' ? category.name_ar : category.name_en }}</span>
                    </div>
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link" :class="{ active: $route.path === '/contact' }">{{ $t('header.contactUs') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">{{ $t('header.aboutUs') }}</router-link>
            </li>
          </ul>

          <!-- Action Buttons -->
          <search-button @toggle="toggleSearchDialog" />
          <cart-button @show="showCartModal" :count="cartCount" />
          <favorite-button @show="fetchFavorites" :count="favoritesCount" />

          <!-- Auth Controls -->
          <template v-if="!isAuthenticated">
            <router-link to="/Account/Login" class="login-btn btn">{{ $t('header.login') }}</router-link>
          </template>
          <template v-else>
            <profile-dropdown 
              :user-name="userName"
              :is-logging-out="isLoggingOut"
              @logout="logout"
            />
          </template>
        </div>
      </div>
    </nav>

    <!-- Modals -->
    <search-modal 
      v-if="showSearchDialog"
      :products="filteredProducts"
      :search-query="searchQuery"
      @close="toggleSearchDialog"
      @search="filterProducts"
    />

    <cart-modal 
      v-if="showCartModalFlag"
      :cart-items="cartItems"
      :total-value="totalCartValue"
      :current-lang="currentLang"
      @close="showCartModalFlag = false"
      @checkout="checkout"
      @update-quantity="updateQuantity"
    />

    <favorites-modal 
      v-if="showFavoritesModal"
      :favorites="favorites"
      :current-lang="currentLang"
      @close="showFavoritesModal = false"
      @favorite-removed="handleFavoriteRemoved"
    />
  </header>
</template>

<script>
import axios from 'axios';
import LanguageSwitcher from '../LanguageSwitcher.vue';
import CurrencySwitcher from './CurrencySwitcher.vue';
import SearchButton from './Header/SearchButton.vue';
import CartButton from './Header/CartButton.vue';
import FavoriteButton from './Header/FavoriteButton.vue';
import ProfileDropdown from './Header/ProfileDropdown.vue';
import SearchModal from './Header/SearchModal.vue';
import CartModal from './Header/CartModal.vue';
import FavoritesModal from './Header/FavoritesModal.vue';
import { API_URL } from '@/store/index.js';
import { useFavoritesStore } from '@/store/favorites';
import { useCartStore } from '@/store/cart';
import { storeToRefs } from 'pinia';

export default {
  name: 'Header',
  components: {
    LanguageSwitcher,
    CurrencySwitcher,
    SearchButton,
    CartButton,
    FavoriteButton,
    ProfileDropdown,
    SearchModal,
    CartModal,
    FavoritesModal
  },
  data() {
    return {
      searchQuery: "",
      showSearchDialog: false,
      products: [],
      filteredProducts: [],
      favorites: [],
      favoritesCount: 0,
      showFavoritesModal: false,
      cartItems: [],
      showCartModalFlag: false,
      userProfile: null,
      isLoadingProfile: false,
      isLoggingOut: false,
      showProfileMenu: false,
      brands: [],
      categories: [],
      showBrandsDropdown: false,
      showCategoriesDropdown: false,
      isLoadingFavorites: false
    };
  },
  computed: {
    totalCartValue() {
      return this.cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
      }, 0).toFixed(2);
    },
    isAuthenticated() {
      return !!localStorage.getItem('auth_token');
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
      this.fetchCartItems();
    }
    this.fetchBrands();
    this.fetchCategories();
  },
  setup() {
    const favoritesStore = useFavoritesStore();
    const cartStore = useCartStore();
    const { cartCount } = storeToRefs(cartStore);
    
    // Fetch initial cart count
    if (localStorage.getItem('auth_token')) {
      cartStore.fetchCartCount();
    }
    
    return { favoritesStore, cartStore, cartCount };
  },
  methods: {
    async fetchBrands() {
      try {
        const response = await axios.get(`${API_URL}/api/website/brands/section`);
        this.brands = response.data.data;
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(`${API_URL}/api/website`);
        this.categories = response.data.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchCartItems() {
      try {
        const response = await axios.get(`${API_URL}/api/cart-items`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.cartItems = response.data.data.original.data || [];
        await this.cartStore.fetchCartCount();
      } catch (error) {
        console.error('Error fetching cart items:', error);
        this.$toast.error('Failed to load cart items');
        this.cartItems = [];
        this.cartStore.resetCount();
      }
    },
    async showCartModal() {
      if (this.isAuthenticated) {
        await this.fetchCartItems();
        this.showCartModalFlag = true;
      } else {
        this.$router.push('/Account/Login');
      }
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
    async updateQuantity(itemId, newQuantity) {
      try {
        const response = await axios.put(`${API_URL}/api/cart-items/${itemId}`, {
          quantity: newQuantity
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (response.data.status) {
          await this.fetchCartItems();
          await this.cartStore.fetchCartCount();
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
        this.$toast.error('Failed to update quantity');
      }
    },
    async checkout() {
      this.$router.push('/checkout');
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
        this.isLoadingFavorites = true;
        const response = await axios.get(`${API_URL}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        // Handle the response data structure
        if (response.data && Array.isArray(response.data)) {
          this.favorites = response.data;
        } else if (response.data && response.data.data) {
          this.favorites = response.data.data;
        } else {
          this.favorites = [];
        }
        
        this.favoritesCount = this.favorites.length;
        this.showFavoritesModal = true;
      } catch (error) {
        console.error('Error fetching favorites:', error);
        ElNotification({
          title: this.t('error'),
          message: this.t('fetch_favorites_error'),
          type: 'error',
        });
        this.favorites = [];
        this.favoritesCount = 0;
      } finally {
        this.isLoadingFavorites = false;
      }
    },
    handleFavoriteRemoved(favoriteId) {
      this.favorites = this.favorites.filter(fav => fav.id !== favoriteId);
      this.favoritesCount = this.favorites.length;
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
    },
    getBrandImage(brand) {
      if (brand.images && brand.images.length > 0 && brand.images[0].path) {
        return `${API_URL}/public/storage/${brand.images[0].path}`;
      }
      return '/placeholder-image.jpg';
    },
    getCategoryImage(category) {
      if (category.images && category.images.length > 0 && category.images[0].path) {
        return `${API_URL}/public/storage/${category.images[0].path}`;
      }
      return '/placeholder-image.jpg';
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

.top-bar {
  background: #8B6B3D;
  color: #fff;
  padding: 8px 0;
}

.nav-link.active,
.nav-link:hover {
  color: #8B6B3D;
}

.nav-link {
  color: #333;
  font-weight: 500;
}

.dropdown-menu {
  padding: 0.5rem 0;
  min-width: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  display: block;
  width: 100%;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.brand-image,
.category-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.nav-item.dropdown {
  position: relative;
}

.nav-item.dropdown:hover .dropdown-menu {
  display: block;
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

@media (max-width: 768px) {
  .dropdown-menu {
    position: static !important;
    transform: none !important;
    width: 100%;
    margin-top: 0.5rem;
    border: none;
    box-shadow: none;
  }

  .dropdown-item {
    padding: 0.75rem 1rem;
  }

  .brand-image,
  .category-image {
    width: 30px;
    height: 30px;
  }
}
</style>
