<template>
  <div class="checkout-step">
    <h2>{{ $t('checkout.shippingDetails') }}</h2>

    <!-- Address Type Selection -->
    <div class="address-type-selector">
      <button 
        class="type-btn" 
        :class="{ active: !isNewAddress }"
        @click="isNewAddress = false"
      >
        {{ $t('checkout.selectExistingAddress') }}
      </button>
      <button 
        class="type-btn" 
        :class="{ active: isNewAddress }"
        @click="isNewAddress = true"
      >
        {{ $t('checkout.createNewAddress') }}
      </button>
    </div>

    <!-- Saved Addresses Section -->
    <div class="saved-addresses" v-if="!isNewAddress && savedAddresses.length">
      <h3>{{ $t('checkout.savedAddresses') }}</h3>
      <div class="address-list">
        <div v-for="address in savedAddresses" :key="address.id" 
             class="address-card" 
             :class="{ 'selected': selectedAddressId === address.id }"
             @click="selectAddress(address)">
          <div class="address-info">
            <p><strong>{{ address.building_name }}</strong></p>
            <p>{{ address.landmark }}</p>
            <p>Floor {{ address.floor_number }}, Apartment {{ address.apartment_number }}</p>
            <p>Postal Code: {{ address.postal_code }}</p>
            <p v-if="address.is_primary" class="primary-badge">{{ $t('checkout.primaryAddress') }}</p>
          </div>
          <div class="address-actions">
            <button class="btn-select" :class="{ 'selected': selectedAddressId === address.id }">
              {{ selectedAddressId === address.id ? $t('checkout.selected') : $t('checkout.select') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Address Form -->
    <form v-if="isNewAddress" @submit.prevent="handleSubmit" class="shipping-form">
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
        <label for="postalCode">{{ $t('checkout.postalCode') }}</label>
        <input type="text" id="postalCode" v-model="shippingDetails.postalCode" required>
      </div>
    </form>

    <div class="button-group">
      <button type="button" class="btn-secondary" @click="$emit('previous-step')">
        {{ $t('checkout.back') }}
      </button>
      <button 
        type="button" 
        class="btn-primary" 
        @click="handleSubmit"
        :disabled="!isValid"
      >
        {{ $t('checkout.continueToPayment') }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ShippingDetails',
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      savedAddresses: [],
      selectedAddressId: null,
      loading: false,
      error: null,
      selectedAddress: null,
      isNewAddress: false
    };
  },
  computed: {
    shippingDetails: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    isValid() {
      if (this.isNewAddress) {
        return this.shippingDetails.buildingName && 
               this.shippingDetails.floorNumber && 
               this.shippingDetails.apartmentNumber && 
               this.shippingDetails.landmark && 
               this.shippingDetails.postalCode;
      }
      return this.selectedAddressId !== null;
    }
  },
  methods: {
    async fetchSavedAddresses() {
      this.loading = true;
      try {
        const response = await axios.get('http://elegance_backend.test/api/address', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status && response.data.data) {
          this.savedAddresses = response.data.data;
          // Select primary address if exists
          const primaryAddress = this.savedAddresses.find(addr => addr.is_primary);
          if (primaryAddress) {
            this.selectAddress(primaryAddress);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },
    selectAddress(address) {
      this.selectedAddressId = address.id;
      this.selectedAddress = address;
      this.isNewAddress = false;
      // Only update addressId in shipping details, don't populate form fields
      this.shippingDetails = {
        ...this.shippingDetails,
        addressId: address.id
      };
    },
    handleSubmit() {
      if (this.isValid) {
        const orderData = {
          ...this.shippingDetails,
          addressId: this.isNewAddress ? null : this.selectedAddressId
        };
        this.$emit('next-step', orderData);
      }
    }
  },
  mounted() {
    this.fetchSavedAddresses();
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

.saved-addresses {
  margin-bottom: 2rem;
}

.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.address-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #fff;
}

.address-card:hover {
  border-color: #8b6b3d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.address-info {
  flex: 1;
  margin-right: 1rem;
}

.address-info p {
  margin: 0.25rem 0;
  color: #666;
  line-height: 1.4;
}

.address-info p strong {
  color: #333;
  font-size: 1.1rem;
}

.btn-select {
  padding: 0.5rem 1rem;
  border: 1px solid #8b6b3d;
  background: transparent;
  color: #8b6b3d;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-select.selected {
  background: #8b6b3d;
  color: white;
}

.form-divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.form-divider::before,
.form-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: #dee2e6;
}

.form-divider::before {
  left: 0;
}

.form-divider::after {
  right: 0;
}

.form-divider span {
  background: white;
  padding: 0 1rem;
  color: #666;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .address-list {
    grid-template-columns: 1fr;
  }
}

.primary-badge {
  display: inline-block;
  background-color: #8b6b3d;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.address-card.selected {
  border-color: #8b6b3d;
  background-color: #faf6f0;
}

.address-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.address-type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.type-btn {
  flex: 1;
  padding: 1rem;
  border: 1px solid #dee2e6;
  background: white;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-btn.active {
  background: #8b6b3d;
  color: white;
  border-color: #8b6b3d;
}

.type-btn:hover:not(.active) {
  border-color: #8b6b3d;
  color: #8b6b3d;
}

.shipping-form {
  margin-top: 2rem;
}

.button-group {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .address-type-selector {
    flex-direction: column;
  }
  
  .button-group {
    flex-direction: column-reverse;
  }
}
</style> 