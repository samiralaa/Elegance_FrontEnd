<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
  <Header />

  <div class="product-show" :dir="direction">
    <div class="container">
      <el-row :gutter="20" class="product-container full-height-row flex-md-row flex-column-reverse">
        <el-col  :xs="24" :sm="24" :md="12"  :lg="14">
          <div class="product-details">
            <h1 class="product-title">{{ locale === 'ar' ? product.name_ar : product.name_en }}</h1>
            <div v-html="locale === 'ar' ? product.description_ar : product.description_en" class="description"></div>

            <div class="price-block">
              <span class="price-old" v-if="product.old_price">{{ product.old_price }} {{ product.currency?.name_en }}</span>
              <span class="price-new">{{ product.price }} {{ product.currency?.name_en }}</span>
            </div>
            
            <div class="weight" v-if="product.amounts && product.amounts.length > 0">
              <h1 class="weight-title">Select Weight</h1>
              <div class="reset" @click="resetActive">
                <fa icon="rotate-right"></fa>
                <a>reset</a>
              </div>
              <div class="weight-container">
                <div class="row g-4">
                  <div
                    v-for="(amount, index) in product.amounts"
                    :key="amount.id"
                    class="weight-item"
                    :class="{ active: activeIndex === index }"
                    @click="setActive(index, amount)"
                  >
                    <p>{{ amount.weight }} {{ amount.unit.name_en }} For {{ amount.price }} {{ product.currency?.name_en }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="buttons-section">
              <el-button class="add-to-cart" type="primary" size="large" round @click="addToCart"
              >{{ $t('add_to_cart') }}</el-button
              >
  
              <div class="quantity-section">
                <div class="quantity-control">
                  <el-button size="small" @click="decreaseQty">-</el-button>
                  <span class="qty-number">{{ quantity }}</span>
                  <el-button size="small" @click="increaseQty">+</el-button>
                </div>
              </div>
              
              <el-button id="favorite-btn" class="favorite-btn" circle size="large" @click="toggleFavorite">
                  <fa :icon="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></fa>
              </el-button>
            </div>
          </div>
        </el-col>

        <el-col   :xs="24" :sm="24"  :md="12"  :lg="10"  class="image-col">
          <div class="image-wrapper" ref="main">
            <div v-for="(image, index) in product.images" :key="image.id" class="slide">
              <img
                :src="getImageUrl(selectedImage)"
                class="main-image"
                @error="handleImageError"
              />
            </div>

            <div class="sale-badge" v-if="product.old_price">Sale</div>
          </div>
          <div class="slider-wrapper">
            <button class="btn nav-button left" @click="scrollLeft" v-if="numberOfSlides > 1"><fa icon="arrow-left"></fa></button>
            <div class="slider-container" :class="{ 'centered-slides': slidesToShow < 3 }">
              <div class="slider" ref="slider">
                <div v-for="(image, index) in product.images" :key="image.id" class="slide" @click="setSelectedImage(image.path)">
                  <img
                    :src="getImageUrl(image.path)"
                    :class="{ active: selectedImage === image.path }"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </div>
            <button class="btn nav-button right" @click="scrollRight" v-if="numberOfSlides > 1"><fa icon="arrow-right"></fa></button>
          </div>
        </el-col>

     
    </el-row>

    <!-- Children Products Section -->
      <div class="axil-breadcrumb-area mt-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 col-md-8">
          <div class="inner">
            <h1 class="title">All Products</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
      <div v-if="product.children && product.children.length > 0" class="shop-container" :dir="direction">
    <div class="container">
      <section class="products-grid">
        <div v-for="child in product.children" :key="child.id" class="product-card">
          <div class="image-container">
            <img 
              :src="child.images?.length ? getImageUrl(child.images[0].path) : placeholder"
              :alt="locale === 'ar' ? child.name_ar : child.name_en"
            />
            <div v-if="product.sale" class="sale-badge">Sale</div>
            <div class="product-actions">
              <button @click="navigateToProduct(child.id)" class="action-btn cart-btn">
                <fa icon="eye" />
              </button>
              <button  @click="addToFavorites(product)" class="action-btn love-btn">
                <fa icon="heart" />
              </button>
            </div>
          </div>
          <div class="product-info">
            <h4>{{ locale === 'ar' ? child.name_ar : child.name_en }}</h4>
            <div class="prices">
              <span class="price-new">{{ child.price }} {{ child.currency?.name_en || 'AED' }}</span>
              <span v-if="child.old_price" class="price-old">{{ child.old_price }} {{ child.currency?.name_en || 'AED' }}</span>
            </div>
            <div class="product-meta mb-2">
              <el-tag :type="child.is_available ? 'success' : 'danger'" size="small">
                {{ child.is_available ? $t('available') : $t('not_available') }}
              </el-tag>
            </div>
            <div class="addToCart-btn">
              <button  circle 
                    @click.stop="addChildToCart(child)"
                    :disabled="!child.is_available" class="btn">Add To Cart</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
    </div>
  </div>
</template>

<script setup>
import Header from "@/components/Website/Header.vue";
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { ElNotification } from 'element-plus';
import $ from 'jquery';
import 'slick-carousel/slick/slick.min.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


// Setup
const { locale, t } = useI18n();
const direction = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));
const route = useRoute();
const router = useRouter();

