<template>
  <div class="checkout-step">
    <h2>{{ $t('checkout.shippingDetails') }}</h2>
    <form @submit.prevent="$emit('next-step')" class="shipping-form">
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
        <button type="button" class="btn-secondary" @click="$emit('previous-step')">
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
    modelValue: {
      type: Object,
      required: true
    }
  },
  computed: {
    shippingDetails: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  }
}
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

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #8b6b3d;
  outline: none;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #8b6b3d;
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background: #725932;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #8b6b3d;
  color: #8b6b3d;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .button-group {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style> 