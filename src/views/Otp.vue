<template>
  <div class="otp-container">
    <h2>{{ $t('otp.title') }}</h2>
    <p class="otp-message">{{ $t('otp.message') }}</p>
    <form @submit.prevent="handleOtpVerification">
      <div class="otp-input-group">
        <input 
          v-for="i in 6" 
          :key="i"
          type="text"
          maxlength="1"
          v-model="otp[i-1]"
          @input="focusNext(i)"
          @keydown="handleKeyDown($event, i)"
          class="otp-input"
          placeholder="0"
        >
      </div>
      <button type="submit" class="verify-btn">{{ $t('otp.verify') }}</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'https://backend.webenia.org/api'

export default {
  data() {
    return {
      otp: Array(6).fill(''),
      user: null,
      token: null
    }
  },
  created() {
    // Get data from localStorage
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('auth_token')
    
    if (!userData || !token) {
      // If no data, redirect back to registration
      this.$router.push('/register')
      return
    }

    this.user = JSON.parse(userData)
    this.token = token
  },
  methods: {
    focusNext(index) {
      if (index < 6 && this.otp[index-1]) {
        this.$el.querySelectorAll('.otp-input')[index].focus()
      }
    },
    handleKeyDown(event, index) {
      // Handle backspace
      if (event.key === 'Backspace' && !this.otp[index-1] && index > 1) {
        this.$el.querySelectorAll('.otp-input')[index-2].focus()
      }
    },
    async handleOtpVerification() {
      const code = this.otp.join('')
      if (code.length !== 6) {
        this.$toast?.error?.(this.$t?.('otp.invalidLength') || 'Please enter all 6 digits')
        return
      }

      try {
        const response = await axios.post(`${API_URL}/verify-otp`, {
          otp: code,
          email: this.user.email
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        if (response.data.success) {
          // Save user ID to localStorage
          const userData = {
            ...this.user,
            id: response.data.user.id
          };
          localStorage.setItem('user', JSON.stringify(userData));
          
          this.$toast?.success?.(this.$t?.('otp.success') || 'OTP verified successfully')
          this.$router.push('/')
        }
      } catch (error) {
        console.error('OTP verification error:', error)
        const errorMessage = error.response?.data?.message || this.$t?.('otp.error') || 'OTP verification failed'
        this.$toast?.error?.(errorMessage)
      }
    }
  }
}
</script>

<style scoped>
.otp-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.otp-message {
  color: #666;
  margin-bottom: 2rem;
}

.otp-input-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.otp-input {
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 1.2rem;
  border: 2px solid #8B6B3D;
  border-radius: 4px;
  background: #fff;
}

.otp-input:focus {
  border-color: #725932;
  outline: none;
  box-shadow: 0 0 0 2px rgba(139, 107, 61, 0.2);
}

.verify-btn {
  background-color: #8B6B3D;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  transition: background-color 0.3s;
}

.verify-btn:hover {
  background-color: #725932;
}

.verify-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>