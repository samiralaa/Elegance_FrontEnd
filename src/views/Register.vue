<template>
  <div class="register-container">
    <div class="register-left">
      <div class="product-showcase">
        <img src="@/assets/images/EleganceLogo.png" alt="Elegance" class="logo">
        <div class="product-image">
          <img src="@/assets/images/perfume-display.jpg" alt="Luxury Perfume" class="featured-product">
        </div>
      </div>
    </div>
    <div class="register-right">
      <div class="register-form-container">
        <h2>{{ $t('register.title') }}</h2>
        <p class="subtitle">{{ $t('register.subtitle') }}</p>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="fullName">{{ $t('register.fullName') }}</label>
            <input 
              type="text" 
              id="fullName" 
              v-model="formData.fullName" 
              :placeholder="$t('register.fullNamePlaceholder')"
              required
            >
          </div>
          <div class="form-group">
            <label for="email">{{ $t('register.email') }}</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              :placeholder="$t('register.emailPlaceholder')"
              required
            >
          </div>
          <div class="form-group">
            <label for="password">{{ $t('register.password') }}</label>
            <input 
              type="password" 
              id="password" 
              v-model="formData.password" 
              :placeholder="$t('register.passwordPlaceholder')"
              required
            >
          </div>
          <div class="form-group">
            <label for="confirmPassword">{{ $t('register.confirmPassword') }}</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="formData.confirmPassword" 
              :placeholder="$t('register.confirmPasswordPlaceholder')"
              required
            >
          </div>
          <button type="submit" class="register-btn">{{ $t('register.submit') }}</button>
        </form>
        <p class="login-link">
          {{ $t('register.alreadyHaveAccount') }} 
          <router-link to="/login">{{ $t('register.loginHere') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      formData: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleRegister() {
      // TODO: Implement registration logic
      console.log('Registration data:', this.formData)
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  min-height: 100vh;
  background-color: #fff;
}

.register-left {
  flex: 1;
  background: linear-gradient(135deg, #8B6B3D 0%, #725932 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.product-showcase {
  text-align: center;
  color: #fff;
}

.logo {
  width: 200px;
  margin-bottom: 2rem;
}

.product-image {
  max-width: 400px;
  margin: 0 auto;
}

.featured-product {
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.register-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-form-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

h2 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #8B6B3D;
  outline: none;
}

.register-btn {
  width: 100%;
  padding: 1rem;
  background-color: #8B6B3D;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-btn:hover {
  background-color: #725932;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-link a {
  color: #8B6B3D;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

/* RTL Support */
[dir="rtl"] .register-container {
  flex-direction: row-reverse;
}

/* Responsive Design */
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .register-left {
    display: none;
  }

  .register-right {
    padding: 1rem;
  }

  .register-form-container {
    padding: 1rem;
  }
}
</style>