// Product data
const product = ref({});
const quantity = ref(1);
const placeholder = "/default-image.jpg";
const selectedImage = ref(null);
const isFavorite = ref(false);
const currentSlideIndex = ref(0);

// Slider Ref
const slider = ref(null);
const main = ref(null);
const slidesToShow = ref(3);
const numberOfSlides = ref(3);

// Helper methods
const getImageUrl = (path) => {
  if (!path) return placeholder;
  return `http://elegance_backend.test/storage/${path}`;
};

const handleImageError = (e) => {
  e.target.src = placeholder;
};

const setSelectedImage = (path) => {
  selectedImage.value = path;
  // Force update the main image
  nextTick(() => {
    const mainImage = document.querySelector('.main-image');
    if (mainImage) {
      mainImage.src = getImageUrl(path);
    }
  });
};

// Fetch product
const fetchProduct = async () => {
  try {
    const res = await axios.get(
      `http://elegance_backend.test/api/website/show/products/${route.params.id}`
    );
    if (res.data.status) {
      product.value = res.data.data;
      if (product.value.images?.length) {
        // Set initial image
        selectedImage.value = product.value.images[0].path;
        // Initialize slider after data is loaded
        nextTick(() => {
          initializeSlick();
        });
      }
    }
  } catch (err) {
    console.error("Error fetching product:", err);
  }
};

// Add to Cart
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
  router.push(`/products/${productId}`);
};

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

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;

  if (isFavorite.value) {
    ElNotification({
      title: t('Added To Favorites'),
      message: t('Product Added To Favorites'),
      type: 'success',
    });
  } else {
    ElNotification({
      title: t('Removed From Favorites'),
      message: t('Product Removed From Favorites'),
      type: 'success',
    });
  }
};

// Track selected index
const activeIndex = ref(); // default selected

// Set active item
const setActive = (index, amount) => {
  activeIndex.value = index;
  product.value.amount_id = amount.id;
  product.value.price = amount.price;
};

const resetActive = () => {
  activeIndex.value = null;
  product.value.amount_id = null;
  product.value.price = product.value.original_price;
};

// Slick Carousel Logic
const initializeSlick = () => {
  const $slider = $(slider.value);
  const $main = $(main.value);

  // Destroy existing instance if exists
  if ($slider.hasClass('slick-initialized')) {
    $slider.slick('unslick');
  }
  if ($main.hasClass('slick-initialized')) {
    $main.slick('unslick');
  }

  // Count the number of slides after they've been rendered
  const numSlides = product.value.images?.length || 0;
  numberOfSlides.value = numSlides;

  // Set slidesToShow dynamically
  slidesToShow.value = numSlides >= 4 ? 3 : 1;

  // Init slick for thumbnail slider
  $slider.slick({
    dots: numSlides > 1,
    centerMode: true,
    centerPadding: '0px',
    slidesToShow: slidesToShow.value,
    slidesToScroll: 1,
    infinite: numSlides > 1,
    focusOnSelect: true,
    rtl: locale.value === 'ar',
    asNavFor: $main,
    afterChange: function(currentSlide) {
      const currentImage = product.value.images[currentSlide];
      if (currentImage) {
        setSelectedImage(currentImage.path);
      }
    }
  });

  $main.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: numSlides > 1,
    fade: true,
    arrows: false,
    dots: false,
    centerMode: true,
    rtl: locale.value === 'ar',
    asNavFor: $slider,
    afterChange: function(currentSlide) {
      const currentImage = product.value.images[currentSlide];
      if (currentImage) {
        setSelectedImage(currentImage.path);
      }
    }
  });
};

