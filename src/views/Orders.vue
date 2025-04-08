<template>
  <div class="orders">
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
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleViewDetails(scope.row)">
            View Details
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleUpdateStatus(scope.row)"
            :disabled="scope.row.status === 'Completed'"
          >
            Update Status
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'OrdersView',
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch('fetchOrders')
    })

    const getStatusType = (status) => {
      const types = {
        'Completed': 'success',
        'Processing': 'warning',
        'Pending': 'info',
        'Cancelled': 'danger'
      }
      return types[status] || 'info'
    }

    const handleViewDetails = (order) => {
      console.log('Viewing details for order:', order.id)
      // TODO: Implement view order details functionality
    }

    const handleUpdateStatus = (order) => {
      console.log('Updating status for order:', order.id)
      // TODO: Implement update order status functionality
    }

    return {
      orders: computed(() => store.state.orders),
      getStatusType,
      handleViewDetails,
      handleUpdateStatus
    }
  }
})
</script>

<style scoped>
.orders {
  padding: 20px;
}
</style> 