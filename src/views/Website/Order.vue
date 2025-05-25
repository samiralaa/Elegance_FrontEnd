<template>
  <Header />

  <div class="container py-4">
    <h2 class="mb-4 fw-bold">My Orders</h2>

    <div class="orders-header">
      <a class="order-stage" href="#">
        <h3>In Progress</h3>
        <h3 class="num">4</h3>
      </a>
      <a class="order-stage" href="#">
        <h3>On Shipping</h3>
        <h3 class="num">4</h3>
      </a>
      <a class="order-stage" href="#">
        <h3>Delivered</h3>
        <h3 class="num">2</h3>
      </a>
      <a class="order-stage" href="#">
        <h3>Cancelled</h3>
        <h3 class="num">1</h3>
      </a>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="orders.length > 0" class="row g-4">
      <div 
        v-for="order in orders"
        :key="order.id"
        class="col-12 col-md-6"
      >
        <div class="order-card p-4 rounded-4 shadow-sm bg-white">
          <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
            <div>
              <small class="text-muted">Order ID</small>
              <h5 class="fw-bold">#{{ order.id }}</h5>
            </div>
            <div class="text-end">
              <small class="text-muted">{{ formatDate(order.ordered_at) }}</small><br>
              <small class="text-muted">Estimated arrival:</small><br />
              <span class="badge bg-primary">In Progress</span>
              <span class="badge bg-info">On Deliver</span>
              <span class="badge bg-success">Completed</span>
              <span class="badge bg-danger">Canceled</span>
            </div>
          </div>

          <div class="items row gy-3 overflow-auto mb-3 pb-2 border-bottom">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="d-flex flex-column align-items-start col-4"
            >
              <img
                :src="imageUrl(item.product.images[0].path)"
                class="rounded mb-2"
                style="width: 100%; aspect-ratio: 1; object-fit: cover"
              />
              <strong class="small">{{ item.product.name_en }}</strong>
              <small class="text-muted">{{ item.price }} EGP x{{ item.quantity }}</small>
              <small class="text-muted">Size: {{ item.size || '-' }}</small>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center">
            <strong>Total: {{ order.total_price }} EGP ({{ order.items.length }} Items)</strong>
            <button class="btn btn-outline-dark btn-sm">Details</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info text-center">
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
.items {
  max-height: 270px;
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
}

.num {
  background-color: #fff;
  aspect-ratio: 1 / 1;
  padding: 0.15rem 0.3rem;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%;
  transition: all 0.3s ease;
  font-size: 0.8rem !important;
}

.order-stage:active{
  background-color: #fff;
}
.order-stage:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #8b6b3d;
}

.order-stage:active .num {
  color: #fff;
  background-color: #8b6b3d;
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

</style>
