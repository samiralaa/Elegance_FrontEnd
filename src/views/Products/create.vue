<template>
  <div class="product-create-container">
    <el-card class="product-card">
      <h2>{{ $t('Products.CreateProduct') }}</h2>

      <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" enctype="multipart/form-data">
        <!-- Name EN -->
        <el-form-item :label="$t('Products.NameEn')" prop="name_en">
          <el-input v-model="form.name_en" />
        </el-form-item>

        <!-- Name AR -->
        <el-form-item :label="$t('Products.NameAr')" prop="name_ar">
          <el-input v-model="form.name_ar" />
        </el-form-item>
        
        <!-- Availability -->
        <el-form-item :label="$t('Products.Availability')" prop="is_available">
          <el-switch v-model="form.is_available" active-value="1" inactive-value="0" />
        </el-form-item>

        <!-- Manual toggle for amount -->
        <el-form-item :label="$t('General.NeedsAmount')">
          <el-switch v-model="amountRequired" :active-text="$t('General.Yes')" :inactive-text="$t('General.No')" />
        </el-form-item>

        <!-- Show amount fields conditionally -->
        <template v-if="amountRequired">
          <el-divider content-position="left">{{$t('General.AmountInfo')}}</el-divider>

          <el-form-item :label="$t('General.Unit')" prop="unit_id">
            <el-select v-model="amountForm.unit_id" :placeholder="$t('General.SelectUnit')">
              <el-option v-for="unit in units" :key="unit.id" :label="unit.name_en" :value="unit.id" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('General.Weight')" prop="weight">
            <el-input v-model="amountForm.weight" type="number" :placeholder="$t('General.EnterWeight')" />
          </el-form-item>

          <el-form-item :label="$t('Products.Price')" prop="price">
            <el-input v-model="amountForm.price" type="number" :placeholder="$t('General.EnterPrice')" />
          </el-form-item>
        </template>

        <!-- Price -->
        <el-form-item v-if="!amountRequired" :label="$t('Products.Price')" prop="price">
          <el-input v-model="form.price" type="number" />
        </el-form-item>

        <!-- Description EN -->
        <el-form-item :label="$t('Products.DescriptionEn')" prop="description_en">
          <el-input type="textarea" v-model="form.description_en" />
        </el-form-item>

        <!-- Description AR -->
        <el-form-item :label="$t('Products.DescriptionAr')" prop="description_ar">
          <el-input type="textarea" v-model="form.description_ar" />
        </el-form-item>

        <!-- Category -->
        <el-form-item :label="$t('Products.Category')" prop="category_id">
          <el-select v-model="form.category_id" :placeholder="$t('Products.SelectCategory')" filterable clearable>
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name_en || cat.name_ar" :value="cat.id" />
          </el-select>
        </el-form-item>

        <!-- Add after category select -->
        <el-form-item :label="$t('Products.Brand')" prop="brand_id">
          <el-select v-model="form.brand_id" placeholder="Select Brand" filterable clearable>
            <el-option
              v-for="brand in brands"
              :key="brand.id"
              :label="brand.name_en"
              :value="brand.id"
            />
          </el-select>
        </el-form-item>

        <!-- Currency -->
        <el-form-item :label="$t('Products.Currency')" prop="currency_id">
          <el-select v-model="form.currency_id" :placeholder="$t('Products.SelectCurrency')" filterable clearable>
            <el-option v-for="curr in activeCurrencies" :key="curr.id" :label="getCurrencyLabel(curr)"
              :value="curr.id" />
          </el-select>
        </el-form-item>

        <!-- Country -->
        <el-form-item :label="$t('Products.Country')" prop="country_id">
          <el-select v-model="form.country_id" :placeholder="$t('Products.SelectCountry')" filterable clearable>
            <el-option v-for="country in countries" :key="country.id" :label="country.name_en || country.name_ar"
              :value="country.id" />
          </el-select>
        </el-form-item>

        <!-- Parent Product -->
        <el-form-item :label="$t('Products.ParentProduct')" prop="parent_id">
          <el-select v-model="form.parent_id" :placeholder="$t('Products.SelectParentProduct')" clearable>
            <el-option :label="$t('Products.None')" :value="null" />
            <el-option v-for="parent in parentProducts" :key="parent.id" :label="parent.name_en" :value="parent.id" />
          </el-select>
        </el-form-item>

        <!-- Images -->
        <el-form-item :label="$t('Products.Images')" prop="images">
          <el-upload class="upload-demo" drag action="" :auto-upload="false" :limit="5" :file-list="fileList"
            list-type="picture" :on-change="handleFileChange" :on-remove="handleRemove">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ $t('Products.DropFiles') }}</div>
          </el-upload>
        </el-form-item>

        <!-- Submit -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ $t('Products.CreateButton') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const router = useRouter()
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
  brand_id: null, // Add brand_id to form
})

