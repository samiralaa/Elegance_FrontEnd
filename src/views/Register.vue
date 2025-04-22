<template>
  <div class="register-container">
    <div class="register-left">
      <div class="product-showcase">
        <img src="@/assets/images/EleganceLogo.png" alt="Elegance" class="logo">
        <div class="product-image">
          <!-- <img src="@/assets/images/perfume-display.jpg" alt="Luxury Perfume" class="featured-product"> -->
        </div>
      </div>
    </div>
    <div class="register-right">
      <div class="register-form-container">
        <h2>{{ $t('header.register') }}</h2>
        <p class="subtitle">{{ $t('header.register') }}</p>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="fullName">{{ $t('header.fullName') }}</label>
            <input 
              type="text" 
              id="fullName" 
              v-model="formData.fullName" 
              :placeholder="$t('header.fullNamePlaceholder')"
              :class="{ 'error': errors.fullName, 'valid': formData.fullName && !errors.fullName }"
              required
            >
            <span class="error-message" v-if="errors.fullName">{{ errors.fullName }}</span>
          </div>
          <div class="form-group">
            <label for="email">{{ $t('header.email') }}</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              :placeholder="$t('header.emailPlaceholder')"
              :class="{ 'error': errors.email, 'valid': formData.email && !errors.email }"
              required
            >
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label for="password">{{ $t('header.password') }}</label>
            <input 
              type="password" 
              id="password" 
              v-model="formData.password" 
              :placeholder="$t('header.passwordPlaceholder')"
              :class="{ 'error': errors.password, 'valid': formData.password && !errors.password }"
              required
            >
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
          </div>
          <div class="form-group">
            <label for="confirmPassword">{{ $t('header.confirmPassword') }}</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="formData.confirmPassword" 
              :placeholder="$t('register.confirmPasswordPlaceholder')"
              :class="{ 'error': errors.confirmPassword, 'valid': formData.confirmPassword && !errors.confirmPassword }"
              required
            >
            <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
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
                :class="{ 'error': errors.phoneNumber, 'valid': formData.phoneNumber && !errors.phoneNumber }"
                required
                pattern="[0-9]{9}"
                maxlength="9"
              >
            </div>
            <span class="error-message" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</span>
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
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api/clients'

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
      errors: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        country: ''
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
  watch: {
    'formData.fullName'(value) {
      this.validateFullName(value)
    },
    'formData.email'(value) {
      this.validateEmail(value)
    },
    'formData.password'(value) {
      this.validatePassword(value)
      if (this.formData.confirmPassword) {
        this.validateConfirmPassword(this.formData.confirmPassword)
      }
    },
    'formData.confirmPassword'(value) {
      this.validateConfirmPassword(value)
    },
    'formData.phoneNumber'(value) {
      this.validatePhoneNumber(value)
    },
    'formData.country'(value) {
      this.validateCountry(value)
    }
  },
  methods: {
    validateFullName(value) {
      if (!value) {
        this.errors.fullName = this.$t('register.validation.fullNameRequired')
      } else if (value.length < 3) {
        this.errors.fullName = this.$t('register.validation.fullNameLength')
      } else if (!/^[\p{L}\s'-]+$/u.test(value)) {
        this.errors.fullName = this.$t('register.validation.fullNameInvalid')
      } else {
        this.errors.fullName = ''
      }
    },
    validateEmail(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) {
        this.errors.email = this.$t('register.validation.emailRequired')
      } else if (!emailRegex.test(value)) {
        this.errors.email = this.$t('register.validation.emailInvalid')
      } else {
        this.errors.email = ''
      }
    },
    validatePassword(value) {
      if (!value) {
        this.errors.password = this.$t('register.validation.passwordRequired')
      } else if (value.length < 8) {
        this.errors.password = this.$t('register.validation.passwordLength')
      } else if (!/[A-Z]/.test(value)) {
        this.errors.password = this.$t('register.validation.passwordUppercase')
      } else if (!/[a-z]/.test(value)) {
        this.errors.password = this.$t('register.validation.passwordLowercase')
      } else if (!/[0-9]/.test(value)) {
        this.errors.password = this.$t('register.validation.passwordNumber')
      } else if (!/[!@#$%^&*]/.test(value)) {
        this.errors.password = this.$t('register.validation.passwordSpecial')
      } else {
        this.errors.password = ''
      }
    },
    validateConfirmPassword(value) {
      if (!value) {
        this.errors.confirmPassword = this.$t('register.validation.confirmPasswordRequired')
      } else if (value !== this.formData.password) {
        this.errors.confirmPassword = this.$t('register.validation.confirmPasswordMatch')
      } else {
        this.errors.confirmPassword = ''
      }
    },
    validatePhoneNumber(value) {
      if (!value) {
        this.errors.phoneNumber = this.$t('register.validation.phoneRequired')
      } else if (!/^[0-9]{9}$/.test(value)) {
        this.errors.phoneNumber = this.$t('register.validation.phoneInvalid')
      } else {
        this.errors.phoneNumber = ''
      }
    },
    validateCountry(value) {
      if (!value) {
      } else {
        this.errors.country = ''
      }
    },
    async handleRegister() {
      // Validate all fields
      this.validateFullName(this.formData.fullName)
      this.validateEmail(this.formData.email)
      this.validatePassword(this.formData.password)
      this.validateConfirmPassword(this.formData.confirmPassword)
      this.validatePhoneNumber(this.formData.phoneNumber)
      this.validateCountry(this.formData.country)
      
      // Check if there are any errors
      const hasErrors = Object.values(this.errors).some(error => error !== '')
      if (!hasErrors) {
        try {
          const registrationData = {
            name: this.formData.fullName,
            email: this.formData.email,
            password: this.formData.password,
            phone: this.selectedCountryDialCode + this.formData.phoneNumber,
            country_id: this.formData.country
          }
          
          const response = await axios.post(API_URL, registrationData)
          
          if (response.status === 201) {
    const data = response.data;

    console.log("Registration Successful");
    console.log("Message:", data.message);
    console.log("User:", data.user);

    // Optionally save the user info
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to /otp route
    this.$router.push({ name: 'Otp' });
}

        } catch (error) {
          if (error.response && error.response.data) {
            // Handle validation errors from the server
            const serverErrors = error.response.data.errors
            if (serverErrors) {
              Object.keys(serverErrors).forEach(field => {
                this.errors[field] = serverErrors[field][0]
              })
            } else {
              // Handle general error
              console.error('Registration failed:', error.response.data.message)
            }
          } else {
            console.error('Registration failed:', error)
          }
        }
      }
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

input.error {
  border-color: #dc3545;
  background-color: #fff;
}

input.valid {
  border-color: #28a745;
  background-color: #fff;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
  transition: all 0.3s ease;
}

.form-group {
  position: relative;
}

input:focus {
  border-color: #8B6B3D;
  box-shadow: 0 0 0 0.2rem rgba(139, 107, 61, 0.25);
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