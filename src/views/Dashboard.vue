<template>
  <div class="dashboard">
    <!-- Responsive summary cards using Bootstrap -->
    <!-- Change row behavior -->
<div class="row g-3 mb-4 justify-content-center">
  <div
    class="col-12 col-sm-1 col-md-6 col-lg-3 d-flex justify-content-center"
    v-for="(card, idx) in summaryCards"
    :key="idx"
  >
    <el-card class="summary-card text-center w-100" style="min-width: 160px; max-width: 180px; padding: 10px;">
      <template #header>
        <div class="card-header w-100 small fw-semibold text-truncate">
          {{ card.title }}
        </div>
      </template>
      <div class="card-content">
        <h5 class="mb-2">{{ card.value }}</h5>
        <span :class="['trend', card.trendClass]">
          {{ card.trendPrefix }}{{ card.trendValue }}
        </span>
      </div>
    </el-card>
  </div>
</div>



    <el-row :gutter="20" class="chart-row d-flex flex-column flex-md-row justify-content-center align-items-center">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header card flex-fill w-100 h-100">
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

    // Add summaryCards computed for Bootstrap rendering
    const summaryCards = computed(() => [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.value.toFixed(2)}`,
        trendClass: salesOverview.value.month_over_month_growth >= 0 ? 'positive' : 'negative',
        trendPrefix: salesOverview.value.month_over_month_growth >= 0 ? '+' : '',
        trendValue: `${salesOverview.value.month_over_month_growth}%`,
      },
      {
        title: 'Total Orders',
        value: totalOrders.value,
        trendClass: 'positive',
        trendPrefix: '+',
        trendValue: '8%',
      },
      {
        title: 'Total Customers',
        value: totalCustomers.value,
        trendClass: 'positive',
        trendPrefix: '+',
        trendValue: '5%',
      },
      {
        title: 'Total Products',
        value: totalProducts.value,
        trendClass: 'positive',
        trendPrefix: '+',
        trendValue: '3%',
      },
    ])

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      orders,
      salesOverview,
      summaryCards,
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

.summary-card {
  font-size: 0.875rem; /* smaller text */
  padding: 0.5rem;
}

.card-header {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content h5 {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
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