const scrollLeft = () => {
  const $slider = $(slider.value);
  const $main = $(main.value);
  if ($slider.length && $slider.hasClass('slick-initialized')) {
    $slider.slick('slickPrev');
    $main.slick('slickPrev');
    updateSelectedImage();
  }
};

const scrollRight = () => {
  const $slider = $(slider.value);
  const $main = $(main.value);
  if ($slider.length && $slider.hasClass('slick-initialized')) {
    $slider.slick('slickNext');
    $main.slick('slickNext');
    updateSelectedImage();
  }
};

const updateSelectedImage = () => {
  const $slider = $(slider.value);
  if ($slider.length && $slider.hasClass('slick-initialized')) {
    const currentSlide = $slider.find('.slick-current');
    const imagePath = currentSlide.find('img').attr('src').replace('http://elegance_backend.test/storage/', '');
    setSelectedImage(imagePath);
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchProduct().then(initializeSlick);
});

// Cleanup on unmount
onBeforeUnmount(() => {
  const $main = $(main.value);
  const $slider = $(slider.value);

  if ($main.hasClass('slick-initialized')) $main.slick('unslick');
  if ($slider.hasClass('slick-initialized')) $slider.slick('unslick');
});

</script>

<style scoped>
.product-show {
  padding: 40px;
  font-family: "Tajawal", sans-serif;
  min-height: 100vh;
}

