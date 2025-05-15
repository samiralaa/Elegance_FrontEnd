<template>
  <div class="orders-page">
    <!-- Header: Title & Search -->
    <div class="orders-header">
      <h2>My Orders</h2>
      <el-input
        v-model="searchQuery"
        placeholder="Search orders..."
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- Filter Dropdown -->
    <div class="orders-filters">
      <el-select v-model="statusFilter" placeholder="Filter by Status" clearable>
        <el-option
          v-for="status in orderStatuses"
          :key="status"
          :label="status"
          :value="status"
        />
      </el-select>
    </div>

    <!-- Orders Table -->
    <el-table
      :data="paginatedOrders"
      style="width: 100%"
      class="orders-table"
      stripe
      border
    >
      <el-table-column prop="id" label="Order ID" width="120" />
      <el-table-column prop="ordered_at" label="Order Date" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.ordered_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Total" width="150">
        <template #default="scope">
          {{ scope.row.total_price }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="150">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="220">
        <template #default="scope">
          <el-button size="small" type="primary" @click="viewOrder(scope.row)" circle>
            <el-icon><View /></el-icon>
          </el-button>
          <el-button size="small" type="danger" :disabled="scope.row.status !== 'pending' && scope.row.status !== 'processing'" @click="cancelOrder(scope.row)" circle>
            <el-icon><Close /></el-icon>
          </el-button>
          <el-button size="small" type="success" @click="reorder(scope.row)" circle>
            <el-icon><Refresh /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      v-if="filteredOrders.length > pageSize"
      class="pagination"
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="filteredOrders.length"
      @current-change="handlePageChange"
    />

    <!-- Order Details Dialog -->
    <el-dialog v-model="showDetails" title="Order Details" width="600px">
      <el-table
        v-if="selectedOrder"
        :data="selectedOrder.items"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="product_id" label="Product ID" />
        <el-table-column prop="quantity" label="Quantity" />
        <el-table-column prop="price" label="Price" />
        <el-table-column prop="subtotal" label="Subtotal" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, View, Close, Refresh } from '@element-plus/icons-vue'

// Sample orders
const orders = ref([
  {
    id: 29,
    user_id: 1,
    status: 'completed',
    total_price: '366.00',
    payment_method: 'stripe',
    ordered_at: '2025-05-15 06:55:02',
    items: [
      { id: 38, order_id: 29, product_id: 1, quantity: 1, price: '183.00', subtotal: '183.00' },
      { id: 39, order_id: 29, product_id: 1, quantity: 1, price: '183.00', subtotal: '183.00' }
    ]
  },
  {
    id: 30,
    user_id: 1,
    status: 'completed',
    total_price: '366.00',
    payment_method: 'stripe',
    ordered_at: '2025-05-15 06:56:26',
    items: [
      { id: 40, order_id: 30, product_id: 1, quantity: 1, price: '183.00', subtotal: '183.00' },
      { id: 41, order_id: 30, product_id: 1, quantity: 1, price: '183.00', subtotal: '183.00' }
    ]
  }
])

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 5
const showDetails = ref(false)
const selectedOrder = ref(null)

const orderStatuses = ['completed', 'pending', 'processing', 'cancelled']

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch =
      searchQuery.value === '' ||
      order.id.toString().includes(searchQuery.value.toLowerCase()) ||
      order.total_price.includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      !statusFilter.value || order.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredOrders.value.slice(start, end)
})

const handlePageChange = (page) => {
  currentPage.value = page
}

const viewOrder = (order) => {
  selectedOrder.value = order
  showDetails.value = true
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const getStatusType = (status) => {
  const types = {
    completed: 'success',
    pending: 'info',
    processing: 'warning',
    cancelled: 'danger'
  }
  return types[status.toLowerCase()] || 'info'
}

const cancelOrder = (order) => {
  // Simulate API call
  setTimeout(() => {
    order.status = 'cancelled'
  }, 500)
}

const reorder = (order) => {
  // Simulate reorder logic (e.g., add items to cart)
  alert('Reordered items from order #' + order.id)
}
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
  margin-bottom: 20px;
}

.orders-table {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
