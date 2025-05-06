<template>
    <div class="currency-create-container">
      <el-card class="currency-card">
        <h2>{{ $t('currencies.Createcurrency') }}</h2>
  
        <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
          <!-- Name (EN) -->
          <el-form-item :label="$t('currencies.NameEn')" prop="name_en">
            <el-input v-model="form.name_en" />
          </el-form-item>
  
          <!-- Name (AR) -->
          <el-form-item :label="$t('currencies.NameAr')" prop="name_ar">
            <el-input v-model="form.name_ar" />
          </el-form-item>
  
          <!-- Exchange Rate -->
          <el-form-item :label="$t('currencies.exchange_rate')" prop="exchange_rate">
            <el-input v-model="form.exchange_rate" />
          </el-form-item>
  
          <!-- Submit -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">
              {{ $t('currencies.CreateButton') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  const router = useRouter()
  
  const formRef = ref(null)
  
  const form = ref({
    name_en: '',
    name_ar: '',
    exchange_rate: '',
  })
  
  const rules = {
    name_en: [{ required: true, message: 'Please input currency name (EN)', trigger: 'blur' }],
    name_ar: [{ required: true, message: 'Please input currency name (AR)', trigger: 'blur' }],
    exchange_rate: [
      { required: true, message: 'Please input exchange rate', trigger: 'blur' },
      { pattern: /^\d+(\.\d{1,2})?$/, message: 'Exchange rate must be a valid number', trigger: 'blur' }
    ]
  }
  
  const BASE_URL = 'https://elegance_commers.test'
  const currencies_API = `${BASE_URL}/api/currencies`
  
  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const formData = new FormData()
          formData.append('name_en', form.value.name_en)
          formData.append('name_ar', form.value.name_ar)
          formData.append('exchange_rate', form.value.exchange_rate)
  
          const tokenData = JSON.parse(localStorage.getItem('tokenData'))
          if (!tokenData || !tokenData.token) {
            throw new Error('Authentication token not found')
          }
  
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
  
          const response = await axios.post(currencies_API, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
  
          if (response.data.status) {
            ElMessage.success('Currency created successfully')
            router.push('/currencies')
          } else {
            throw new Error(response.data.message || 'Failed to create currency')
          }
        } catch (error) {
          if (error.response && error.response.status === 422) {
            const validationErrors = error.response.data.errors
            for (const key in validationErrors) {
              ElMessage.error(validationErrors[key][0])
            }
          } else {
            ElMessage.error(error.message || 'Failed to create currency')
          }
        }
      } else {
        console.log('Form validation failed')
        return false
      }
    })
  }
  </script>
  
  <style scoped>
  .currency-create-container {
    max-width: 800px;
    margin: 30px auto;
    padding: 20px;
  }
  
  .currency-card {
    padding: 20px;
  }
  </style>
  