const amountForm = ref({
  unit_id: null,
  weight: null,
  price: null,
})

const amountRequired = ref(false)
const fileList = ref([])
const categories = ref([])
const currencies = ref([])
const countries = ref([])
const parentProducts = ref([])
const units = ref([])
const brands = ref([])

// const rules = {
//   name_en: [{ required: true, message: 'Please input product name (EN)', trigger: 'blur' }],
//   price: [{ required: true, message: 'Please input product price', trigger: 'blur' }],
//   category_id: [{ required: true, message: 'Please select a category', trigger: 'change' }],
//   currency_id: [{ required: true, message: 'Please select a currency', trigger: 'change' }],
//   country_id: [{ required: true, message: 'Please select a country', trigger: 'change' }],
//   brand_id: [{ required: true, message: 'Please select a brand', trigger: 'change' }], // Add validation
// }

const rules = {
  name_en: [
    { required: true, message: t('Validation.ProductNameEn'), trigger: 'blur' }
  ],
  price: [
    { required: true, message: t('Validation.ProductPrice'), trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: t('Validation.SelectCategory'), trigger: 'change' }
  ],
  currency_id: [
    { required: true, message: t('Validation.SelectCurrency'), trigger: 'change' }
  ],
  country_id: [
    { required: true, message: t('Validation.SelectCountry'), trigger: 'change' }
  ],
  brand_id: [
    { required: true, message: t('Validation.SelectBrand'), trigger: 'change' }
  ]
}


const BASE_URL = 'https://backend.webenia.org'

const fetchSelectOptions = async () => {
  try {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

    const [categoryRes, currencyRes, countryRes, parentProductRes, unitRes] = await Promise.all([
      axios.get(`${BASE_URL}/api/categories`),
      axios.get(`${BASE_URL}/api/currencies`),
      axios.get(`${BASE_URL}/api/countries`),
      axios.get(`${BASE_URL}/api/products`),
      axios.get(`${BASE_URL}/api/units`),
    ])

    categories.value = categoryRes.data.data || []
    currencies.value = currencyRes.data || []
    countries.value = countryRes.data.data || []
    parentProducts.value = parentProductRes.data.data || []
    units.value = unitRes.data.data || []
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Failed to load form options')
  }
}

const fetchBrands = async () => {
  try {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
    const res = await axios.get('https://backend.webenia.org/api/brands')
    brands.value = Array.isArray(res.data.data) ? res.data.data : [res.data.data]
  } catch (err) {
    ElMessage.error('Failed to load brands')
  }
}

const activeCurrencies = computed(() => currencies.value.filter(c => !c.is_deleted))
const getCurrencyLabel = (currency) => {
  const lang = localStorage.getItem('lang') || 'en'
  return lang === 'ar' ? currency.name_ar : currency.name_en
}

const handleFileChange = (file, fileListNew) => (fileList.value = fileListNew)
const handleRemove = (file, fileListNew) => (fileList.value = fileListNew)

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const formData = new FormData()
      for (const key in form.value) {
        if (form.value[key] !== null) formData.append(key, form.value[key])
      }
      fileList.value.forEach(file => formData.append('images[]', file.raw))

      if (amountRequired.value) {
        formData.append('unit_id', amountForm.value.unit_id)
        formData.append('weight', amountForm.value.weight)
        formData.append('price', amountForm.value.price)
      }

      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

      const res = await axios.post(`${BASE_URL}/api/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.data.status) {
        ElMessage.success('Product created successfully')
        router.push('/products')
      } else {
        throw new Error(res.data.message || 'Failed to create product')
      }
    } catch (err) {
      ElMessage.error(err.message || 'Failed to create product')
    }
  })
}

onMounted(() => {
  fetchSelectOptions()
  fetchBrands()
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

::v-deep(.el-form-item__label){
  text-align: start;
  justify-content:flex-start;
  width: 170px !important;
}

[dir="rtl"] .el-switch{
  flex-direction: row-reverse;
}
</style>
