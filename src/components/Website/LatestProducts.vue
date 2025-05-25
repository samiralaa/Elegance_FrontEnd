<template>
  <div class="products-section">
    <div class="container">
      <div class="title mt-5">
        <fa class="fa-icon" :icon="['fas', 'shopping-basket']"></fa>
        <h2>{{ $t('LatestProducts.LatestProducts') }}</h2>
      </div>
      <div class="row justify-content-center align-items-center">
        <el-col
          v-for="product in products"
          :key="product.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="d-flex justify-content-center"
        >
          <div class="card">
            <div class="img-container">
              <router-link :to="`/read/products/${product.id}`">
                <img
                  v-if="product.images.length"
                  :src="getImageUrl(product.images[0].path)"
                  :alt="product.name_en"
                  class="card-img-top"
                />
              </router-link>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ product.name_en }}</h5>
              <div class="card-btns">
                <router-link :to="`/read/products/${product.id}`"  class="eye-btn btn">
                  <fa icon="eye" />
                </router-link>
                <button @click="addToCart(product)" class="cart-btn btn">
                  {{ $t('home.add-to-cart') }}
                </button>
                <button @click="addToFavorites(product)" class="love-btn btn">
                  <fa icon="heart" />
                </button>
              </div>
            </div>
          </div>
        </el-col>
      </div>
    </div>
  </div>

  <!-- Success Dialog -->
  <el-dialog
    v-model="showSuccessDialog"
    title="🎉 Success"
    width="30%"
    :before-close="() => (showSuccessDialog = false)"
    :center="true"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <span>{{ successMessage }}</span>
    <template #footer>
      <el-button type="primary" @click="showSuccessDialog = false">OK</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElNotification } from 'element-plus';

const products = ref([]);
const showSuccessDialog = ref(false);
const successMessage = ref('');

// Fetch products
const fetchLatestProducts = async () => {
  try {

    const response = await axios.get('http://127.0.0.1:8000/api/website/latest/products');

    if (response.data.status) {
      products.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching latest products:', error);
  }
};

// Get image URL
const getImageUrl = (path) => {

  return `http://127.0.0.1:8000/storage/${path}`;

};

// Add to favorites
const addToFavorites = async (product) => {
  try {
    const response = await axios.post(

      'http://127.0.0.1:8000/api/favorites',

      { product_id: product.id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (response.data.message) {
      product.isFavorited = !product.isFavorited;
      successMessage.value = response.data.message || 'Product added to favorites';
      showSuccessDialog.value = true;
      console.log(`Product "${product.name_en}" (ID: ${product.id}) added to favorites successfully.`);
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    if (error.response?.status === 401) {
      ElNotification({
        title: '⚠️ Unauthorized',
        message: 'Please login to add to favorites.',
        type: 'error',
      });
    } else {
      ElNotification({
        title: '❌ Error',
        message: error.response?.data?.message || 'Something went wrong.',
        type: 'error',
      });
    }
  }
};

// Add to cart
const addToCart = async (product) => {
  try {
    const payload = {
      product_id: product.id,
      quantity: 1,
      price: product.price,
    };

    if (product.amounts) {
      console.log('Amounts:', product.amounts);
      payload.amount_id = product.amount_id;
    }

    const response = await axios.post('http://127.0.0.1:8000/api/cart-items', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (response.data.message) {
      successMessage.value = response.data.message;
      showSuccessDialog.value = true;
    }
  } catch (error) {
    console.error('Cart error:', error);
    ElNotification({
      title: '❌',
      message: error.response?.data?.message || 'Login required to add to cart',
      type: 'error',
    });
  }
};

// Load products on component mount
onMounted(fetchLatestProducts);
</script>
<style scoped>
/* .latest-products {
  padding: 20px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
.product-card {
  transition: box-shadow 0.3s ease;
}
.image-wrapper {
  position: relative;
}
.image-wrapper{
  height: 220px !important;
  width: 220px !important;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
}
.product-info {
  text-align: center;
  margin-top: 10px;
}
.product-title {
  color: inherit;
  text-decoration: none;
}
.product-title:hover {
  color: #409EFF;
}
.category {
  font-size: 13px;
  color: #999;
}
.action-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.product-card:hover .action-icons {
  opacity: 1;
}
.action-icons > * {
  background-color: white;
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.2s;
}
.action-icons > *:hover {
  transform: scale(1.2);
} */

/* new */
  .title{
    margin-bottom: 15px;
    color: #8b6b3d;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .fa-icon{
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  .card{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    border: none;
    box-shadow: none !important;
    transition: all 0.2s ease-in;
    z-index: 1;
    width: 100%;
    max-width: 250px;
  }
  .img-container{
    display: flex;
    overflow: hidden;
    border-radius: 50%;
    position: relative;
    width: 100%;
    max-width: 220px;
    height: auto;
    aspect-ratio: 1/1;
  }
  .card:hover{
    color: #fff;
  }
  img{
    z-index: 0;
    transition: all 0.2s ease-in-out;

  }
  .card:hover img{
    scale: 1.1;
  }
  .card::after{
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    height: 105%;
    width: 105%;
    background-color: #8b6b3d;
    border-radius: 8px;
    transform: translate(-50%, -50%) scale(0);
    z-index: -1;
    transition: transform 0.3s ease;
  }
  .card:hover::after {
    transform: translate(-50%, -50%) scale(1);
  }
  .card-btns{
    display: flex;
    width: fit-content;
    z-index: 1;
    justify-content: center;
    margin:0;
    transition: all 0.5s ease-in-out;
    gap: 10px;
  }
  .love-btn,
  .eye-btn{
    background-color: #8b6b3d;
    color: #fff;
    transition: all 0.2s ease-in-out;
  }
  .cart-btn{
    background-color: #fff;
    transition: all 0.2s ease-in-out;
    
  }
  .cart-btn:hover{
    color: #333;
  }
  .cart-btn:hover,
  .love-btn:hover,
  .eye-btn:hover{
    scale: 1.1;
  }
  .card:hover .love-btn,
  .card:hover .eye-btn{
    background-color: #fff;
    color: #333;
  }
  .card-title{
    color: #8b6b3d;
    text-align: center;
    transition: all 0.2s ease-in;
  }
  .card:hover .card-title{
    color: #fff;
  }
</style>
