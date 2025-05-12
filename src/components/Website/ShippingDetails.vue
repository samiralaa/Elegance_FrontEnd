<template>
  <div class="checkout-step">
    <h2>{{ $t('checkout.shippingDetails') }}</h2>
    <form @submit.prevent="nextStep" class="shipping-form">
      <div class="form-group">
        <label for="fullName">{{ $t('checkout.fullName') }}</label>
        <input type="text" id="fullName" v-model="shippingDetails.fullName" required>
      </div>
      <div class="form-group">
        <label for="address">{{ $t('checkout.address') }}</label>
        <textarea id="address" v-model="shippingDetails.address" required></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="city">{{ $t('checkout.city') }}</label>
          <input type="text" id="city" v-model="shippingDetails.city" required>
        </div>
        <div class="form-group">
          <label for="postalCode">{{ $t('checkout.postalCode') }}</label>
          <input type="text" id="postalCode" v-model="shippingDetails.postalCode" required>
        </div>
      </div>
      <div class="form-group">
        <label for="phone">{{ $t('checkout.phone') }}</label>
        <input type="tel" id="phone" v-model="shippingDetails.phone" required>
      </div>
      <div class="form-group">
        <label for="buildingName">{{ $t('checkout.buildingName') }}</label>
        <input type="text" id="buildingName" v-model="shippingDetails.buildingName" required>
      </div>
      <div class="form-group">
        <label for="floorNumber">{{ $t('checkout.floorNumber') }}</label>
        <input type="text" id="floorNumber" v-model="shippingDetails.floorNumber" required>
      </div>
      <div class="form-group">
        <label for="apartmentNumber">{{ $t('checkout.apartmentNumber') }}</label>
        <input type="text" id="apartmentNumber" v-model="shippingDetails.apartmentNumber" required>
      </div>
      <div class="form-group">
        <label for="landmark">{{ $t('checkout.landmark') }}</label>
        <input type="text" id="landmark" v-model="shippingDetails.landmark" required>
      </div>
      <div class="form-group">
        <label for="street">{{ $t('checkout.street') }}</label>
        <input type="text" id="street" v-model="shippingDetails.street" required>
      </div>
      <div class="form-group">
        <label for="country">{{ $t('checkout.country') }}</label>
        <input type="text" id="country" v-model="shippingDetails.country" required>
      </div>
      <div class="button-group">
        <button type="button" class="btn-secondary" @click="previousStep">
          {{ $t('checkout.back') }}
        </button>
        <button type="submit" class="btn-primary">
          {{ $t('checkout.continueToPayment') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ShippingDetails',
  props: {
    shippingDetails: Object
  },
  methods: {
    nextStep() {
      this.$emit('next-step');
    },
    previousStep() {
      this.$emit('previous-step');
    }
  }
};
</script>

<style scoped>
.checkout-step {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.shipping-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #ccc;
}

.btn-primary {
  background-color: #8b6b3d;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #6b4b2d;
}
</style>