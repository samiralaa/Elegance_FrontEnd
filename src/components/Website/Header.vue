
<template>
  <header class="header">
    <div class="top-bar">
      <div class="container-fluid">
        <div class="d-flex justify-content-between mx-5">
          <div class="top-bar-left">
            <a href="#" class=" btn join-link">{{ $t('header.joinUs') }}</a>
          </div>
          <div class="top-bar-right">
            <div class="currency">  {{ $t('currencies') }}</div>
            <language-switcher />
          </div>
        </div>
      </div>
    </div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid mx-5">
        <a class="navbar-brand" href="#">
          <img src="@/assets/images/EleganceLogo.png" alt="Bootstrap" height="50">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link active" aria-current="page">{{ $t('header.home') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/products" class="nav-link">{{ $t('header.products') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link">{{ $t('header.contactUs') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link">{{ $t('header.aboutUs') }}</router-link>
            </li>
          </ul>
          <a class="search-btn mx-2">
            <fa icon="search"></fa>
          </a>
          <router-link to="/login" class="login-btn btn">{{ $t('header.login') }}</router-link>
        </div>
      </div>
    </nav>
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
.search-btn {
  position: relative;
  padding: 1em 2em;
  background: transparent;
  border: none;
  cursor: pointer;
  isolation: isolate;
  overflow: hidden;
  color: #8b6b3d;
}

.search-btn::after {
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

.search-btn:hover{
  color: #fff;
}

.search-btn:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.login-btn{
  background-color: #8b6b3d;
  color: #fff;
}

.login-btn:hover{
  background-color: #725932;
}

.login-btn:focus{
  color: #fff !important;
}

.nav-link.active,
.nav-link:hover{
  color: #8B6B3D;
}

.nav-link{
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

/* .search-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
} */

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