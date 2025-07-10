<template>
  <div class="product-create-container">
    <el-card class="product-card">
      <h2>{{ $t('Products.CreateProduct') }}</h2>

      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="120px"
        enctype="multipart/form-data"
      >
        <!-- Name (EN) -->
        <el-form-item :label="$t('Products.NameEn')" prop="name_en">
          <el-input v-model="form.name_en" />
        </el-form-item>

        <!-- Name (AR) -->
        <el-form-item :label="$t('Products.NameAr')" prop="name_ar">
          <el-input v-model="form.name_ar" />
        </el-form-item>

        <!-- Price -->
        <el-form-item :label="$t('Products.Price')" prop="price">
          <el-input v-model="form.price" type="number" />
        </el-form-item>

        <!-- Availability -->
        <el-form-item :label="$t('Products.Availability')" prop="is_available">
          <el-switch v-model="form.is_available" active-value="1" inactive-value="0" />
        </el-form-item>

        <!-- Description (EN) -->
        <el-form-item :label="$t('Products.DescriptionEn')" prop="description_en">
          <el-input type="textarea" v-model="form.description_en" />
        </el-form-item>

        <!-- Description (AR) -->
        <el-form-item :label="$t('Products.DescriptionAr')" prop="description_ar">
          <el-input type="textarea" v-model="form.description_ar" />
        </el-form-item>

        <!-- Category Select -->
        <el-form-item :label="$t('Products.Category')" prop="category_id">
          <el-select v-model="form.category_id" :placeholder="$t('Products.SelectCategory')" filterable clearable>
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name_en || cat.name_ar"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <!-- Currency Select -->
        <el-form-item :label="$t('Products.Currency')" prop="currency_id">
          <el-select v-model="form.currency_id" :placeholder="$t('Products.SelectCurrency')" filterable clearable>
            <el-option
              v-for="curr in activeCurrencies"
              :key="curr.id"
              :label="getCurrencyLabel(curr)"
              :value="curr.id"
            >
              <div class="currency-option">
                <span class="currency-name">{{ curr.name_en }}</span>
                <span class="currency-rate">({{ parseFloat(curr.exchange_rate).toFixed(2) }})</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Country Select -->
        <el-form-item :label="$t('Products.Country')" prop="country_id">
          <el-select v-model="form.country_id" :placeholder="$t('Products.SelectCountry')" filterable clearable>
            <el-option
              v-for="country in countries"
              :key="country.id"
              :label="country.name_en || country.name_ar"
              :value="country.id"
            />
          </el-select>
        </el-form-item>

        <!-- Parent Product Select -->
        <el-form-item :label="$t('Products.ParentProduct')" prop="parent_id">
          <el-select v-model="form.parent_id" :placeholder="$t('Products.SelectParentProduct')" clearable>
            <el-option :label="$t('Products.None')" :value="null" />
            <el-option
              v-for="parent in parentProducts"
              :key="parent.id"
              :label="parent.name_en"
              :value="parent.id"
            />
          </el-select>
        </el-form-item>

        <!-- Images Upload -->
        <el-form-item :label="$t('Products.Images')" prop="images">
          <el-upload
            class="upload-demo"
            drag
            action=""
            :auto-upload="false"
            :limit="5"
            :file-list="fileList"
            list-type="picture"
            :on-change="handleFileChange"
            :on-remove="handleRemove"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ $t('Products.DropFiles') }}</div>
          </el-upload>
        </el-form-item>

        <!-- Submit Button -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ $t('Products.CreateButton') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// Router instance for navigation
const router = useRouter()

// Form reference for validation
const formRef = ref(null)

// The product form object
const form = ref({
  name_en: '',
  name_ar: '',
  price: '',
  is_available: 1, // using 1/0 as per backend expectation
  description_en: '',
  description_ar: '',
  category_id: null,
  currency_id: null,
  country_id: null,
  parent_id: null,
})

// Basic form validation rules
const rules = {
  name_en: [{ required: true, message: 'Please input product name (EN)', trigger: 'blur' }],
  price: [{ required: true, message: 'Please input product price', trigger: 'blur' }],
  category_id: [{ required: true, message: 'Please select a category', trigger: 'change' }],
  currency_id: [{ required: true, message: 'Please select a currency', trigger: 'change' }],
  country_id: [{ required: true, message: 'Please select a country', trigger: 'change' }],
}

