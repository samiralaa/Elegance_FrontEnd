<template>
  <div class="product-edit-container">
    <el-card class="product-card">
      <h2>{{ $t('Products.EditProduct') }}</h2>

      <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" enctype="multipart/form-data">
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
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name_en || cat.name_ar" :value="cat.id" />
          </el-select>
        </el-form-item>

        <!-- Currency Select -->
        <el-form-item :label="$t('Products.Currency')" prop="currency_id">
          <el-select v-model="form.currency_id" :placeholder="$t('Products.SelectCurrency')" filterable clearable>
            <el-option v-for="curr in activeCurrencies" :key="curr.id" :label="getCurrencyLabel(curr)" :value="curr.id">
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
            <el-option v-for="country in countries" :key="country.id" :label="country.name_en || country.name_ar"
              :value="country.id" />
          </el-select>
        </el-form-item>

        <!-- Parent Product Select -->
        <el-form-item :label="$t('Products.ParentProduct')" prop="parent_id">
          <el-select v-model="form.parent_id" :placeholder="$t('Products.SelectParentProduct')" clearable>
            <el-option :label="$t('Products.None')" :value="null" />
            <el-option v-for="parent in parentProducts" :key="parent.id" :label="parent.name_en" :value="parent.id" />
          </el-select>
        </el-form-item>

        <!-- Images Upload (optional for edit) -->
        <!-- Existing Product Images -->
        <div v-if="existingImages.length" class="existing-images">
          <h4>{{ $t('Products.ExistingImages') }}</h4>
          <div class="image-list">
            <div v-for="(img, index) in existingImages" :key="img.id" class="image-item">
              <img :src="`${BASE_URL}/public/storage/${img.path}`" alt="Product Image" />
            </div>
          </div>
        </div>

        <el-form-item :label="$t('Products.Images')" prop="images">
          <el-upload class="upload-demo" drag action="" list-type="picture" :auto-upload="false" :file-list="fileList"
            :on-change="handleFileChange" :on-remove="handleRemove" :before-remove="beforeRemove">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ $t('Products.DropFiles') }}</div>
          </el-upload>
        </el-form-item>



        <!-- Submit Button -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ $t('Products.UpdateButton') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const form = ref({
  name_en: '',
  name_ar: '',
  price: '',
  is_available: 1,
  description_en: '',
  description_ar: '',
  category_id: null,
  currency_id: null,
  country_id: null,
  parent_id: null,
})
const rules = {
  name_en: [{ required: true, message: 'Please input product name (EN)', trigger: 'blur' }],
  price: [{ required: true, message: 'Please input product price', trigger: 'blur' }],
  category_id: [{ required: true, message: 'Please select a category', trigger: 'change' }],
  currency_id: [{ required: true, message: 'Please select a currency', trigger: 'change' }],
  country_id: [{ required: true, message: 'Please select a country', trigger: 'change' }],
}
const fileList = ref([])

const categories = ref([])
const currencies = ref([])
const countries = ref([])
const parentProducts = ref([])
const existingImages = ref([]) // to store fetched product images

const BASE_URL = 'https://backend.webenia.org'
const PRODUCTS_API = `${BASE_URL}/api/products`
const CATEGORIES_API = `${BASE_URL}/api/categories`
const CURRENCIES_API = `${BASE_URL}/api/currencies`
const COUNTRIES_API = `${BASE_URL}/api/countries`
const activeCurrencies = computed(() => {
  return currencies.value.filter(currency => !currency.is_deleted)
})
const getCurrencyLabel = (currency) => {
  const lang = localStorage.getItem('lang') || 'en'
  return lang === 'ar' ? currency.name_ar : currency.name_en
}


const transformImagesToFileList = () => {
  fileList.value = existingImages.value.map((img) => ({
    name: img.path.split('/').pop(),
    url: `${BASE_URL}/storage/${img.path}`,
    status: 'success',
    isExisting: true, // this image is from server
    id: img.id        // used for existing_images[]
  }))
}
const fetchSelectOptions = async () => {
  try {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'))
    if (!tokenData || !tokenData.token) {
      throw new Error('Authentication token not found')
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
    const categoryRes = await axios.get(CATEGORIES_API)
    if (categoryRes.data.status && categoryRes.data.data) {
      categories.value = categoryRes.data.data
    }
    const currencyRes = await axios.get(CURRENCIES_API)
    if (currencyRes.data.status && currencyRes.data.currencies) {
      currencies.value = currencyRes.data.currencies
    }
    const countryRes = await axios.get(COUNTRIES_API)
    if (countryRes.data.status && countryRes.data.data) {
      countries.value = countryRes.data.data
    }
    const parentRes = await axios.get(PRODUCTS_API)
    if (parentRes.data.status && parentRes.data.data) {
      parentProducts.value = parentRes.data.data
    }
  } catch (err) {
    ElMessage.error(err.message || 'Failed to fetch select options')
  }
}
const fetchProduct = async () => {
  try {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'))
    if (!tokenData || !tokenData.token) {
      throw new Error('Authentication token not found')
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
    const { id } = route.params
    const response = await axios.get(`${PRODUCTS_API}/${id}`)
    if (response.data.status) {
      Object.assign(form.value, response.data.data)
      existingImages.value = response.data.data.images || []
      transformImagesToFileList()

    } else {
      throw new Error(response.data.message || 'Failed to fetch product')
    }
  } catch (err) {
    ElMessage.error(err.message || 'Failed to fetch product')
  }
}
const handleFileChange = (file, fileList_) => {
  fileList.value = fileList_
}
const handleRemove = (file, fileList_) => {
  fileList.value = fileList_
}
const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      if (!tokenData || !tokenData.token) {
        throw new Error('Authentication token not found')
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

      const { id } = route.params
      const formData = new FormData()

      // ✅ Append all form fields
      for (const key in form.value) {
        formData.append(key, form.value[key])
      }

      // ✅ Append new uploaded images
      fileList.value.forEach((file) => {
        if (!file.isExisting && file.raw) {
          formData.append('images[]', file.raw)
        }
      })

      // ✅ Append IDs of existing images to keep
      fileList.value.forEach((file) => {
        if (file.isExisting && file.id) {
          formData.append('existing_images[]', file.id)
        }
      })

      // ✅ Spoof HTTP method as PUT
      formData.append('_method', 'PUT')

      const response = await axios.post(`${PRODUCTS_API}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.status) {
        ElMessage.success(response.data.message || 'Product updated successfully')
        router.push('/products')
      } else {
        throw new Error(response.data.message || 'Failed to update product')
      }
    } catch (err) {
      ElMessage.error(err.message || 'Failed to update product')
    }
  })
}

onMounted(() => {
  fetchSelectOptions()
  fetchProduct()
})
</script>

<style scoped>
.product-edit-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
}

.product-card {
  padding: 20px;
}

.existing-images {
  margin-bottom: 20px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>