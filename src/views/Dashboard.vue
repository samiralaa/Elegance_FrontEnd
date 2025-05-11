<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="summary-card">
          <template #header>
            <div class="card-header">
              <span>Total Revenue</span>
            </div>
          </template>
          <div class="card-content">
            <h2>${{ totalRevenue.toFixed(2) }}</h2>
            <span class="trend positive">+12%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="summary-card">
          <template #header>
            <div class="card-header">
              <span>Total Orders</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ totalOrders }}</h2>
            <span class="trend positive">+8%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="summary-card">
          <template #header>
            <div class="card-header">
              <span>Total Customers</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ totalCustomers }}</h2>
            <span class="trend positive">+5%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="summary-card">
          <template #header>
            <div class="card-header">
              <span>Total Products</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ totalProducts }}</h2>
            <span class="trend positive">+3%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Sales Overview</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- Chart will be implemented here -->
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Recent Orders</span>
            </div>
          </template>
          <el-table :data="orders" style="width: 100%">
            <el-table-column prop="id" label="Order ID" width="100" />
            <el-table-column prop="customer" label="Customer" />
            <el-table-column prop="total" label="Total" width="120">
              <template #default="scope">
                ${{ scope.row.total.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="Status" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'Completed' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch('fetchOrders')
      store.dispatch('fetchCustomers')
      store.dispatch('fetchProducts')
    })

    return {
      totalRevenue: computed(() => store.getters.totalRevenue),
      totalOrders: computed(() => store.getters.totalOrders),
      totalCustomers: computed(() => store.getters.totalCustomers),
      totalProducts: computed(() => store.getters.totalProducts),
      orders: computed(() => store.state.orders)
    }
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.summary-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
}

.card-content h2 {
  margin: 10px 0;
  font-size: 24px;
}

.trend {
  font-size: 14px;
}

.trend.positive {
  color: #67C23A;
}

.trend.negative {
  color: #F56C6C;
}

.chart-row {
  margin-top: 20px;
}

.chart-container {
  height: 300px;
}
</style>