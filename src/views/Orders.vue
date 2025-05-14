<template>
  <div class="orders-page">
    <div class="orders-header">
      <h2>{{ $t('orders.myOrders') }}</h2>
      <el-input
        v-model="searchQuery"
        :placeholder="$t('orders.searchPlaceholder')"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="orders-filters">
      <el-select v-model="statusFilter" :placeholder="$t('orders.filterByStatus')">
        <el-option
          v-for="status in orderStatuses"
          :key="status"
          :label="status"
          :value="status"
        />
      </el-select>
    </div>

    <el-table
      v-loading="loading"
      :data="filteredOrders"
      style="width: 100%"
      class="orders-table"
    >
      <el-table-column prop="id" :label="$t('orders.orderId')" width="120" />
      <el-table-column prop="date" :label="$t('orders.orderDate')" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('orders.total')" width="150">
        <template #default="scope">
          {{ scope.row.total }} {{ scope.row.currency }}
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('orders.status')" width="120">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('orders.actions')" width="120">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="showOrderDetails(scope.row)"
          >
            {{ $t('orders.viewDetails') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="totalOrders > 0"
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalOrders"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
    />

    <el-dialog
      v-model="showDetails"
      :title="$t('orders.orderDetails')"
      width="80%"
      class="order-details-dialog"
    >
      <OrderDetails
        v-if="selectedOrder"
        :order="selectedOrder"
      />
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Search } from '@element-plus/icons-vue'
import OrderDetails from '@/components/Website/Orders/OrderDetails.vue'

export default defineComponent({
  name: 'OrdersView',
  components: {
    OrderDetails,
    Search
  },
  setup() {
    const store = useStore()
    const searchQuery = ref('')
    const statusFilter = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const showDetails = ref(false)

    const orderStatuses = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled']

    const fetchOrders = async () => {
      try {
        await store.dispatch('orders/fetchOrders')
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    const filteredOrders = computed(() => {
      let result = store.state.orders.orders

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(order =>
          order.id.toString().includes(query) ||
          order.total.toString().includes(query)
        )
      }

      if (statusFilter.value && statusFilter.value !== 'All') {
        result = result.filter(order => order.status === statusFilter.value)
      }

      return result
    })

    const totalOrders = computed(() => filteredOrders.value.length)

    const getStatusType = (status) => {
      const types = {
        'Completed': 'success',
        'Processing': 'warning',
        'Pending': 'info',
        'Cancelled': 'danger'
      }
      return types[status] || 'info'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    const showOrderDetails = async (order) => {
      try {
        await store.dispatch('orders/getOrderDetails', order.id)
        showDetails.value = true
      } catch (error) {
        console.error('Error fetching order details:', error)
      }
    }

    const handlePageChange = (page) => {
      currentPage.value = page
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      loading: computed(() => store.state.orders.loading),
      selectedOrder: computed(() => store.state.orders.selectedOrder),
      searchQuery,
      statusFilter,
      orderStatuses,
      currentPage,
      pageSize,
      showDetails,
      filteredOrders,
      totalOrders,
      getStatusType,
      formatDate,
      showOrderDetails,
      handlePageChange
    }
  }
})
</script>

<style scoped>
.orders-page {
  padding: 24px;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-input {
  width: 300px;
}

.orders-filters {
  margin-bottom: 24px;
}

.orders-table {
  margin-bottom: 24px;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.order-details-dialog :deep(.el-dialog__body) {
  padding: 0;
}
</style>