<template>
 <Header />
  <div class="container py-4">
    <h2 class="mb-4">My Orders</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="orders.length > 0">
      <div
        v-for="order in orders"
        :key="order.id"
        class="card mb-4 shadow-sm border-0"
      >
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">Order #{{ order.id }} - {{ order.status }}</h5>
        </div>
        <div class="card-body">
          <p><strong>Total Price:</strong> {{ order.total_price }} EGP</p>
          <p><strong>Payment Method:</strong> {{ order.payment_method }}</p>
          <p><strong>Ordered At:</strong> {{ formatDate(order.ordered_at) }}</p>

          <hr />

          <h6>Items:</h6>
          <div
            v-for="item in order.items"
            :key="item.id"
            class="d-flex align-items-center mb-3 border-bottom pb-3"
          >
            <img
              v-if="item.product.images.length > 0"
              :src="imageUrl(item.product.images[0].path)"
              alt="product image"
              class="me-3 rounded"
              style="width: 80px; height: 80px; object-fit: cover"
            />
            <div>
              <h6 class="mb-1">{{ item.product.name_en }}</h6>
              <p class="mb-0 text-muted">
                Quantity: {{ item.quantity }} | Price: {{ item.price }} EGP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info">
      No orders found.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from "@/components/Website/Header.vue";

export default {
   components: {
    Header,
  },
  name: 'UserOrder',
  data() {
    return {
      loading: true,
      orders: [],
    };
  },
  methods: {
    async fetchOrders() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          this.$toast.error('Please login to view your orders');
          this.$router.push('/login');
          return;
        }

        const res = await axios.get('http://127.0.0.1:8000/api/orders/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.data.status && res.data.data.original.success) {
          this.orders = res.data.data.original.orders;
        } else {
          this.$toast.error(res.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        if (err.response?.status === 401) {
          this.$toast.error('Please login to view your orders');
          this.$router.push('/login');
        } else {
          this.$toast.error(err.response?.data?.message || 'Failed to fetch orders');
        }
      } finally {
        this.loading = false;
      }
    },
    imageUrl(path) {
      return `http://127.0.0.1:8000/storage/${path}`;
    },
    formatDate(datetime) {
      return new Date(datetime).toLocaleString();
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.card-header {
  font-weight: bold;
}
</style>
