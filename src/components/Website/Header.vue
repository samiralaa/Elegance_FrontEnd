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
              <router-link to="/products" class="nav-link" :class="{ active: $route.path === '/products' }">{{
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
          <a class="cart-btn mx-2">
            <fa icon="shopping-cart" />
          </a>
          <a class="favorite-btn mx-2">
            <fa icon="heart" />
          </a>
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
      <router-link to="/orders" class="dropdown-item">{{ $t('header.orders') }}</router-link>
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
    <div v-if="showSearchDialog" class="custom-search-modal">
      <div class="modal-content">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Search products..."
          v-model="searchQuery"
          @input="filterProducts"
        />
        <ul v-if="filteredProducts.length">
          <li v-for="product in filteredProducts" :key="product.id" class="product-item">
            <img :src="product.image_url" alt="Product Image" class="product-image" />
            <div class="product-info">
              <h5>{{ product.name_en }}</h5>
              <p>{{ product.price }} {{ product.currency?.name_en }}</p>
            </div>
          </li>
        </ul>
        <p v-else-if="searchQuery">No results found.</p>
        <button class="btn btn-secondary mt-3" @click="toggleSearchDialog">{{$t('header.close')}} </button>
      </div>
    </div>
  </header>
</template>

<script>
import axios from 'axios';
import LanguageSwitcher from '../LanguageSwitcher.vue';

export default {
  name: 'Header',
  components: {
    LanguageSwitcher,
  },
  data() {
    return {
      searchQuery: '',
      showSearchDialog: false,
      products: [],
      filteredProducts: [],
      showProfileMenu: false,
      isLoggingOut: false,
      userProfile: null,
      isLoadingProfile: false,
    };
  },
  computed: {
    isAuthenticated() {
      return localStorage.getItem('auth_token');
    },
    userName() {
      return this.userProfile?.name || '';      
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchUserProfile();
    }
  },
  methods: {
    async fetchUserProfile() {
      try {
        this.isLoadingProfile = true;
        const response = await axios.get('api/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.userProfile = response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.$toast.error('Failed to load user profile');
      } finally {
        this.isLoadingProfile = false;
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
    async fetchProducts() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/website/products/section');
        this.products = response.data.data.slice(0, 5) || [];
        this.filteredProducts = this.products;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    filterProducts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name_en?.toLowerCase().includes(query)
      );
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    async logout() {
      try {
        this.isLoggingOut = true;
        await axios.post('api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        this.$router.push('/Account/Login');
        this.showProfileMenu = false;
        this.$toast.success('Logged out successfully');
      } catch (error) {
        console.error('Error during logout:', error);
        this.$toast.error('Failed to logout. Please try again.');
      } finally {
        this.isLoggingOut = false;
      }
    },
  },
};
</script>

<style scoped>
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
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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

/* Additional styles omitted for brevity, keep the rest as-is */
</style>
