<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
  <Header />

  <div class="product-show" :dir="direction">
    <el-row :gutter="20" class="product-container full-height-row flex-md-row flex-column-reverse">
      <el-col  :xs="24" :sm="24" :md="12"  :lg="14">
        <div class="product-details">
          <h1 class="product-title">{{ locale === 'ar' ? product.name_ar : product.name_en }}</h1>

          <div class="price-block">
            <span class="price-new">{{ product.price }} {{ product.currency?.name_en }}</span>
            <span class="price-old" v-if="product.old_price">{{ product.old_price }} {{ product.currency?.name_en }}</span>
          </div>

          <div class="description" v-html="locale === 'ar' ? product.description_ar : product.description_en"></div>

          <div class="quantity-section">
            <div class="quantity-control">
              <label>{{ $t('quantity') }}:</label>
              <el-button size="small" @click="decreaseQty">-</el-button>
              <span class="qty-number">{{ quantity }}</span>
              <el-button size="small" @click="increaseQty">+</el-button>
            </div>
          </div>

          <div class="buttons-section">
            <el-button class="add-to-cart" type="primary" size="large" round @click="addToCart"
              >{{ $t('add_to_cart') }}</el-button
            >
            <el-button class="favorite-btn" circle size="large">
              <el-icon><i class="el-icon-heart"></i></el-icon>
            </el-button>
          </div>
        </div>
      </el-col>

      <el-col   :xs="24" :sm="24"  :md="12"  :lg="10"  class="image-col">
        <div class="image-wrapper">
          <img
            :src="
              selectedImage
                ? getImageUrl(selectedImage)
                : product.images?.length
                ? getImageUrl(product.images[0].path)
                : placeholder
            "
            class="main-image"
          />
          <div class="sale-badge" v-if="product.old_price">Sale</div>
        </div>

        <div class="thumbs" v-if="product.images?.length > 1">
          <img
            v-for="img in product.images"
            :key="img.id"
            :src="getImageUrl(img.path)"
            class="thumb"
            :class="{ active: selectedImage === img.path }"
            @click="setSelectedImage(img.path)"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Header from "@/components/Website/Header.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { ElNotification } from 'element-plus'
const { locale, t } = useI18n();
const direction = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));
const route = useRoute();
const product = ref({});
const quantity = ref(1);

const placeholder = "/default-image.jpg";
const selectedImage = ref(null);

const fetchProduct = async () => {
  try {
    const res = await axios.get(

      `http://127.0.0.1:8000/api/website/show/products/${route.params.id}`

    );
    if (res.data.status) {
      product.value = res.data.data;
      if (product.value.images?.length) {
        selectedImage.value = product.value.images[0].path;
      }
    }
  } catch (err) {
    // Handle error silently
  }
};

const getImageUrl = (path) => {

  return `http://127.0.0.1:8000/storage/${path}`;

};

const increaseQty = () => {
  quantity.value++;
};

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};

const setSelectedImage = (path) => {
  selectedImage.value = path;
};

onMounted(fetchProduct);
const addToCart = async () => {
  try {
    const payload = {
      product_id: product.value.id,
      quantity: quantity.value,
      price: product.value.price,
    };
    if (product.value.amounts) {
      payload.amount_id = product.value.amount_id;
    }

    const response = await axios.post('http://127.0.0.1:8000/api/cart-items', payload, {

      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    if (response.data.message) {
      ElNotification({
        title: t('success'),
        message: response.data.message,
        type: 'success',
      });
    }
  } catch (error) {
    ElNotification({
      title: '❌',
      message: error.response?.data?.message || t('add_to_cart_error') || 'Login required to add to cart',
      type: 'error',
    });
  }
};
</script>

<style scoped>
.product-show {
  padding: 40px;
  font-family: "Tajawal", sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.product-container {
  background-color: transparent;
  margin: 0 auto;
  max-width: 1400px;
}

.product-details {
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 25px;
  line-height: 1.3;
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin-bottom: 20px;
}

.price-new {
  font-size: 28px;
  color: #a3852c;
  font-weight: 700;
}

.price-old {
  font-size: 20px;
  color: #95a5a6;
  text-decoration: line-through;
  font-weight: 500;
}

.description {
  color: #34495e;
  font-size: 16px;
  line-height: 1.8;
  margin: 25px 0;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.quantity-section {
  margin: 20px 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 10px;
  width: fit-content;
}

.quantity-control label {
  font-weight: 500;
  color: #2c3e50;
}

.quantity-control button {
  background-color: #fff;
  border: 1px solid #ddd;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quantity-control button:hover {
  background-color: #a3852c;
  color: #fff;
  border-color: #a3852c;
}

.qty-number {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  min-width: 30px;
  text-align: center;
}

.buttons-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
}

.add-to-cart {
  background-color: #a3852c;
  border: none;
  color: white;
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  transition: all 0.3s ease;
}

.add-to-cart:hover {
  background-color: #8b7024;
  transform: translateY(-2px);
}

.favorite-btn {
  width: 48px;
  height: 48px;
  background-color: #fff;
  border: 2px solid #eee;
  color: #a3852c;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  background-color: #fff5e6;
  border-color: #a3852c;
  transform: translateY(-2px);
}

.image-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
  aspect-ratio: 1;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.image-wrapper:hover .main-image {
  transform: scale(1.1);
}

.sale-badge {
  position: absolute;
  top: 20px;
  inset-inline-start: 20px;
  background-color: #e74c3c;
  color: white;
  padding: 8px 15px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(231, 76, 60, 0.3);
  z-index: 1;
}

.thumbs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 10px;
}

.thumb {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;
  padding: 3px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.thumb:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.thumb.active {
  border-color: #a3852c;
  box-shadow: 0 4px 15px rgba(163, 133, 44, 0.2);
}

@media (max-width: 768px) {
  .product-show {
    padding: 20px;
  }

  .product-details {
    padding: 20px;
    margin-top: 20px;
  }

  .product-title {
    font-size: 24px;
  }

  .price-new {
    font-size: 24px;
  }

  .buttons-section {
    flex-direction: column;
  }

  .favorite-btn {
    width: 100%;
  }
}
</style>