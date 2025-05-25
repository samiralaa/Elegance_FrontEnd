<template>
    <div class="currency-edit-container">
      <el-card class="currency-card">
        <h2>Edit Currency</h2>
  
        <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
          <!-- Name (EN) -->
          <el-form-item label="Name (EN)" prop="name_en">
            <el-input v-model="form.name_en" />
          </el-form-item>
  
          <!-- Name (AR) -->
          <el-form-item label="Name (AR)" prop="name_ar">
            <el-input v-model="form.name_ar" />
          </el-form-item>
  
          <!-- Exchange Rate -->
          <el-form-item label="Exchange Rate" prop="exchange_rate">
            <el-input v-model="form.exchange_rate" />
          </el-form-item>
  
          <!-- Submit -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">Update</el-button>
            <el-button @click="router.push('/currencies')">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  const router = useRouter()
  const route = useRoute()
  
  const currencyId = route.params.id
  
  const formRef = ref(null)
  const form = ref({
    name_en: '',
    name_ar: '',
    exchange_rate: ''
  })
  
  const rules = {
    name_en: [{ required: true, message: 'Please enter name (EN)', trigger: 'blur' }],
    name_ar: [{ required: true, message: 'Please enter name (AR)', trigger: 'blur' }],
    exchange_rate: [
      { required: true, message: 'Please enter exchange rate', trigger: 'blur' },
      { pattern: /^\d+(\.\d{1,2})?$/, message: 'Must be a valid number', trigger: 'blur' }
    ]
  }
  

  const BASE_URL = 'http://127.0.0.1:8000'

  const CURRENCY_API = `${BASE_URL}/api/currencies`
  
  // Fetch existing data
  const fetchCurrency = async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      if (!tokenData?.token) {
        ElMessage.error('Authorization token is missing')
        return
      }
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
  
      const { data } = await axios.get(`${CURRENCY_API}/${currencyId}`)
      if (data && data.data) {
        form.value = {
          name_en: data.data.name_en,
          name_ar: data.data.name_ar,
          exchange_rate: data.data.exchange_rate
        }
      } else {
        ElMessage.error('Currency not found')
      }
    } catch (error) {
      ElMessage.error('Failed to fetch currency data')
    }
  }
  
  onMounted(fetchCurrency)
  
  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (!valid) return
  
      try {
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (!tokenData?.token) {
          ElMessage.error('Authorization token is missing')
          return
        }
  
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
  
        await axios.post(`${CURRENCY_API}/${currencyId}`, form.value)
  
        ElMessage.success('Currency updated successfully')
        router.push('/currencies')
      } catch (error) {
        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors
          for (const key in validationErrors) {
            ElMessage.error(validationErrors[key][0])
          }
        } else {
          ElMessage.error('Failed to update currency')
        }
      }
    })
  }
  </script>
  
  <style scoped>
  .currency-edit-container {
    max-width: 800px;
    margin: 30px auto;
    padding: 20px;
  }
  .currency-card {
    padding: 20px;
  }
  </style>
  