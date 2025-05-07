<template>
    <div class="currencies-container">
      <div class="header">
        <h2>currencies List</h2>
        <el-button type="primary" :to="'/currencies/create'" tag="router-link">Add Currencies </el-button>
      </div>
  
      <el-card class="currencies-table">
        <el-table v-loading="loading" :data="currencies" style="width: 100%">
          <el-table-column prop="name_ar" label="Name (Arabic)" />
          <el-table-column prop="name_en" label="Name (English)" />
          <el-table-column prop="exchange_rate" label="exchange_rate" />
          <el-table-column label="Actions">
            <template v-slot="scope">
              <el-button type="text" size="small" @click="handleUpdate(scope.row)">Update</el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { ElMessageBox } from 'element-plus';
  
  const currencies = ref([])
  const loading = ref(false)
  const BASE_URL = 'https://elegance_commers.test'
  const API_URL = `${BASE_URL}/api/currencies`
  
  const fetchcurrencies = async () => {
    loading.value = true
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      if (!tokenData || !tokenData.token) {
        throw new Error('Authentication token not found')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
  
      const response = await axios.get(API_URL)
  
      if (response.data.status) {
        currencies.value = response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch currencies')
      }
    } catch (error) {
      console.error('Fetch currencies error:', error)
    } finally {
      loading.value = false
    }
  }
  
  const openAddcurrencyModal = () => {
  
    // Logic to open a modal or redirect to a form for adding a new currency
    console.log('Open Add currency Modal');
  }
  
  onMounted(() => {
    fetchcurrencies()
  })
  const handleUpdate = (row) => {
  router.push({ name: 'currencies.edit', params: { id: row.id } })
}
  
  const handleDelete = async (currency) => {
    try {
      await ElMessageBox.confirm('Are you sure you want to delete this currency?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      });
  
      const response = await axios.delete(`${API_URL}/${currency.id}`);
      if (response.data.status ) {
       console.log('currency deleted successfully');
        fetchcurrencies();
      } else {
        throw new Error(response.data.message || 'Failed to delete currency');
      }
    } catch (error) {
      console.error('Delete currency error:', error);
    }
  };
  
  </script>
  
  <style scoped>
  .currencies-container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .currencies-table {
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .el-table {
    border-radius: 8px;
    overflow: hidden;
  }
  
  .el-table-column {
    text-align: center;
  }
  
  .el-button {
    margin: 5px;
  }
  </style>
    