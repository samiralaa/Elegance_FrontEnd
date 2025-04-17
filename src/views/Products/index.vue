<template>
    <div class="products-container">
      <div class="header">
        <h2>Products</h2>
        <el-button type="primary" :icon="Plus" @click="openCreateDialog">Add Product</el-button>
      </div>
  
      <el-card class="products-table">
        <el-table v-loading="loading" :data="products" style="width: 100%">
          <el-table-column label="Image" width="120">
            <template #default="{ row }">
              <el-image
                v-if="row.images && row.images.length > 0"
                :src="`${BASE_URL}/${row.images[0].path}`"
                fit="cover"
                class="product-image"
                :preview-src-list="[`${BASE_URL}/${row.images[0].path}`]"
                :initial-index="0"
                preview-teleported
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div v-else class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-table-column>
  
          <el-table-column prop="name_en" label="Name (EN)" />
          <el-table-column prop="name_ar" label="Name (AR)">
            <template #default="{ row }">
              <div dir="rtl">{{ row.name_ar || 'N/A' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="Price" />
          <el-table-column prop="currency.name_en" label="Currency" />
          <el-table-column label="Actions" width="200">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" :icon="View" @click="viewProduct(row.id)">View</el-button>
                <el-button type="warning" :icon="Edit" @click="editProduct(row)">Edit</el-button>
                <el-button type="danger" :icon="Delete" @click="deleteProduct(row)">Delete</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Plus, Edit, Delete, Picture, View } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import axios from 'axios'
  
  const router = useRouter()
  const products = ref([])
  const loading = ref(false)
  const BASE_URL = 'http://127.0.0.1:8000'
  const API_URL = `${BASE_URL}/api/products`
  
  const fetchProducts = async () => {
    loading.value = true
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      if (!tokenData || !tokenData.token) {
        throw new Error('Authentication token not found')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
  
      const response = await axios.get(API_URL)
  
      // Check if response status is truthy (i.e., true)
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
        'Are you sure you want to delete this product?',
        'Warning',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
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
          ElMessage.success('Product deleted successfully')
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
  
  onMounted(() => {
    fetchProducts()
  })
  </script>
  
  <style scoped>
  .products-container {
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .products-table {
    margin-top: 20px;
  }
  
  .product-image {
    width: 100px;
    height: 60px;
    border-radius: 4px;
  }
  
  .image-error {
    width: 100px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
    border-radius: 4px;
  }
  
  .image-error .el-icon {
    font-size: 24px;
    color: #909399;
  }
  </style>
  