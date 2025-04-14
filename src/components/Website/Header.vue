<template>
  <header class="header">
    <div class="top-bar">
      <div class="container">
        <div class="top-bar-left">
          <a href="#" class="join-link">{{ $t('header.joinUs') }}</a>
        </div>
        <div class="top-bar-right">
          <div class="currency">AED (درهم)</div>
          <language-switcher />
        </div>
      </div>
    </div>
    <div class="main-header">
      <div class="container">
        <router-link to="/" class="logo">
          <img src="@/assets/images/logo.png" alt="Elegance" />
        </router-link>
        <nav class="main-nav">
          <ul>
            <li><router-link to="/">{{ $t('header.home') }}</router-link></li>
            <li><router-link to="/products">{{ $t('header.products') }}</router-link></li>
            <li><router-link to="/contact">{{ $t('header.contactUs') }}</router-link></li>
            <li><router-link to="/about">{{ $t('header.aboutUs') }}</router-link></li>
          </ul>
        </nav>
        <div class="header-actions">
          <button class="search-btn">
            <i class="fas fa-search"></i>
          </button>
          <router-link to="/login" class="auth-btn">{{ $t('header.login') }}</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import LanguageSwitcher from '../LanguageSwitcher.vue'

export default {
  name: 'Header',
  components: {
    LanguageSwitcher
  }
}
</script>

<style scoped>
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

.top-bar .container {
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

.main-header {
  padding: 1rem 0;
}

.logo img {
  height: 50px;
  width: auto;
}

.main-nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.main-nav a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  color: #8B6B3D;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
}

.auth-btn {
  padding: 0.5rem 1.5rem;
  background: #8B6B3D;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.auth-btn:hover {
  background: #725932;
}

/* RTL Support */
[dir="rtl"] .top-bar-right {
  flex-direction: row-reverse;
}

[dir="rtl"] .main-nav ul {
  flex-direction: row-reverse;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-nav {
    display: none; /* Will be replaced with mobile menu */
  }
  
  .header-actions {
    gap: 0.5rem;
  }
  
  .auth-btn {
    padding: 0.5rem 1rem;
  }
}
</style>