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
          <div class="form-group">
            <label for="country">{{ $t('register.country') }}</label>
            <el-select
              v-model="formData.country"
              class="country-select"
              :placeholder="$t('register.countryPlaceholder')"
              required
            >
              <el-option
                v-for="country in countries"
                :key="country.code"
                :label="country.name"
                :value="country.code"
              >
                {{ country.name }} ({{ country.dialCode }})
              </el-option>
            </el-select>
          </div>
          <div class="form-group phone-group">
            <label for="phoneNumber">{{ $t('register.phoneNumber') }}</label>
            <div class="phone-input-container">
              <span class="country-code" v-if="selectedCountryDialCode">
                {{ selectedCountryDialCode }}
              </span>
              <input
                type="tel"
                id="phoneNumber"
                v-model="formData.phoneNumber"
                :placeholder="$t('register.phoneNumberPlaceholder')"
                required
                pattern="[0-9]{9}"
                maxlength="9"
              >
            </div>
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
import { ref } from 'vue'
import { ElSelect, ElOption } from 'element-plus'

export default {
  name: 'Register',
  components: {
    ElSelect,
    ElOption
  },
  data() {
    return {
      formData: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        phoneNumber: ''
      },
      countries: [
        { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
        { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
        { code: 'KW', name: 'Kuwait', dialCode: '+965' },
        { code: 'BH', name: 'Bahrain', dialCode: '+973' },
        { code: 'QA', name: 'Qatar', dialCode: '+974' },
        { code: 'OM', name: 'Oman', dialCode: '+968' }
      ]
    }
  },
  computed: {
    selectedCountryDialCode() {
      const country = this.countries.find(c => c.code === this.formData.country)
      return country ? country.dialCode : ''
    }
  },
  methods: {
    handleRegister() {
      // TODO: Implement registration logic
      console.log('Registration data:', {
        ...this.formData,
        phoneNumber: this.selectedCountryDialCode + this.formData.phoneNumber
      })
    },
    formatPhoneNumber(value) {
      // Remove non-numeric characters
      const numeric = value.replace(/[^0-9]/g, '')
      // Format as needed (example: XXX-XXX-XXXX)
      return numeric.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3')
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

.country-select {
  width: 100%;
}

.phone-group {
  margin-bottom: 1.5rem;
}

.phone-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.country-code {
  background-color: #f5f5f5;
  padding: 0.75rem;
  border-radius: 4px;
  color: #333;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #fff !important;
  border: 1px solid #ddd;
  box-shadow: none;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: #8B6B3D;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #8B6B3D;
  box-shadow: none;
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