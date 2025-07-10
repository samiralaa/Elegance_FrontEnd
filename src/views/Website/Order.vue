<template>
  <Header />

  <div class="container py-4">
    <h2 class="mb-4 fw-bold">{{ $t('orders.myOrders') }}</h2>

    <div class="orders-header">
      <a class="order-stage" href="#" @click.prevent="filterOrders(null)" :class="{ active: !currentFilter }">
        <h3>{{ $t('orders.allOrders') }}</h3>
        <h3 class="num">{{ allOrdersCount }}</h3>
      </a>
      <a class="order-stage" href="#" @click.prevent="filterOrders('pending')"
        :class="{ active: currentFilter === 'pending' }">
        <h3>{{ $t('orders.inProgress') }}</h3>
        <h3 class="num">{{ pendingOrdersCount }}</h3>
      </a>
      <a class="order-stage" href="#" @click.prevent="filterOrders('completed')"
        :class="{ active: currentFilter === 'completed' }">
        <h3>{{ $t('orders.completed') }}</h3>
        <h3 class="num">{{ completedOrdersCount }}</h3>
      </a>
      <a class="order-stage" href="#" @click.prevent="filterOrders('cancelled')"
        :class="{ active: currentFilter === 'cancelled' }">
        <h3>{{ $t('orders.cancelled') }}</h3>
        <h3 class="num">{{ cancelledOrdersCount }}</h3>
      </a>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="filteredOrders.length > 0" class="row g-4">
      <div v-for="order in filteredOrders" :key="order.id" class="col-12 col-md-6">
        <div class="order-card p-4 rounded-4 shadow-sm bg-white">
          <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
            <div>
              <small class="text-muted">{{ $t('orders.orderId') }}</small>
              <h5 class="fw-bold">#{{ order.id }}</h5>
            </div>
            <div class="text-end">
              <small class="text-muted">{{ formatDate(order.ordered_at) }}</small><br>
              <span :class="['badge', getStatusBadgeClass(order.status)]">
                {{ formatStatus(order.status) }}
              </span>
            </div>
          </div>

          <div class="items row gy-3 overflow-auto mb-3 pb-2 border-bottom">
            <div v-for="item in order.items" :key="item.id" class="d-flex flex-column align-items-start col-4">
              <img v-if="item.product && item.product.images && item.product.images.length"
                :src="imageUrl(item.product.images[0].path)" class="rounded mb-2"
                style="width: 100%; aspect-ratio: 1; object-fit: cover" />
              <img v-else src="https://via.placeholder.com/150" class="rounded mb-2"
                style="width: 100%; aspect-ratio: 1; object-fit: cover" alt="No Image Available" />
              <strong class="small">{{ item.product && item.product.name_en ? item.product.name_en : 'No Name'
                }}</strong>
              <small class="text-muted">{{ item.price }} {{ selectedCurrency }} x{{ item.quantity }}</small>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center">
            <strong>Total: {{ order.total_price }} {{ selectedCurrency }} ({{ order.items.length }} Items)</strong>
            <button class="btn btn-outline-dark btn-sm" @click="showOrderDetailsPopup(order.id)">Details</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info text-center">
      No orders found.
    </div>
  </div>

  <div class="modal-overlay d-flex justify-content-center align-items-center" v-if="isDialogVisible">
    <div class="cart-modal bg-white rounded-4 shadow p-4 position-relative">
      <!-- Close Button -->
      <button type="button" class="btn-close position-absolute top-0 end-0 m-3" @click="isDialogVisible = false"
        aria-label="Close"></button>

      <!-- Title -->
      <h4 class="mb-3">{{ $t('order.orderDetails') }}</h4>

      <!-- Loading Spinner -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>

      <!-- Order content -->
      <div v-else class="cart-content">
        <!-- Order Info -->
        <div class="mb-3">
          <strong>Status:</strong>
          <span :class="['badge', getStatusBadgeClass(selectedOrder.status)]">
            {{ formatStatus(selectedOrder.status) }}
          </span>
        </div>
        <div class="mb-3" v-if="selectedOrder.address">
          <strong>Address:</strong>
          <div v-if="typeof selectedOrder.address === 'object'">
            <div v-if="selectedOrder.address.street">{{ selectedOrder.address.street }}</div>
            <div v-if="selectedOrder.address.city">{{ selectedOrder.address.city }}</div>
            <div v-if="selectedOrder.address.state">{{ selectedOrder.address.state }}</div>
            <div v-if="selectedOrder.address.country">{{ selectedOrder.address.country }}</div>
            <div v-if="selectedOrder.address.zip">{{ selectedOrder.address.zip }}</div>
            <!-- Add more fields as needed -->
          </div>
          <div v-else>
            {{ selectedOrder.address }}
          </div>
        </div>
        <!-- Items List -->
        <div class="items row gy-3 overflow-auto mb-3 pb-2 border-bottom">
          <div v-for="item in selectedOrder.items" :key="item.id" class="d-flex flex-column align-items-start col-4">
            <img v-if="item.product && item.product.images && item.product.images.length"
              :src="imageUrl(item.product.images[0].path)" class="rounded mb-2"
              style="width: 100%; aspect-ratio: 1; object-fit: cover" />
            <img v-else src="https://via.placeholder.com/150" class="rounded mb-2"
              style="width: 100%; aspect-ratio: 1; object-fit: cover" alt="No Image Available" />
            <strong class="small">{{ item.product && item.product.name_en ? item.product.name_en : 'No Name' }}</strong>
            <small class="text-muted">{{ item.price }} {{ selectedCurrency }} x{{ item.quantity }}</small>
            <small class="text-muted">{{ $t('orders.size') }}: {{ item.size || '-' }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios, { all } from 'axios';
import Header from "@/components/Website/Header.vue";

export default {
  components: {
    Header,
  },
  name: 'UserOrder',
  data() {
    return {
      orders: [],
      currentFilter: null,
      selectedOrder: null,
      isDialogVisible: false,
      loading: true,
      selectedCurrency: localStorage.getItem('selectedCurrency')
        ? JSON.parse(localStorage.getItem('selectedCurrency')).code
        : 'EGP',
      
    };
  },
  computed: {
    allOrdersCount() {
      return this.orders.length;
    },
    pendingOrdersCount() {
      return this.orders.filter(order => order.status === 'pending').length;
    },
    completedOrdersCount() {
      return this.orders.filter(order =>
        order.status === 'completed' || order.status === 'completed'
      ).length;
    },
    cancelledOrdersCount() {
      return this.orders.filter(order => order.status === 'cancelled').length;
    },
    filteredOrders() {
      if (!this.currentFilter) {
        return this.orders;
      }
      return this.orders.filter(order => {
        if (this.currentFilter === 'completed') {
          return order.status === 'completed';
        }
        return order.status === this.currentFilter;
      });
    },
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

        const res = await axios.get('https://backend.webenia.org/api/orders/user', {
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
    filterOrders(status) {
      this.currentFilter = this.currentFilter === status ? null : status;
    },
    imageUrl(path) {
      return `https://backend.webenia.org/public/storage/${path}`;
    },
    formatDate(datetime) {
      const date = new Date(datetime);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },
    formatStatus(status) {
      const statusMap = {
        'pending': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      };
      return statusMap[status.toLowerCase()] || status;
    },
  async showOrderDetailsPopup(orderId) {
    this.isDialogVisible = true;
    this.loading = true;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.get(`https://backend.webenia.org/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.data.status && res.data.data.original.success) {
        // ✅ fix here
        this.selectedOrder = res.data.data.original.orders[0];
      } else {
        this.$toast.error(res.data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      this.$toast.error(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      this.loading = false;
    }
  },


    getStatusBadgeClass(status) {
      const statusClasses = {
        'pending': 'bg-warning',
        'completed': 'bg-success',
        'cancelled': 'bg-danger'
      };
      return statusClasses[status.toLowerCase()] || 'bg-secondary';
    },
    updateCurrency() {
      const stored = localStorage.getItem('selectedCurrency');
      this.selectedCurrency = stored ? JSON.parse(stored).code : 'EGP';
    }
  },
  mounted() {
    this.fetchOrders();
    window.addEventListener('currency-changed', this.updateCurrency);
  },
  beforeUnmount() {
    window.removeEventListener('currency-changed', this.updateCurrency);
  },
};
</script>

<style scoped>
.items {
  height: 100%;
  overflow-y: auto;
}

.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.card-body ul {
  padding-left: 0;
  margin-bottom: 1rem;
}

.card-body ul li {
  margin-bottom: 0.25rem;
}

.order-card {
  border: 1px solid #eee;
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.order-card img {
  border: 1px solid #ddd;
}


.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #f6f6f6;
  border-radius: 50px;
  padding: 10px;
  text-align: center;
  gap: 10px;
}

.order-stage {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #333;
  border-radius: 50px;
  width: 100%;
  padding: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.order-stage.active {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #8b6b3d;
}

.order-stage.active .num {
  color: #fff;
  background-color: #8b6b3d;
}

.num {
  background-color: #fff;
  aspect-ratio: 1 / 1;
  padding: 0.15rem 0.5rem;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%;
  transition: all 0.3s ease;
  font-size: 0.8rem !important;
}

.orders-header h3 {
  margin: 0;
  font-size: 1rem !important;
}

.order-card {
  border: 1px solid #eee;
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.badge {
  font-size: 0.8rem;
  padding: 0.5em 0.8em;
  font-weight: 500;
  text-transform: capitalize;
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1050;
  backdrop-filter: blur(2px);
  padding: 1rem;
}

.cart-modal {
  max-width: 80%;
  height: 90vh;
  overflow: hidden;
  animation: fadeInUp 0.3s ease-in-out;
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.cart-content {
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.cart-content::-webkit-scrollbar {
  width: 6px;
}

.cart-content::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}
</style>
