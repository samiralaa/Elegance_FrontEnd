  <template>
    <div class="product-edit-container">
      <el-card class="product-card">
        <h2>{{ $t('Products.EditProduct') }}</h2>

        <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" enctype="multipart/form-data">
          <!-- Name EN -->
          <el-form-item :label="$t('Products.NameEn')" prop="name_en">
            <el-input v-model="form.name_en" />
          </el-form-item>

          <!-- Name AR -->
          <el-form-item :label="$t('Products.NameAr')" prop="name_ar">
            <el-input v-model="form.name_ar" />
          </el-form-item>

          <!-- Toggle for Amount -->
          <el-form-item :label="$t('Products.NeedsAmount')">
            <el-switch v-model="form.amount_required" active-text="Yes" inactive-text="No" />
          </el-form-item>

          <template v-if="form.amount_required">
            <el-divider content-position="left">{{ $t('Products.AmountInfo') }}</el-divider>

            <!-- Unit -->
            <el-form-item :label="$t('Products.Unit')" prop="unit_id">
              <el-select v-model="form.unit_id" placeholder="Select Unit">
                <el-option v-for="unit in units" :key="unit.id" :label="unit.name_en" :value="unit.id" />
              </el-select>
            </el-form-item>

            <!-- Weight -->
            <el-form-item :label="$t('Products.Weight')" prop="weight">
              <el-input v-model="form.weight" type="number" placeholder="Enter weight" />
            </el-form-item>

            <!-- Amount Price -->
            <el-form-item :label="$t('Products.AmountPrice')" prop="amount_price">
              <el-input v-model="form.amount_price" type="number" placeholder="Enter price" />
            </el-form-item>
          </template>

          <!-- Price -->
          <el-form-item v-if="!form.amount_required" :label="$t('Products.Price')" prop="price">
            <el-input v-model="form.price" type="number" />
          </el-form-item>

          <!-- Availability -->
          <el-form-item :label="$t('Products.Availability')" prop="is_available">
            <el-switch v-model="form.is_available" :active-value="1" :inactive-value="0" />
          </el-form-item>

          <!-- Descriptions -->
          <el-form-item :label="$t('Products.DescriptionEn')" prop="description_en">
            <el-input type="textarea" v-model="form.description_en" />
          </el-form-item>
          <el-form-item :label="$t('Products.DescriptionAr')" prop="description_ar">
            <el-input type="textarea" v-model="form.description_ar" />
          </el-form-item>

          <!-- Selects -->
          <el-form-item :label="$t('Products.Category')" prop="category_id">
            <el-select v-model="form.category_id" filterable clearable :placeholder="$t('Products.SelectCategory')">
              <el-option v-for="cat in categories" :key="cat.id" :label="cat.name_en || cat.name_ar" :value="cat.id" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('Products.Brand')" prop="brand_id">
            <el-select v-model="form.brand_id" filterable clearable placeholder="Select Brand">
              <el-option v-for="brand in brands" :key="brand.id" :label="brand.name_en" :value="brand.id" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('Products.Currency')" prop="currency_id">
            <el-select v-model="form.currency_id" filterable clearable :placeholder="$t('Products.SelectCurrency')">
              <el-option v-for="curr in activeCurrencies" :key="curr.id" :label="getCurrencyLabel(curr)" :value="curr.id" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('Products.Country')" prop="country_id">
            <el-select v-model="form.country_id" filterable clearable :placeholder="$t('Products.SelectCountry')">
              <el-option v-for="country in countries" :key="country.id" :label="country.name_en || country.name_ar" :value="country.id" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('Products.ParentProduct')" prop="parent_id">
            <el-select v-model="form.parent_id" clearable :placeholder="$t('Products.SelectParentProduct')">
              <el-option :label="$t('Products.None')" :value="null" />
              <el-option v-for="parent in parentProducts" :key="parent.id" :label="parent.name_en" :value="parent.id" />
            </el-select>
          </el-form-item>

          <!-- Image Upload -->
          <div v-if="form.images && form.images.length" class="image-preview-list" style="margin-bottom: 1em;">
            <img
              v-for="(img, idx) in form.images"
              :key="idx"
              :src="img.url ? img.url : getImageUrl(img.path)"
              alt="Product Image"
              style="max-width: 120px; max-height: 120px; margin-right: 10px; border-radius: 8px;"
            />
          </div>
          <el-form-item :label="$t('Products.Images')" prop="images">
            <el-upload
              class="upload-demo"
              drag
              action=""
              :auto-upload="false"
              :limit="5"
              :file-list="form.images"
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
            <el-button type="primary" @click="submitForm">{{ $t('Products.UpdateButton') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'

  const router = useRouter()
  const route = useRoute()
  const formRef = ref(null)
  const BASE_URL = 'https://backend.webenia.org'
  const productId = route.params.id

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
    brand_id: null,
    images: [],
    amount_required: false,
    unit_id: null,
    weight: null,
    amount_price: null,
  })

  const rules = {
    name_en: [{ required: true, message: 'Required', trigger: 'blur' }],
    price: [{ required: true, message: 'Required', trigger: 'blur' }]
  }

  const categories = ref([])
  const currencies = ref([])
  const countries = ref([])
  const parentProducts = ref([])
  const brands = ref([])
  const units = ref([])

  const getCurrencyLabel = (currency) => (localStorage.getItem('lang') || 'en') === 'ar' ? currency.name_ar : currency.name_en
  const activeCurrencies = computed(() => currencies.value.filter(c => !c.is_deleted))

  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (typeof imgPath === 'object' && imgPath.url) return imgPath.url;
    if (imgPath.startsWith('http')) return imgPath;
    return `${BASE_URL}/public/storage/${imgPath}`;
  }

  const fetchOptions = async () => {
    const token = JSON.parse(localStorage.getItem('tokenData'))?.token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const [cat, cur, cou, parents, brand, unit] = await Promise.all([
      axios.get(`${BASE_URL}/api/categories`),
      axios.get(`${BASE_URL}/api/currencies`),
      axios.get(`${BASE_URL}/api/countries`),
      axios.get(`${BASE_URL}/api/products`),
      axios.get(`${BASE_URL}/api/brands`),
      axios.get(`${BASE_URL}/api/units`),
    ])
    categories.value = cat.data.data
    currencies.value = cur.data
    countries.value = cou.data.data
    parentProducts.value = parents.data.data
    brands.value = brand.data.data
    units.value = unit.data.data
  }

  const fetchProduct = async () => {
    try {
      const productRes = await axios.get(`/api/products/${productId}`);
      const product = productRes.data.data;

      // Fill form with existing product data
      form.value.name_ar = product.name_ar;
      form.value.name_en = product.name_en;
      form.value.description_ar = product.description_ar;
      form.value.description_en = product.description_en;
      form.value.price = product.price;
      form.value.currency_id = product.currency_id;
      form.value.country_id=product.country_id;
      form.value.brand_id = product.brand_id;
      form.value.parent_id = product.parent_id;
      form.value.quantity = product.quantity ?? 1;
      form.value.type = product.type ?? 'product';
      form.value.offer = product.discount ? '1' : '0';
      form.value.offer_price = product.discount ? product.discounted_price : '';
      form.value.category_id = product.category_id;
      form.value.images = product.images.map(img => ({
        id: img.id,
        path: img.path,
        url: getImageUrl(img.path)
      }))

      // Fetch categories and currencies
      const [catRes, currRes] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/currencies'),
      ]);
      categories.value = catRes.data;
      currencies.value = currRes.data;
    } catch (error) {
      console.error('Error loading product data', error);
    }
  }

  const handleFileChange = (file, fileList) => (form.value.images = fileList)
  const handleRemove = (file, fileList) => (form.value.images = fileList)

  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (!valid) return
      const formData = new FormData()
      for (const key in form.value) {
        if (key !== 'images' && form.value[key] !== null) formData.append(key, form.value[key])
      }
      form.value.images.forEach(img => {
        if (img.raw) {
          // New image file
          formData.append('images[]', img.raw)
        } else if (img.id) {
          // Existing image path: send only the relative path
          formData.append('existing_images[]', img.id)
        }
      })
      const token = JSON.parse(localStorage.getItem('tokenData'))?.token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      await axios.post(`${BASE_URL}/api/products/${productId}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      ElMessage.success('Product updated successfully')
      router.push('/products')
    })
  }

  onMounted(() => {
    fetchOptions()
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
  .image-preview-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1em;
  }
  </style>