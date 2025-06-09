<template>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
  <Header />

  <div class="product-show" :dir="direction">
    <div class="container">
      <el-row :gutter="20" class="product-container full-height-row flex-md-row flex-column-reverse">
        <el-col :xs="24" :sm="24" :md="12" :lg="14">
          <div class="product-details">
            <h1 class="product-title">{{ locale === 'ar' ? product.name_ar : product.name_en }}</h1>
            <div v-html="locale === 'ar' ? product.description_ar : product.description_en" class="description"></div>

            <div class="price-block">
              <span class="price-old" v-if="product.old_price">{{ product.old_price }} {{ product.currency?.name_en
                }}</span>
              <span class="price-new">{{ product.price }} {{ product.currency?.name_en }}</span>
            </div>

            <div class="product-actions">
              <button @click="addToFavorites" class="action-btn love-btn" :class="{ 'active': isFavorite }">
                <fa :icon="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></fa>
              </button>
            </div>

            <div class="weight" v-if="product.amounts && product.amounts.length > 0">
              <h1 class="weight-title">Select Weight</h1>
              <div class="reset" @click="resetActive">
                <fa icon="rotate-right"></fa>
                <a>reset</a>
              </div>
              <div class="weight-container">
                <div class="row g-4">
                  <div v-for="(amount, index) in product.amounts" :key="amount.id" class="weight-item"
                    :class="{ active: activeIndex === index }" @click="setActive(index, amount)">
                    <p>{{ amount.weight }} {{ amount.unit.name_en }} For {{ amount.price }} {{ product.currency?.name_en
                      }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="buttons-section">
              <el-button class="add-to-cart" type="primary" size="large" round @click="addToCart">{{ $t('add_to_cart')
                }}</el-button>

              <div class="quantity-section">
                <div class="quantity-control">
                  <el-button size="small" @click="decreaseQty" :disabled="quantity <= minQuantity" class="qty-btn">
                    <fa icon="minus" />
                  </el-button>
                  <span class="qty-number">{{ quantity }}</span>
                  <el-button size="small" @click="increaseQty" :disabled="quantity >= maxQuantity" class="qty-btn">
                    <fa icon="plus" />
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="10" class="image-col">
          <div class="image-wrapper" ref="main">
            <div v-for="(image, index) in product.images" :key="image.id" class="slide">
              <img :src="getImageUrl(selectedImage)" class="main-image" @error="handleImageError" />
            </div>

            <div class="sale-badge" v-if="product.old_price">Sale</div>
          </div>
          <div class="slider-wrapper">
            <button class="btn nav-button left" @click="scrollLeft" v-if="numberOfSlides > 1">
              <fa icon="arrow-left"></fa>
            </button>
            <div class="slider-container" :class="{ 'centered-slides': slidesToShow < 3 }">
              <div class="slider" ref="slider">
                <div v-for="(image, index) in product.images" :key="image.id" class="slide"
                  @click="setSelectedImage(image.path)">
                  <img :src="getImageUrl(image.path)" :class="{ active: selectedImage === image.path }"
                    @error="handleImageError" />
                </div>
              </div>
            </div>
            <button class="btn nav-button right" @click="scrollRight" v-if="numberOfSlides > 1">
              <fa icon="arrow-right"></fa>
            </button>
          </div>
        </el-col>


      </el-row>

      <!-- Children Products Section -->
      <div v-if="product.children && product.children.length > 0" class="children-products-section">
        <div class="section-header">
          <h2 class="section-title">{{ t('related_products') }}</h2>
        </div>
        <div class="shop-container" :dir="direction">
          <div class="container">
            <section class="products-grid">
              <div v-for="child in product.children" :key="child.id" class="product-card">
                <div class="image-container">
                  <img :src="child.images?.length ? getImageUrl(child.images[0].path) : placeholder"
                    :alt="locale === 'ar' ? child.name_ar : child.name_en" />
                  <div v-if="child.old_price" class="sale-badge">Sale</div>
                  <div class="product-actions">
                    <button @click="navigateToProduct(child.id)" class="action-btn cart-btn">
                      <fa icon="eye" />
                    </button>
                    <button @click="toggleChildFavorite(child)" class="action-btn love-btn">
                      <fa :icon="isChildFavorite(child) ? 'fas fa-heart' : 'far fa-heart'" />
                    </button>
                  </div>
                </div>
                <div class="product-info">
                  <h4>{{ locale === 'ar' ? child.name_ar : child.name_en }}</h4>
                  <div class="prices">
                    <span class="price-new">{{ child.price }} {{ child.currency?.name_en || 'AED' }}</span>
                    <span v-if="child.old_price" class="price-old">{{ child.old_price }} {{ child.currency?.name_en ||
                      'AED' }}</span>
                  </div>
                  <div class="addToCart-btn">
                    <button @click.stop="addChildToCart(child)" :disabled="!child.is_available" class="btn">
                      {{ t('add_to_cart') }}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
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
import { useFavoritesStore } from '@/store/favorites';
import { useCartStore } from '@/store/modules/cart';


// Setup
const { locale, t } = useI18n();
const direction = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));
const route = useRoute();
const router = useRouter();
const favoritesStore = useFavoritesStore();
const cartStore = useCartStore();

