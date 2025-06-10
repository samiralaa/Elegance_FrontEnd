<template>
  <div class="join-us-container">
    <div class="banner-section">
      <img src="@/assets/images/perfume-banner.svg" alt="Elegance Perfume" class="banner-image">
    </div>
    <div class="join-us-content">
      <div class="form-header">
        <h1 class="elegant-title">{{ $t('joinUs.title') }}</h1>
        <p class="elegant-description">{{ $t('joinUs.description') }}</p>
      </div>
      <form @submit.prevent="handleSubmit" class="join-form">
        <div class="form-group">
          <label for="email">{{ $t('joinUs.email') }}</label>
          <input type="email" id="email" v-model="formData.email" required />
        </div>
        <div class="form-group">
          <label for="password">{{ $t('joinUs.password') }}</label>
          <div class="password-input-container">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password" required />
            <button type="button" class="show-password-btn" @click="togglePassword">
              {{ showPassword ? $t('joinUs.hidePassword') : $t('joinUs.showPassword') }}
            </button>
          </div>
        </div>
        <div class="form-links">
          <router-link to="/forgot-password" class="link">{{ $t('joinUs.forgotPassword') }}</router-link>
        </div>
        <button type="submit" class="submit-btn">{{ $t('joinUs.login') }}</button>
        <div class="register-section">
          <p>{{ $t('joinUs.notMember') }}
            <router-link to="/register" class="link">{{ $t('joinUs.registerHere') }}</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'JoinUs',
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      showPassword: false
    }
  },
  methods: {
    async handleSubmit() {
      try {

        const response = await axios.post('http://elegance_backend.test/api/client/login', this.formData);


        if (response.data.status) {
          const userData = response.data.data;

          // Optionally store token in localStorage
          localStorage.setItem('auth_token', userData.token);
          localStorage.setItem('auth_user', JSON.stringify(userData.user));

          // Commit to Vuex (optional, if using Vuex)
          this.$store.commit('auth/SET_AUTH', userData);

          // Load cart (optional)
          await this.$store.dispatch('cart/loadCart');

          // Redirect to home page
          this.$router.push('/');
        } else {
          // Handle error if status is false
          console.error('Login failed: ', response.data.message);
        }
      } catch (error) {
        console.error('Login failed:', error.response?.data?.message || error.message);
        // Show a user-friendly error message here
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/fonts.css';

.join-us-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background: #fff;
}

.banner-section {
  background: linear-gradient(to bottom, #F5E6D3, #9b7c1f);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-shadow: inset 0 0 50px rgba(155, 124, 31, 0.2);
}

.banner-image {
  max-width: 100%;
  height: auto;
}

.join-us-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  background: #fff;
}

.form-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.elegant-title {
  color: #9b7c1f;
  margin-bottom: 1.5rem;
  font-size: 3rem;
  font-weight: 700;
  font-family: var(--font-heading);
  letter-spacing: 0.5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.elegant-description {
  color: #666;
  font-size: 1.2rem;
  line-height: 1.8;
  font-family: var(--font-body);
  font-weight: 300;
}

.join-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #333;
  font-weight: 500;
}

input {
  padding: 1.2rem;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.4s ease;
  width: 100%;
  font-family: var(--font-body);
  background-color: rgba(255, 255, 255, 0.8);
}

input:focus {
  outline: none;
  border-color: #9b7c1f;
  box-shadow: 0 0 0 4px rgba(155, 124, 31, 0.15);
  background-color: #fff;
}

.submit-btn {
  background-color: #9b7c1f;
  color: #fff;
  padding: 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  width: 100%;
  margin-top: 1.5rem;
  font-family: var(--font-body);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.submit-btn:hover {
  background-color: #826618;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(155, 124, 31, 0.3);
}

.password-input-container {
  position: relative;
  width: 100%;
}

.show-password-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9b7c1f;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem;
}

.show-password-btn:hover {
  color: #826618;
}

.form-links {
  text-align: start !important;
  margin-top: -0.5rem;
}

.link {
  color: #9b7c1f;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.link:hover {
  color: #826618;
  text-decoration: underline;
}

.register-section {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

/* RTL */
[dir="rtl"] .join-form {
  text-align: right;
}
[dir="rtl"] .show-password-btn {
  right: auto;
  left: 1rem;
}
[dir="rtl"] .form-links {
  text-align: left;
}

/* Responsive */
@media (max-width: 1024px) {
  .join-us-container {
    grid-template-columns: 1fr;
  }
  .banner-section {
    display: none;
  }
  .join-us-content {
    padding: 2rem;
  }
}
</style>
