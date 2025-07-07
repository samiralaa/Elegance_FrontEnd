<template>
  <div class="modal-overlay d-flex justify-content-center align-items-center">
    <div class="cart-modal bg-white rounded-4 shadow p-4 position-relative">

      <div class="mb-4 d-flex justify-content-center align-items-center w-100 logo-container">
        <img src="@/assets/images/EleganceLogo.png" alt="Logo" />
      </div>

      <div class="cart-content overflow-auto d-flex align-items-center flex-column" style="max-height: 70vh;">
        <div class="w-50 d-flex align-items-center flex-column text-center">
          <p class="text-center mb-4">sorry to say</p>
          <fa icon="circle-exclamation" size="xl" class="icon mb-2"></fa>
          <h5>Enter the <span>OTP</span> sent in the email to <span>active</span> your <span>account</span></h5>
          <router-link to="/otp" @click.prevent="resendOtp()" class="login-btn btn my-4">active now</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerifyOtp',
  methods: {
    async resendOtp() {
      try {
        const response = await axios.post('api/resend-otp', {
          email: this.email,
        });

        if (response.data?.status && response.data.token && response.data.user) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.success = response.data.message || 'OTP resent successfully.';
          setTimeout(() => {
            this.$router.push('/otp');
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.error = 'Something went wrong. Please try again.';
      }
    }
  },
}
</script>

<style>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1050;
  backdrop-filter: blur(2px);
  padding: 1rem;
}

.cart-modal {
  width: 100%;
  max-width: 70%;
  max-height: 90vh;
  overflow: hidden;
  animation: fadeInUp 0.3s ease-in-out;
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.logo-container img {
  height: 80px;
}

.cart-content {
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.cart-content::-webkit-scrollbar {
  width: 6px;
}

.cart-content::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

.cart-content {
  text-transform: uppercase;
}

.cart-content p {
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
}

h5 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 1rem 0;
  text-align: center;
}

h5 span {
  color: #8B6B3D;
}

.login-btn {
  background-color: #8b6b3d;
  color: #fff !important;
}

.login-btn:hover {
  background-color: #725932;
}

.login-btn:focus {
  color: #fff !important;
}

.icon {
  color: #8B6B3D;
}

.icon {
  font-size: 2rem;
}

@media screen and (max-width: 768px) {
  .cart-modal {
    max-width: 90%;
  }

  .logo-container img {
    height: 50px;
  }

  h5 {
    font-size: 1rem;
  }
}
</style>