// Product data
const product = ref({});
const quantity = ref(1);
const minQuantity = 1;
const maxQuantity = 99;
const placeholder = "/default-image.jpg";
const selectedImage = ref(null);
const isFavorite = ref(false);
const currentSlideIndex = ref(0);

// Slider Ref
const slider = ref(null);
const main = ref(null);
const slidesToShow = ref(3);
const numberOfSlides = ref(3);

// Add these new functions for child products

// Helper methods
const getImageUrl = (path) => {
  if (!path) return placeholder;
  return `http://127.0.0.1:8000/storage/${path}`;
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
      `http://127.0.0.1:8000/api/website/show/products/${route.params.id}`
    );
    if (res.data.status) {
      product.value = res.data.data;
      if (product.value.images?.length) {
        // Set initial image
        selectedImage.value = product.value.images[0].path;
        // Initialize slider after data is loaded
        nextTick(() => {
          initializeSlick();
          checkFavoriteStatus();
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
    const success = await cartStore.addToCart(
      product.value.id,
      quantity.value,
      product.value.price,
      product.value.amount_id
    );


    if (success) {

    const response = await axios.post('http://127.0.0.1:8000/api/cart-items', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (response.data.message) {

      ElNotification({
        title: t('success'),
        message: t('Product added to cart successfully'),
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
    const success = await cartStore.addToCart(
      childProduct.id,
      1,
      childProduct.price,
      childProduct.amount_id
    );


    if (success) {

    if (userId) {
      payload.user_id = userId;
    }

    if (childProduct.amounts) {
      payload.amount_id = childProduct.amount_id;
    }

    const response = await axios.post('http://127.0.0.1:8000/api/cart-items', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (response.data.message) {

      ElNotification({
        title: t('success'),
        message: t('Product added to cart successfully'),
        type: 'success',
      });
    }
  } catch (error) {
    console.error('Error adding child product to cart:', error);
    ElNotification({
      title: '❌',
      message: error.response?.data?.message || t('add_to_cart_error') || 'Login required to add to cart',
      type: 'error',
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
  product.value.original_price;
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
    afterChange: function (currentSlide) {
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
    afterChange: function (currentSlide) {
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
    const imagePath = currentSlide.find('img').attr('src').replace('http://127.0.0.1:8000/storage/', '');
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

// Add these new functions for child products
const isChildFavorite = (child) => {
  return favoritesStore.isInFavorites(child.id);
};

const toggleChildFavorite = async (child) => {
  try {
    if (isChildFavorite(child)) {
      // If already favorite, remove it
      const favoriteItem = favoritesStore.favorites.find(fav => fav.product_id === child.id);
      if (favoriteItem) {
        await favoritesStore.removeFromFavorites(favoriteItem.id);
        // No need to update local state, store handles it
        ElNotification({
          title: t('Removed From Favorites'),
          message: t('Product Removed From Favorites'),
          type: 'success',
        });
      }
    } else {
      // If not favorite, add it
      const response = await favoritesStore.addToFavorites(child.id);
      // Assuming store action returns a truthy value on success
      if (response) {
        // No need to update local state, store handles it
        ElNotification({
          title: t('Added To Favorites'),
          message: t('Product Added To Favorites'),
          type: 'success',
        });
      }
    }
  } catch (error) {
    console.error('Error toggling child favorites:', error);
    ElNotification({
      title: t('error'),
      message: error.message || t('failed_to_toggle_favorite'),
      type: 'error',
    });
  }
};

const increaseQty = () => {
  if (quantity.value < maxQuantity) {
    quantity.value++;
  } else {
    ElNotification({
      title: t('warning'),
      message: t('max_quantity_reached'),
      type: 'warning',
    });
  }
};

const decreaseQty = () => {
  if (quantity.value > minQuantity) {
    quantity.value--;
  } else {
    ElNotification({
      title: t('warning'),
      message: t('min_quantity_reached'),
      type: 'warning',
    });
  }
};

// Add to Favorites
const addToFavorites = async () => {
  try {
    if (isFavorite.value) {
      // If already favorite, remove it
      const favoriteItem = favoritesStore.favorites.find(fav => fav.product_id === product.value.id);
      if (favoriteItem) {
        await favoritesStore.removeFromFavorites(favoriteItem.id);
        isFavorite.value = false; // Update local state
        ElNotification({
          title: t('Removed From Favorites'),
          message: t('Product Removed From Favorites'),
          type: 'success',
        });
      }
    } else {
      // If not favorite, add it
      const response = await favoritesStore.addToFavorites(product.value.id);
      // Assuming store action returns a truthy value on success
      if (response) {
        isFavorite.value = true; // Update local state
        ElNotification({
          title: t('Added To Favorites'),
          message: t('Product Added To Favorites'),
          type: 'success',
        });
      }
    }
  } catch (error) {
    console.error('Error toggling favorites:', error);
    ElNotification({
      title: t('error'),
      message: error.message || t('failed_to_toggle_favorite'),
      type: 'error',
    });
  }
};

// Check if product is in favorites
const checkFavoriteStatus = () => {
  isFavorite.value = favoritesStore.isInFavorites(product.value.id);
};

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

.weight-container .row {
  display: flex;
  gap: 0 30px;
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

.weight-item p {
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

.weight-item.active:after {
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
  gap: 10px;
  background-color: #f8f8f8;
  padding: 5px;
  border-radius: 8px;
  width: fit-content;
}

.qty-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  color: #a3852c;
  transition: all 0.3s ease;
}

.qty-btn:hover:not(:disabled) {
  background-color: #a3852c;
  color: #fff;
  border-color: #a3852c;
}

.qty-btn:disabled {
  background-color: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

.qty-number {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  min-width: 40px;
  text-align: center;
  padding: 0 10px;
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
  :deep(.product-container) {
    flex-direction: row !important;
  }

}

@media (max-width: 1024px) {
  :deep(.product-container) {
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

  .quantity-control {
    width: 100%;
    justify-content: center;
  }

  .qty-number {
    width: 50px;
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

.children-products-section {
  margin-top: 40px;
  padding: 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #a3852c;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #a3852c;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.product-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.image-container {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .image-container img {
  transform: scale(1.1);
}

.product-actions {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.action-btn {
  background: white;
  border: 1px solid #a3852c;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.love-btn {
  color: #a3852c;
}

.love-btn.active {
  background: #a3852c;
  color: white;
}

.love-btn i {
  font-size: 18px;
}

.love-btn.active .fa,
.love-btn.active i {
  color: #ff0000;
  /* Red color for active heart */
}

.cart-btn {
  background: #fff;
  color: #a3852c;
  border: 1px solid #a3852c;
}

.product-info {
  padding: 15px;
}

.product-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.prices {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.addToCart-btn button {
  width: 100%;
  padding: 10px;
  border: none;
  background: #a3852c;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.addToCart-btn button:hover {
  background: #8b7024;
}

.addToCart-btn button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  .section-title {
    font-size: 24px;
  }
}
</style>
