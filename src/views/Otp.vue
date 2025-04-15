<template>
  <div class="otp-container">
    <h2>{{ $t('otp.title') }}</h2>
    <form @submit.prevent="handleOtpVerification">
      <div class="otp-input-group">
        <input 
          v-for="i in 6" 
          :key="i"
          type="text"
          maxlength="1"
          v-model="otp[i-1]"
          @input="focusNext(i)"
          class="otp-input"
        >
      </div>
      <button type="submit" class="verify-btn">{{ $t('otp.verify') }}</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      otp: Array(6).fill('')
    }
  },
  methods: {
    focusNext(index) {
      if (index < 6 && this.otp[index-1]) {
        this.$el.querySelectorAll('.otp-input')[index].focus()
      }
    },
    handleOtpVerification() {
      const code = this.otp.join('')
      // Add verification logic here
      this.$router.push('/')
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
}

.verify-btn {
  background-color: #8B6B3D;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.verify-btn:hover {
  background-color: #725932;
}
</style>