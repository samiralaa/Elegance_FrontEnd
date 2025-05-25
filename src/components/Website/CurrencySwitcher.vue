<template>
  <el-dropdown @command="handleCurrencyChange" trigger="click">
    <span class="currency-dropdown">
      {{ getCurrencyName(selectedCurrency) }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="currency in currencies" :key="currency.id" :command="currency">
          <div class="currency-item">
            <span class="currency-name-ar">{{ currency.name_ar }}</span>
            <span class="currency-name-en">{{ currency.name_en }}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import axios from 'axios'

export default {
  name: 'CurrencySwitcher',
  components: {
    ArrowDown
  },
  setup() {
    const currencies = ref([])
    const selectedCurrency = ref(null)

    const getCurrencyName = (currency) => {
      if (!currency) return 'Select Currency'
      const lang = localStorage.getItem('lang') || 'en'
      return lang === 'ar' ? currency.name_ar : currency.name_en
    }

    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/currencies')
        if (response.data.status === 'success') {
          // Remove duplicates based on name_en
          const uniqueCurrencies = response.data.data.reduce((acc, current) => {
            const x = acc.find(item => item.name_en === current.name_en)
            if (!x) {
              return acc.concat([current])
            } else {
              return acc
            }
          }, [])
          currencies.value = uniqueCurrencies
          
          // Set default currency (US Dollar) if not already set
          if (!selectedCurrency.value) {
            selectedCurrency.value = currencies.value.find(c => c.name_en === 'US Dollar')
          }
        }
      } catch (error) {
        console.error('Error fetching currencies:', error)
      }
    }

    const handleCurrencyChange = (currency) => {
      selectedCurrency.value = currency
      // Emit event to parent component
      window.dispatchEvent(new CustomEvent('currency-changed', { 
        detail: { currency } 
      }))
      // Save to localStorage
      localStorage.setItem('selectedCurrency', JSON.stringify(currency))
    }

    onMounted(() => {
      // Load saved currency from localStorage
      const savedCurrency = localStorage.getItem('selectedCurrency')
      if (savedCurrency) {
        selectedCurrency.value = JSON.parse(savedCurrency)
      }
      fetchCurrencies()
    })

    return {
      currencies,
      selectedCurrency,
      handleCurrencyChange,
      getCurrencyName
    }
  }
}
</script>

<style scoped>
.currency-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 14px;
}

.currency-dropdown:hover {
  opacity: 0.8;
}

.el-dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}

.currency-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.currency-name-ar {
  font-size: 14px;
  color: #333;
}

.currency-name-en {
  font-size: 12px;
  color: #666;
}

[dir="rtl"] .currency-item {
  text-align: right;
}
</style>