<template>
  <Header />
  <section class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
        <div class="mt-4 flex gap-4">
          <button 
            v-for="status in ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled']" 
            :key="status"
            class="px-4 py-2 text-sm font-medium rounded-full"
            :class="selectedStatus === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
            @click="filterOrders(status)"
          >
            {{ status }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
        <p class="text-gray-500">Try adjusting your filters or check back later for new orders.</p>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <!-- Order Header -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Order #</span>
                  <span class="text-sm font-semibold text-gray-900">{{ order.id }}</span>
                </div>
                <div class="text-sm text-gray-500">
                  Placed on {{ formatDate(order.ordered_at) }}
                </div>
              </div>
              <div class="text-right">
                <span :class="statusClass(order.status)" class="text-sm font-medium px-3 py-1 rounded-full">
                  {{ order.status }}
                </span>
                <div class="mt-2 text-lg font-bold text-gray-900">${{ order.total_price }}</div>
              </div>
            </div>
          </div>

          <!-- Order Timeline -->
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Order Confirmed</div>
                  <div class="text-xs text-gray-500">{{ formatDate(order.ordered_at) }}</div>
                </div>
              </div>
              <div class="flex-1 mx-4 h-0.5 bg-gray-200"></div>
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Processing</div>
                  <div class="text-xs text-gray-500">Estimated delivery: {{ getEstimatedDelivery(order.ordered_at) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div class="relative w-20 h-20 flex-shrink-0">
                  <img
                    :src="`${API_URL}/${item.product.images[0].path}`"
                    :alt="item.product.name_en"
                    class="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <div class="absolute -top-2 -right-2 bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">
                    x{{ item.quantity }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-gray-900 truncate">{{ item.product.name_en }}</h3>
                  <div class="mt-1 space-y-1">
                    <p class="text-sm text-gray-500">Unit Price: ${{ item.price }}</p>
                    <p class="text-sm font-medium text-gray-900">Subtotal: ${{ item.subtotal }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Footer -->
            <div class="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
              <div class="text-sm text-gray-500">
                Payment Method: <span class="font-medium text-gray-900">{{ order.payment_method }}</span>
              </div>
              <div class="flex gap-3">
                <button
                  @click="trackOrder(order.id)"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  Track Order
                </button>
                <button
                  @click="viewOrderDetails(order.id)"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { API_URL } from '@/store/index.js';
import axios from 'axios';
import Header from "@/components/Website/Header.vue";

export default {
  name: 'Order',
  components: { Header },
  data() {
    return {
      orders: [],
      API_URL,
      selectedStatus: 'All'
    };
  },
  computed: {
    filteredOrders() {
      if (this.selectedStatus === 'All') return this.orders;
      return this.orders.filter(order => 
        order.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get(`${API_URL}/api/orders/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.orders = response.data.original.orders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.$toast?.error?.(this.$t?.('order.errorFetchingOrders') || "Failed to fetch orders.");
      }
    },
    statusClass(status) {
      const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
      switch (status.toLowerCase()) {
        case 'completed':
          return `${base} bg-green-100 text-green-800`;
        case 'pending':
          return `${base} bg-yellow-100 text-yellow-800`;
        case 'cancelled':
          return `${base} bg-red-100 text-red-800`;
        default:
          return `${base} bg-gray-100 text-gray-800`;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getEstimatedDelivery(orderDate) {
      const date = new Date(orderDate);
      date.setDate(date.getDate() + 3); // Assuming 3 days delivery time
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    },
    filterOrders(status) {
      this.selectedStatus = status;
    },
    trackOrder(orderId) {
      // Implement order tracking logic
      console.log('Tracking order:', orderId);
    },
    viewOrderDetails(orderId) {
      // Implement order details view logic
      console.log('Viewing order details for:', orderId);
    }
  }
};
</script>

<style scoped>
/* Smooth transitions */
.transition-shadow {
  transition: box-shadow 0.3s ease-in-out;
}

/* Image hover effect */
img {
  width:200px;
  transition: transform 0.2s ease-in-out;
}

.group:hover img {
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .order-item {
    flex-direction: column;
  }
}
</style>
