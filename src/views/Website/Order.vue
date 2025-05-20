<template>
  <Header />
  <section class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">🛒 Your Orders</h2>

    <div v-if="orders.length === 0" class="text-center text-gray-500 text-lg">
      No orders found.
    </div>

    <div
      v-for="order in orders"
      :key="order.id"
      class="mb-10 border border-gray-200 rounded-2xl bg-white shadow-md transition-all hover:shadow-lg"
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 flex flex-wrap justify-between gap-4">
        <div class="space-y-1 text-gray-700">
          <p><span class="font-semibold">Order ID:</span> {{ order.id }}</p>
          <p>
            <span class="font-semibold">Status:</span>
            <span :class="statusClass(order.status)">
              {{ order.status }}
            </span>
          </p>
          <p><span class="font-semibold">Total:</span> ${{ order.total_price }}</p>
          <p><span class="font-semibold">Payment:</span> {{ order.payment_method }}</p>
        </div>
        <div class="text-sm text-gray-500 flex items-center">
          Ordered at: {{ order.ordered_at }}
        </div>
      </div>

      <!-- Items -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-sm transition"
        >
          <img
            :src="`${API_URL}/${item.product.images[0].path}`"
            alt="Product Image"
            class="w-20 h-20 object-cover rounded-lg border border-gray-300"
          />
          <div class="flex-1 space-y-1">
            <p class="font-semibold text-gray-800 text-lg">{{ item.product.name_en }}</p>
            <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
            <p class="text-sm text-gray-600">Unit Price: ${{ item.price }}</p>
            <p class="text-sm font-medium text-gray-700">Subtotal: ${{ item.subtotal }}</p>
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
      API_URL
    };
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
      const base = 'text-sm font-semibold px-2 py-1 rounded';
      switch (status.toLowerCase()) {
        case 'completed':
          return `${base} bg-green-100 text-green-700`;
        case 'pending':
          return `${base} bg-yellow-100 text-yellow-700`;
        case 'cancelled':
          return `${base} bg-red-100 text-red-700`;
        default:
          return `${base} bg-gray-100 text-gray-700`;
      }
    }
  }
};
</script>
<style scoped>
/* Optional: Smooth transitions */
img {
  transition: transform 0.2s ease-in-out;
  width: 300px;
}
img:hover {
  transform: scale(1.03);
}

/* Optional: Better responsive layout for small screens */
@media (max-width: 640px) {
  .order-item {
    flex-direction: column;
    align-items: center;
  }
}
</style>
