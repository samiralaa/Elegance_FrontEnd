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

    <!-- Children Products Section -->
    <div v-if="product.children && product.children.length > 0" class="children-products-section">
      <h2 class="section-title">{{ $t('related_products') }}</h2>
      <el-row :gutter="20">
        <el-col v-for="child in product.children" :key="child.id" :xs="24" :sm="12" :md="8" :lg="6">
          <div class="product-card" @click="navigateToProduct(child.id)">
            <div class="product-image">
              <img
                :src="child.images?.length ? getImageUrl(child.images[0].path) : placeholder"
                :alt="locale === 'ar' ? child.name_ar : child.name_en"
              />
              <div class="product-overlay">
                <div class="overlay-buttons">
                  <el-button class="overlay-btn" circle @click.stop="navigateToProduct(child.id)">
                    <el-icon><i class="el-icon-view"></i></el-icon>
                  </el-button>
                  <el-button 
                    class="overlay-btn" 
                    circle 
                    @click.stop="addChildToCart(child)"
                    :disabled="!child.is_available"
                  >
                    <el-icon><i class="el-icon-shopping-cart-2"></i></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="sale-badge" v-if="child.old_price">Sale</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ locale === 'ar' ? child.name_ar : child.name_en }}</h3>
              <div class="product-price">
                <span class="current-price">{{ child.price }} {{ child.currency?.name_en }}</span>
                <span class="old-price" v-if="child.old_price">{{ child.old_price }} {{ child.currency?.name_en }}</span>
              </div>
              <div class="product-meta">
                <el-tag :type="child.is_available ? 'success' : 'danger'" size="small">
                  {{ child.is_available ? $t('available') : $t('not_available') }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import Header from "@/components/Website/Header.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { ElNotification } from 'element-plus'
const { locale, t } = useI18n();
const direction = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));
const route = useRoute();
const router = useRouter();
const product = ref({});
const quantity = ref(1);

const placeholder = "/default-image.jpg";
const selectedImage = ref(null);

const fetchProduct = async () => {
  try {
    const res = await axios.get(
      `http://elegance_backend.test/api/website/show/products/${route.params.id}`
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
  return `http://elegance_backend.test/storage/${path}`;
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

    const response = await axios.post('http://elegance_backend.test/api/cart-items', payload, {
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

const navigateToProduct = (productId) => {
  router.push(`/products/${productId}`)
}

const addChildToCart = async (childProduct) => {
  try {
    const payload = {
      product_id: childProduct.id,
      quantity: 1,
      price: childProduct.price,
    };
    if (childProduct.amounts) {
      payload.amount_id = childProduct.amount_id;
    }

    const response = await axios.post('http://elegance_backend.test/api/cart-items', payload, {
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

.children-products-section {
  margin-top: 40px;
  padding: 20px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #a3852c;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-buttons {
  display: flex;
  gap: 10px;
}

.overlay-btn {
  background-color: #fff;
  color: #2c3e50;
  border: none;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.overlay-btn:hover {
  background-color: #a3852c;
  color: #fff;
  transform: translateY(-2px);
}

.overlay-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #a3852c;
}

.old-price {
  font-size: 14px;
  color: #95a5a6;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.sale-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
}

@media (max-width: 768px) {
  .children-products-section {
    padding: 10px;
  }

  .section-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .product-name {
    font-size: 14px;
    height: 40px;
  }

  .current-price {
    font-size: 16px;
  }

  .overlay-buttons {
    gap: 5px;
  }

  .overlay-btn {
    width: 35px;
    height: 35px;
  }
}
</style>