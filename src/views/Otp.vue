<template>
  <div class="otp-wrapper">

    <div class="otp-container">
      <img src="@/assets/images/EleganceLogo.png" alt="Logo" height="100" />
      <p class="otp-message">{{ $t('otp.message') }}</p>
      <span>{{ user.email }}</span>
      <form @submit.prevent="handleOtpVerification">
        <div class="otp-input-group">
          <input v-for="i in 4" :key="i" type="number" min="0" max="9" v-model="otp[i - 1]" @input="focusNext(i)"
            @keydown="handleKeyDown($event, i)" class="otp-input" placeholder="_">
        </div>
        <button type="submit" class="verify-btn">{{ $t('otp.verify') }}</button>
      </form>
      <div class="resend d-flex w-100 justify-content-between align-items-center mt-3">
        <div class="time-left">
          <span>03:00</span>
        </div>
        <a href="">
          <fa icon="rotate-right"></fa>
          {{ $t('otp.resend') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'https://backend.webenia.org/api'

export default {
  data() {
    return {
      otp: Array(4).fill(''),
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
      if (index < 4 && this.otp[index - 1]) {
        this.$el.querySelectorAll('.otp-input')[index].focus()
      }
    },
    handleKeyDown(event, index) {
      // Handle backspace
      if (event.key === 'Backspace' && !this.otp[index - 1] && index > 1) {
        this.$el.querySelectorAll('.otp-input')[index - 2].focus()
      }
    },
    async handleOtpVerification() {
      const code = this.otp.join('')
      if (code.length !== 2) {
        this.$toast?.error?.(this.$t?.('otp.invalidLength') || 'Please enter all 4 digits')
        return
      }

      try {
        const response = await axios.post(`${API_URL}/client/verify-otp`, {
          otp: code,
          email: this.user.email
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        if (response.data.status === true) {
          // Save user to localStorage
          const userData = {
            ...this.user,
            ...response.data.data.user // Merge updated user data (e.g., id, is_verified, etc.)
          }
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('token', response.data.data.token)

          // Redirect to home
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
a {
  text-decoration: none;
  color: #7f7f7f;
  font-size: 0.9rem;
}
.otp-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.otp-container {
  width: fit-content;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.otp-message {
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
}
.otp-container span{
  font-weight: bold;
  color: #7f7f7f;
  margin-bottom: 0px;
}


.otp-input-group {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
}

.otp-input {
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 1.2rem;
  background-color: #7c7c7c54;
  border: 0px;
  border-radius: 4px;
}

.otp-input::-webkit-outer-spin-button,
.otp-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.otp-input::placeholder {
  color: #333;
  font-weight: bold;
}

.otp-input:focus {
  border-color: #725932;
  background-color: #8b6a3d5b;
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

.resend {
  padding: 0 100px;
  font-weight: bold;
}

.time-left {
  font-size: 0.9rem;
  color: #7f7f7f;
}
</style>