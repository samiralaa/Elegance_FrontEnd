<template>
  <el-dropdown @command="handleCurrencyChange" trigger="click">
    <span class="currency-dropdown">
      {{ getCurrencyName(selectedCurrency) }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="currency in activeCurrencies" :key="currency.id" :command="currency">
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
import { ref, computed, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'CurrencySwitcher',
  components: {
    ArrowDown
  },
  setup() {
    const currencies = ref([])
    const selectedCurrency = ref(null)

    const activeCurrencies = computed(() => {
      return currencies.value.filter(currency => !currency.is_deleted)
    })

    const getCurrencyName = (currency) => {
      if (!currency) return 'Select Currency'
      const lang = localStorage.getItem('lang') || 'en'
      return lang === 'ar' ? currency.name_ar : currency.name_en
    }

    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://backend.webenia.org/api/currencies')
        if (response.data && Array.isArray(response.data)) {
          currencies.value = response.data
          
          // Set default currency (US Dollar) if not already set
          if (!selectedCurrency.value) {
            const defaultCurrency = currencies.value.find(c => c.name_en === 'US Dollar' && !c.is_deleted)
            if (defaultCurrency) {
              selectedCurrency.value = defaultCurrency
              localStorage.setItem('selectedCurrency', JSON.stringify(defaultCurrency))
            }
          }
        }
      } catch (error) {
        console.error('Fetch currencies error:', error)
        ElMessage.error('Failed to fetch currencies')
      }
    }

    const handleCurrencyChange = async (currency) => {
      try {
        // Make authenticated API call to change currency
        const response = await axios.post('https://backend.webenia.org/api/currencies/change', {
          currency_id: currency.id
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        if (response.data && response.data.status === 'success') {
          selectedCurrency.value = currency
          // Emit event to parent component
          window.dispatchEvent(new CustomEvent('currency-changed', { 
            detail: { currency } 
          }))
          // Save to localStorage
          localStorage.setItem('selectedCurrency', JSON.stringify(currency))
          ElMessage.success('Currency changed successfully')
        } else {
          throw new Error(response.data?.message || 'Failed to change currency')
        }
      } catch (error) {
        console.error('Error changing currency:', error)
        ElMessage.error(error.message || 'Failed to change currency')
      }
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
      activeCurrencies,
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