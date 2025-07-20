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
            <span :class="['trend', salesOverview.month_over_month_growth >= 0 ? 'positive' : 'negative']">
              {{ salesOverview.month_over_month_growth >= 0 ? '+' : '' }}{{ salesOverview.month_over_month_growth }}%
            </span>
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
          <div class="sales-overview">
            <div class="sales-metrics">
              <div class="metric">
                <span class="label">Today's Sales</span>
                <span class="value">${{ parseFloat(salesOverview.today_sales || 0).toFixed(2) }}</span>
              </div>
              <div class="metric">
                <span class="label">This Month</span>
                <span class="value">${{ parseFloat(salesOverview.this_month_sales || 0).toFixed(2) }}</span>
              </div>
              <div class="metric">
                <span class="label">Last Month</span>
                <span class="value">${{ parseFloat(salesOverview.last_month_sales || 0).toFixed(2) }}</span>
              </div>
            </div>
            <div id="salesChart" class="chart-container"></div>
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
            <el-table-column label="Customer">
              <template #default="{ row }">
                {{ row.user.name }}
              </template>
            </el-table-column>
            <el-table-column prop="total_price" label="Total" width="120">
              <template #default="{ row }">
                {{ row.currency }}{{ row.total_price }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="Status" width="120">
              <template #default="{ row }">
                <el-tag :type="row.status === 'completed' ? 'success' : 'warning'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ordered_at" label="Order Date" width="180">
              <template #default="{ row }">
                {{ row.ordered_at }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const store = useStore()
    const totalRevenue = ref(0)
    const totalOrders = ref(0)
    const totalCustomers = ref(0)
    const totalProducts = ref(0)
    const orders = ref([])
    const salesOverview = ref({
      today_sales: 0,
      this_month_sales: 0,
      last_month_sales: 0,
      month_over_month_growth: 0,
      daily_sales: [],
      top_selling_products: []
    })
    let chartInstance = null

    const initChart = () => {
      const chartDom = document.getElementById('salesChart')
      if (chartDom) {
        chartInstance = echarts.init(chartDom)
        updateChart()
      }
    }

    const updateChart = () => {
      if (!chartInstance) return

      const dates = salesOverview.value.daily_sales.map(item => item.date)
      const sales = salesOverview.value.daily_sales.map(item => parseFloat(item.total_sales))
      const orders = salesOverview.value.daily_sales.map(item => item.total_orders)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Sales', 'Orders']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates
        },
        yAxis: [
          {
            type: 'value',
            name: 'Sales ($)',
            position: 'left'
          },
          {
            type: 'value',
            name: 'Orders',
            position: 'right'
          }
        ],
        series: [
          {
            name: 'Sales',
            type: 'line',
            smooth: true,
            data: sales,
            itemStyle: {
              color: '#409EFF'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(64,158,255,0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(64,158,255,0.1)'
                }
              ])
            }
          },
          {
            name: 'Orders',
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            data: orders,
            itemStyle: {
              color: '#67C23A'
            }
          }
        ]
      }

      chartInstance.setOption(option)
    }

    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }

    onMounted(() => {
      initChart()
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.dispose()
      }
      window.removeEventListener('resize', handleResize)
    })

    const fetchSalesOverview = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (!tokenData || !tokenData.token) {
          throw new Error('Authentication token not found')
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        const response = await axios.get('https://backend.webenia.org/api/dashboard/sales-overview')

        if (response.data.status === true) {
          salesOverview.value = response.data.data
          totalRevenue.value = parseFloat(response.data.data.this_month_sales || 0)
          updateChart()
        }
      } catch (error) {
        console.error('Error fetching sales overview:', error)
      }
    }

    const fetchTotalProducts = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (!tokenData || !tokenData.token) {
          throw new Error('Authentication token not found')
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        const response = await axios.get('https://backend.webenia.org/api/dashboard/total-products')

        if (response.data.status === true) {
          totalProducts.value = response.data.data.total_products
        }
      } catch (error) {
        console.error('Error fetching total products:', error)
      }
    }

    const fetchTotalOrders = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (!tokenData || !tokenData.token) {
          throw new Error('Authentication token not found')
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        const response = await axios.get('https://backend.webenia.org/api/dashboard/total-orders')

        if (response.data.status === true) {
          totalOrders.value = response.data.data.total_orders
        }
      } catch (error) {
        console.error('Error fetching total orders:', error)
      }
    }

    const fetchRecentOrders = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (!tokenData || !tokenData.token) {
          throw new Error('Authentication token not found')
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        const response = await axios.get('https://backend.webenia.org/api/dashboard/recent-orders')

        if (response.data.status === true) {
          orders.value = response.data.data
        }
      } catch (error) {
        console.error('Error fetching recent orders:', error)
      }
    }

    onMounted(async () => {
      try {
        await fetchTotalOrders()
        await store.dispatch('fetchCustomers')
        await fetchTotalProducts()
        await fetchRecentOrders()
        await fetchSalesOverview()

        // Update values after fetching data
        totalCustomers.value = store.getters.totalCustomers || 0
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    })

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      orders,
      salesOverview
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

.sales-overview {
  padding: 10px;
}

.sales-metrics {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.metric {
  text-align: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  flex: 1;
  margin: 0 5px;
}

.metric .label {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.metric .value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.chart-container {
  height: 400px;
  margin-top: 20px;
  width: 100%;
}
</style>