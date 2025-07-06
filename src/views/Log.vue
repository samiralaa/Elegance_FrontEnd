<template>
    <div class="logs-container">
        <div class="header">
            <h2>{{ $t('Logs.Logs') }}</h2>
        </div>

        <el-card class="logs-table">
            <el-table v-loading="loading" :data="logs" style="width: 100%">
                <el-table-column prop="user.name" :label="$t('Logs.User')" />
                <el-table-column prop="operation" :label="$t('Logs.Operation')" />
                <el-table-column prop="model_type" :label="$t('Logs.Model')" />
                <el-table-column prop="model_id" :label="$t('Logs.ModelID')" />
                <el-table-column prop="description" :label="$t('Logs.Description')" />
                <el-table-column prop="ip_address" :label="$t('Logs.IPAddress')" />
                <el-table-column prop="user_agent" :label="$t('Logs.BrowserInfo')" />
                <el-table-column prop="created_at" :label="$t('Logs.Timestamp')" />
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const logs = ref([])
const loading = ref(false)

const BASE_URL = 'https://backend.webenia.org'
const API_URL = `${BASE_URL}/api/logs`

const fetchLogs = async () => {
  loading.value = true
  try {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'))
    if (!tokenData || !tokenData.token) throw new Error('Authentication token not found')

    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

    const res = await axios.get(API_URL)

    if (res.data.status === 'success' || res.data.status === true) {
      logs.value = res.data.data
    } else {
      throw new Error(res.data.message || 'Failed to fetch logs')
    }
  } catch (err) {
    console.error('Log Fetch Error:', err)
    ElMessage.error(err.message || 'Error fetching logs')
  } finally {
    loading.value = false
  }
}


onMounted(() => {
    fetchLogs()
})
</script>

<style scoped>
.logs-container {
    padding: 24px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
}

.logs-table {
    background-color: #ffffff;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow-x: auto;
}
</style>