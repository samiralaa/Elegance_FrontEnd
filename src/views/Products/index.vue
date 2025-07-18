  <template>
    <div class="products-container">
      <div class="header">
        <h2>{{ $t('Products.Products') }}</h2>
        <el-button type="primary" :icon="Plus" @click="openCreateDialog">{{ $t('Products.AddProduct') }}</el-button>
      </div>

      <el-card class="products-table">
        <el-table v-loading="loading" :data="products" style="width: 100%">
          <el-table-column :label="$t('Products.Image')" width="120">
            <template #default="{ row }">
              <el-image v-if="row.images && row.images.length > 0" :src="`${BASE_URL}/${row.images[0].path}`" fit="cover"
                class="product-image" :preview-src-list="[`${BASE_URL}public/storage/${row.images[0].path}`]" :initial-index="0"
                preview-teleported>
                <template #error>
                  <div class="image-error">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <div v-else class="image-error">
                <el-icon>
                  <Picture />
                </el-icon>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="name_en" :label="$t('Products.NameEn')" />
          <el-table-column prop="name_ar" :label="$t('Products.NameAr')">
            <template #default="{ row }">
              <div dir="rtl">{{ row.name_ar || $t('Products.NA') }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="$t('Products.Price')" />
          <el-table-column prop="currency.name_en" :label="$t('Products.Currency')" />
          <el-table-column :label="$t('Products.Actions')" width="250">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" :icon="View" @click="viewProduct(row.id)">{{ $t('Products.View') }}</el-button>
                <el-button type="warning" :icon="Edit" @click="editProduct(row)">{{ $t('Products.Edit') }}</el-button>
                <el-button type="danger" :icon="Delete" @click="deleteProduct(row)">{{ $t('Products.Delete') }}</el-button>
                <el-button type="success" :icon="Plus" @click="addAmount(row)">{{ $t('add.amount') }}</el-button>
                <el-button type="info" :icon="Discount" @click="openDiscountDialog(row)">{{ $t('Products.AddDiscount') }}</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- Add Amount Dialog -->
      <el-dialog v-model="showAmountDialog" title="Add Product Amount" width="500px">
        <el-form :model="amountForm" label-width="100px">
          <el-form-item label="Unit">
            <el-select v-model="amountForm.unit_id" placeholder="Select Unit">
              <el-option v-for="unit in units" :key="unit.id" :label="unit.name_en" :value="unit.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="Weight">
            <el-input v-model="amountForm.weight" type="number" placeholder="Enter weight" />
          </el-form-item>

          <el-form-item label="Price">
            <el-input v-model="amountForm.price" type="number" placeholder="Enter price" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="showAmountDialog = false">Cancel</el-button>
          <el-button type="primary" @click="submitAmount">Submit</el-button>
        </template>
      </el-dialog>

      <!-- Add Discount Dialog -->
      <el-dialog 
        v-model="showDiscountDialog" 
        title="Add Product Discount" 
        :width="isMobile ? '90%' : '500px'"
        class="discount-dialog"
      >
        <el-form 
          :model="discountForm" 
          label-width="100px"
          class="discount-form"
        >
          <el-form-item label="Start Date">
            <el-date-picker 
              v-model="discountForm.start_date" 
              type="date" 
              placeholder="Select start date"
              class="w-100"
            />
          </el-form-item>
          <el-form-item label="Duration (days)">
            <el-input 
              v-model="discountForm.duration" 
              type="number" 
              placeholder="Enter duration in days"
              class="w-100"
            />
          </el-form-item>
          <el-form-item label="Discount Value (%)">
            <el-input 
              v-model="discountForm.discount_value" 
              type="number" 
              placeholder="Enter discount percentage"
              class="w-100"
            />
          </el-form-item>
          <el-form-item label="Is Active">
            <el-switch v-model="discountForm.is_active" />
          </el-form-item>
          <input type="hidden" v-model="discountForm.product_id" />
          <input type="hidden" v-model="discountForm.category_id" />
          <el-form-item label="End Date">
            <el-date-picker 
              v-model="discountForm.end_date" 
              type="date" 
              placeholder="Select end date"
              class="w-100"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showDiscountDialog = false">Cancel</el-button>
            <el-button type="primary" @click="submitDiscount">Submit</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Plus, Edit, Delete, Picture, View, Discount } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import axios from 'axios'

  const router = useRouter()
  const { t } = useI18n()
  const products = ref([])
  const loading = ref(false)

  const BASE_URL = 'https://backend.webenia.org'

  const API_URL = `${BASE_URL}/api/dashboard/products`

  const fetchProducts = async () => {
    loading.value = true
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      if (!tokenData || !tokenData.token) {
        throw new Error('Authentication token not found')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

      const response = await axios.get(API_URL)

      if (response.data.status) {
        products.value = response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Fetch products error:', error)
      ElMessage.error(error.message || 'Failed to fetch products')
    } finally {
      loading.value = false
    }
  }

  const openCreateDialog = () => {
    router.push('/products/create')
  }

  const viewProduct = (id) => {
    router.push(`/products/${id}`)
  }

  const editProduct = (product) => {
    router.push(`/products/${product.id}/edit`)
  }

  const deleteProduct = async (product) => {
    try {
      const result = await ElMessageBox.confirm(
        t('Products.DeleteConfirmation'),
        t('Products.Warning'),
        {
          confirmButtonText: t('Products.Yes'),
          cancelButtonText: t('Products.No'),
          type: 'warning',
        }
      )

      if (result === 'confirm') {
        loading.value = true
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (!tokenData || !tokenData.token) {
          throw new Error('Authentication token not found')
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        const response = await axios.delete(`${API_URL}/${product.id}`)

        if (response.data.status) {
          ElMessage.success(t('Products.DeletedSuccessfully'))
          products.value = products.value.filter(p => p.id !== product.id)
        } else {
          throw new Error(response.data.message || 'Failed to delete product')
        }
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Delete product error:', error)
        ElMessage.error(error.message || 'Failed to delete product')
      }
    } finally {
      loading.value = false
    }
  }

  // Add Amount Logic
  const showAmountDialog = ref(false)
  const selectedProduct = ref(null)
  const units = ref([])
  const amountForm = ref({
    unit_id: '',
    weight: '',
    price: '',
  })

  const fetchUnits = async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
      const res = await axios.get(`${BASE_URL}/api/units`)
      units.value = res.data.data
    } catch (err) {
      console.error('Failed to fetch units:', err)
      ElMessage.error('Failed to load units')
    }
  }

  const addAmount = (product) => {
    selectedProduct.value = product
    amountForm.value = {
      unit_id: '',
      weight: '',
      price: ''
    }
    fetchUnits()
    showAmountDialog.value = true
  }

  const submitAmount = async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

      const payload = {
        product_id: selectedProduct.value.id,
        unit_id: amountForm.value.unit_id,
        weight: amountForm.value.weight,
        price: amountForm.value.price
      }

      const res = await axios.post(`${BASE_URL}/api/amounts`, payload)

      if (res.data.status) {
        ElMessage.success('Amount added successfully')
        showAmountDialog.value = false
      } else {
        ElMessage.error(res.data.message || 'Failed to add amount')
      }
    } catch (err) {
      console.error(err)
      ElMessage.error('Error occurred while saving amount')
    }
  }

  // Add Discount Logic
  const showDiscountDialog = ref(false)
  const discountForm = ref({
    start_date: '',
    duration: '',
    discount_value: '',
    is_active: false,
    product_id: '',
    category_id: '',
    end_date: '',
  })

  const openDiscountDialog = (product) => {
    selectedProduct.value = product
    discountForm.value = {
      start_date: '',
      duration: '',
      discount_value: '',
      is_active: false,
      product_id: product.id,
      category_id: product.category_id || '',
      end_date: '',
    }
    showDiscountDialog.value = true
  }

  const submitDiscount = async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

      const payload = {
        start_date: discountForm.value.start_date,
        duration: discountForm.value.duration,
        discount_value: discountForm.value.discount_value,
        is_active: discountForm.value.is_active,
        product_id: discountForm.value.product_id,
        category_id: discountForm.value.category_id,
        end_date: discountForm.value.end_date,
      }

      const res = await axios.post(`${BASE_URL}/api/discounts`, payload)

      if (res.data.status) {
        ElMessage.success('Discount added successfully')
        showDiscountDialog.value = false
      } else {
        ElMessage.error(res.data.message || 'Failed to add discount')
      }
    } catch (err) {
      console.error(err)
      ElMessage.error('Error occurred while saving discount')
    }
  }

  // Add responsive check
  const isMobile = computed(() => {
    return window.innerWidth <= 768
  })

  onMounted(() => {
    fetchProducts()
  })
  </script>

  <style scoped>
  .products-container {
    padding: 24px;
    background-color: #f5f7fa;
    min-height: 100vh;
  }

  .header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    gap: 12px;
  }

  .header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .products-table {
    background-color: #ffffff;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow-x: auto;
  }

  .product-image {
    width: 100px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #ebeef5;
  }

  .image-error {
    width: 100px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f2f5;
    border-radius: 8px;
    border: 1px dashed #dcdfe6;
  }

  .image-error .el-icon {
    font-size: 24px;
    color: #909399;
  }

  .el-button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
  }

  .el-button {
    transition: all 0.2s ease-in-out;
    font-weight: 500;
    border-radius: 8px;
    white-space: nowrap;
  }

  .el-button:hover {
    filter: brightness(0.95);
  }

  .el-dialog .el-form-item {
    margin-bottom: 18px;
  }

  .el-dialog__footer {
    padding-top: 12px;
  }

  .el-form .el-input,
  .el-form .el-select {
    width: 100%;
  }

  /* Responsive tweaks */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: flex-start;
    }

    .header h2 {
      font-size: 20px;
    }

    .el-button-group {
      flex-direction: column;
      width: 100%;
    }

    .el-button-group .el-button {
      width: 100%;
    }

    .products-table {
      padding: 12px;
    }

    .product-image,
    .image-error {
      width: 80px;
      height: 50px;
    }
  }

  @media (max-width: 480px) {
    .header h2 {
      font-size: 18px;
    }

    .product-image,
    .image-error {
      width: 60px;
      height: 40px;
    }
  }

  .discount-dialog {
    :deep(.el-dialog) {
      margin: 0 !important;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-height: 90vh;
      overflow-y: auto;
    }
  }

  .discount-form {
    :deep(.el-form-item) {
      margin-bottom: 1.5rem;
    }

    :deep(.el-form-item__label) {
      font-weight: 500;
    }

    :deep(.el-input),
    :deep(.el-date-editor) {
      width: 100%;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-top: 1rem;
  }

  @media (max-width: 768px) {
    .discount-form {
      :deep(.el-form-item__label) {
        float: none;
        display: block;
        text-align: left;
        padding: 0 0 0.5rem;
      }

      :deep(.el-form-item__content) {
        margin-left: 0 !important;
      }
    }

    .dialog-footer {
      flex-direction: column;
      gap: 0.5rem;

      .el-button {
        width: 100%;
      }
    }
  }
  </style>