.product-container {
  background-color: transparent;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.product-details {
  position: relative;
  padding: 30px;
  border-radius: 15px;
  height: 100%;
}

.product-title {
  font-size: 50px;
  font-weight: bold;
  color: #a3852c;
  margin-bottom: 25px;
  line-height: 1.3;
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin: 20px 0;
}

.price-new {
  font-size: 28px;
  color: #a3852c;
  font-weight: 700;
}

.price-old {
  color: #7f7f7f;
  text-decoration: line-through;
  font-size: 28px;
  font-weight: 700;
  margin-right: 10px;
}

.description {
  color: #7f7f7f;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  margin: 20px 0;
}

.weight-container .row{
  display: flex;
  gap: 0  30px;
}

.weight-title {
  font-size: 20px;
  font-weight: 700;
  color: #a3852c;
  margin-bottom: 10px;
}

.reset {
  display: flex;
  align-items: center;

  cursor: pointer;
  color: #7f7f7f;
  font-size: 16px;
}

.reset a {
  background-color: transparent;
  color: #7f7f7f;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
}

.weight-item {
  flex: calc(100% / 3 - 30px);
  color: #333;
  padding: 10px;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.weight-item p{
  margin: 0;
  padding: 0;
  
  transition: all 0.3s ease;

}
.weight-item::after {
  content: "";
  position: absolute;
  width: 0;
  left: 50%;
  height: 0px;
  background-color: #a3852c;
  bottom: -5px;
  transition: all 0.3s ease;
}
.weight-item.active:after{
  content: "";
  position: absolute;
  width: 100%;
  left: 0;
  height: 3px;
  background-color: #a3852c;
  bottom: -5px;
}

.quantity-section {
  margin: 20px 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f1f1f1;
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
  position: absolute;
  right: 0;
  top: 0;
  width: 48px;
  height: 48px;
  background-color: #fff;
  border: 2px solid #eee;
  color: #a3852c;
  margin: 30px;
  transition: all 0.3s ease;
  font-size: 24px;
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
  border-radius: 15px;
  padding: 20px;
  height: fit-content;
}

.main-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
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

.slider-wrapper {
  position: relative;
  display: flex;
}


.nav-button {
  color: #c9c9c9;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 2rem;
}

.slider-container {
  background-color: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.slider {
  width: 100%;
  padding: 20px;
}

.slide {
  text-align: center;
  padding: 10px;
}

.slide img {
  width: 100%;
  height: auto;
  object-fit: contain;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider .slide img {
  max-height: 100px !important;
}

.slide img.active {
  border-radius: 8px;
}

.slide img:hover {
  transform: scale(1.05);
}

.slider .slide.slick-current {
  position: relative;
}

.slider .slide::after {
  content: "";
  position: absolute;
  width: 0;
  bottom: 0;
  left: 50%;
  height: 0;
  border-radius: 3px;
}

.slider .slide.slick-current::after {
  content: "";
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: #a3852c;
  transition: all 0.4s ease-in-out;
  transition-delay: 0.4s;
}

:deep(.slick-dots) {
  left: 0;
  bottom: -20px;
}

:deep(.slick-dots .slick-active button::before) {
  color: #a3852c;
}
:deep(.slick-track) {
  display: flex;
  align-items: center;
  justify-content: center !important;

}


:deep(.centered-slides.slider-container .slider .slide img) {
  max-height: 120px;
  width: auto;
  margin-left: auto;
  margin-right: auto;
}

:deep(.centered-slides.slider-container .slider .slide) {
  width: auto !important;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 1024px) {
  :deep(.product-container){
    flex-direction: row !important;
  }
  
}
@media (max-width: 1024px) {
  :deep(.product-container){
    flex-direction: column-reverse !important;
  }
  .weight-item {
    font-size: 16px;

  }
  :deep(.centered-slides.slider-container .slider .slide img) {
    max-height: 90px;
  }
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
}

@media (max-width: 425px) {
  .weight-item {
    font-size: 12px;

  }
  :deep(.centered-slides.slider-container .slider .slide img) {
    max-height: 40px;
  }
}

/* 
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
} */

.product-meta {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}

/* @media (max-width: 768px) {
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
} */







  .shop-container .container {
    display: flex;
    gap: 2rem;
    padding: 2rem 0;
    background: #fff;
    font-family: 'Cairo', sans-serif;
    flex-wrap: wrap;
  }
.products-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  .product-card {
    position: relative;
    background: #fff;
    text-align: center;
    transition: box-shadow 0.3s;
    height: fit-content;
  }
  .image-container {
    position: relative;
    background: #f9f9f9;
    overflow: hidden;
    border-radius: 5px;
  }
  .image-container img {
    width: 100%;
    height: auto;
    transition: transform 0.3s ease;
  }
  .product-card:hover .image-container img {
    transform: scale(1.1);
  }
  .product-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
  .product-card:hover .product-actions {
    transform: translateY(0);
  }
  .action-btn {
    border: none;
    border-radius: 10px;
    width: 100%;
    height: 45px;
    display: flex;
    margin: 1rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .icon {
    font-size: 1.2rem;
    transition: all 0.2s ease;
  }
  .action-btn:hover .icon {
    transform: scale(1.2);
  }
  .cart-btn {
    background-color: #fff;
    color: #8b6b3d;
  }
  .love-btn {
    background-color: #8b6b3d;
    color: #fff;
  }
  .sale-badge {
    position: absolute;
    top: 10px;
    left: -15px;
    background: #ff4c4c;
    color: white;
    padding: 4px 12px;
    font-size: 12px;
    border-radius: 5px;
  }
  .product-info {
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  .product-info .product-title {
    font-weight: bolder;
    font-size: 1.4rem;
  }
  .prices {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .price-new {
    color: #8b6500;
    font-size: 1.4rem;
    font-weight: bold;
  }
  .price-old {
    text-decoration: line-through;
    color: #aaa;
    font-size: 1.2rem;
    margin-right: 8px;
  }
  .addToCart-btn {
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
  }
  .addToCart-btn button {
    position: relative;
    padding: 0.75rem 1.5rem;
    color: #8b6b3d;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    width: 100%;
    overflow: hidden;
    z-index: 0;
    border-radius: 0;
  }
  .addToCart-btn button::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #8b6b3d;
    transition: height 0.3s ease;
    z-index: -1;
  }
  .addToCart-btn button:hover {
    color: #fff;
    border-radius: 6px;
  }
  .addToCart-btn button:hover::before {
    height: 100%;
  }
</style>
