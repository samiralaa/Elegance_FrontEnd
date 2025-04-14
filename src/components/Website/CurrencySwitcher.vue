<template>
  <div class="currency-switcher">
    <select v-model="selectedCurrency" @change="changeCurrency" class="currency-select">
      <option value="" disabled>{{ $t('common.currency.select') }}</option>
      <option value="AED">{{ $t('common.currency.AED') }}</option>
      <option value="USD">{{ $t('common.currency.USD') }}</option>
    </select>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'CurrencySwitcher',
  setup() {
    const store = useStore()
    const selectedCurrency = ref(localStorage.getItem('currency') || 'AED')

    const changeCurrency = () => {
      localStorage.setItem('currency', selectedCurrency.value)
      store.commit('setCurrency', selectedCurrency.value)
    }

    return {
      selectedCurrency,
      changeCurrency
    }
  }
}
</script>

<style scoped>
.currency-switcher {
  display: inline-block;
  margin-left: 1rem;
}

.currency-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.currency-select:focus {
  outline: none;
  border-color: #4a5568;
}

:deep(.currency-select option) {
  padding: 0.5rem;
}
</style>