// Reactive fileList for uploaded images
const fileList = ref([])

// Reactive arrays for select options
const categories = ref([])
const currencies = ref([])
const countries = ref([])
const parentProducts = ref([])

// Base URL and API endpoints
const BASE_URL = 'http://elegance_backend.test'

const PRODUCTS_API = `${BASE_URL}/api/products`
const CATEGORIES_API = `${BASE_URL}/api/categories`
const CURRENCIES_API = `${BASE_URL}/api/currencies`
const COUNTRIES_API = `${BASE_URL}/api/countries`

// Add computed property for active currencies
const activeCurrencies = computed(() => {
  return currencies.value.filter(currency => !currency.is_deleted)
})

// Add function to format currency label
const getCurrencyLabel = (currency) => {
  const lang = localStorage.getItem('lang') || 'en'
  return lang === 'ar' ? currency.name_ar : currency.name_en
}

// Fetch select options from API endpoints
const fetchSelectOptions = async () => {
  try {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'))
    if (!tokenData || !tokenData.token) {
      throw new Error('Authentication token not found')
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

    // Fetch Categories
    const categoryRes = await axios.get(CATEGORIES_API)
    if (categoryRes.data.status && categoryRes.data.data) {
      categories.value = categoryRes.data.data
    }

    // Fetch Currencies
    const currencyRes = await axios.get(CURRENCIES_API)
    if (currencyRes.data && Array.isArray(currencyRes.data)) {
      currencies.value = currencyRes.data
    }

    // Fetch Countries
    const countryRes = await axios.get(COUNTRIES_API)
    if (countryRes.data.status && countryRes.data.data) {
      countries.value = countryRes.data.data
    }

    // Fetch Parent Products
    const parentProductsRes = await axios.get(PRODUCTS_API)
    if (parentProductsRes.data.status && parentProductsRes.data.data) {
      parentProducts.value = parentProductsRes.data.data
    }

  } catch (error) {
    console.error('Error fetching select options:', error)
    ElMessage.error(error.response?.data?.message || 'Failed to load form options')
  }
}

// Handle file change (update fileList)
const handleFileChange = (file, newFileList) => {
  fileList.value = newFileList
}

// Handle remove file from list
const handleRemove = (file, newFileList) => {
  fileList.value = newFileList
}

// Submit the product creation form
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // Prepare form data
        const formData = new FormData()
        formData.append('name_en', form.value.name_en)
        formData.append('name_ar', form.value.name_ar)
        formData.append('price', form.value.price)
        formData.append('is_available', form.value.is_available)
        formData.append('description_en', form.value.description_en)
        formData.append('description_ar', form.value.description_ar)
        formData.append('category_id', form.value.category_id)
        formData.append('currency_id', form.value.currency_id)
        formData.append('country_id', form.value.country_id)
        if (form.value.parent_id) {
          formData.append('parent_id', form.value.parent_id)
        }

        // Append each image file
        fileList.value.forEach(file => {
          formData.append('images[]', file.raw)
        })

        // Limit the number of images to 3 to reduce payload size
        if (fileList.value.length > 3) {
          ElMessage.warning('You can only upload up to 3 images.')
          return
        }

        // Retrieve token from localStorage
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (!tokenData || !tokenData.token) {
          throw new Error('Authentication token not found')
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

        // Send POST request to create product
        const response = await axios.post(PRODUCTS_API, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        // Check response status
        if (response.data.status) {
          ElMessage.success('Product created successfully')
          // Redirect to product list or detail page
          router.push('/products')
        } else {
          throw new Error(response.data.message || 'Failed to create product')
        }
      } catch (error) {
        console.error('Product creation error:', error)
        ElMessage.error(error.message || 'Failed to create product')
      }
    } else {
      console.log('Form validation failed')
      return false
    }
  })
}

// Fetch dynamic select options when component mounts
onMounted(() => {
  fetchSelectOptions()
})
</script>

<style scoped>
.product-create-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
}

.product-card {
  padding: 20px;
}

.upload-demo {
  width: 100%;
}

.currency-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.currency-name {
  font-weight: 500;
}

.currency-rate {
  color: #909399;
  font-size: 0.9em;
  margin-left: 8px;
}
</style>