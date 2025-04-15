<template>
  <div class="home">
    <Header />
    <!-- Hero Section with Ramadan Theme -->
  
    <section class="hero-section">
      <div id="carouselExample" class="carousel slide">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="@/assets/images/Hero/slider1.png" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
          <img src="@/assets/images/Hero/slider2.png" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
          <img src="@/assets/images/Hero/slider3.png" class="d-block w-100" alt="...">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    </section>
    <Categories />
    <Brands />
    <!-- Featured Products Section -->
    <section class="all-categories py-4">
      <div class="container">
        <div class="title">
          <fa class="fa-icon" :icon="['fas','cubes']"></fa>
          <h2>{{ $t('home.categories') }}</h2>
        </div>
        <div class="slider-wrapper">
          <button class="nav-button left" @click="scrollLeft">&#8592;</button>
          <div class="slider" ref="slider">
            <div class="card">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
              <h3>لبان هوجاري</h3>
            </div>
            <div class="card">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
              <h3>لبان هوجاري</h3>
            </div>
            <div class="card">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
              <h3>لبان هوجاري</h3>
            </div>
            <div class="card">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
              <h3>لبان هوجاري</h3>
            </div>
            <div class="card">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
              <h3>لبان هوجاري</h3>
            </div>
            <div class="card">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
              <h3>لبان هوجاري</h3>
            </div>
            <div class="card">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
              <h3>لبان هوجاري</h3>
            </div>
          </div>
          <button class="nav-button right" @click="scrollRight">&#8594;</button>
        </div>
      </div>
    </section>



    <HomeBrands />
    <Products />
    <LatestProducts />
  </div>
</template>

<script>
import Header from '@/components/Website/Header.vue'
import Categories from '@/components/Website/Categories.vue'
import HomeBrands from '@/components/Website/HomeBrands.vue'
import Products from '@/components/Website/ProductSection.vue'
import LatestProducts from '@/components/Website/LatestProducts.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Categories,
    HomeBrands,
    LatestProducts,
    Products
  },
  data() {
    return {
    };
  },
  methods: {
    scrollLeft() {
      this.$refs.slider.scrollBy({ left: -200, behavior: 'smooth' });
    },
    scrollRight() {
      this.$refs.slider.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.category-content{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slider-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 16px;
}

.slider {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 30px;
  padding: 16px 0;
  overflow: hidden;
}

.card {
  flex: 0 0 auto;
  background-color: #f7f7f7;
  border: none;
  padding: 12px;
  transition: all 0.3s ease;
  width: 200px; /* Adjust as needed */
}

.nav-button {
  background-color: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1;
}

.nav-button.left {
  margin-right: 10px;
}

.nav-button.right {
  margin-left: 10px;
}


.category-content img{
  border-radius: 8px;
  width: 100%;
}

.all-categories .container .slider-wrapper .slider .card::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;
  width: 100%;
  background-color: #8b6b3d;
  border-radius: 8px;
  transform: translate(-50%, -50%) scale(0);
  z-index: -1;
  transition: transform 0.3s ease;
}

.all-categories .container .slider-wrapper .slider .card:hover{
  color: #fff;
  scale: 1.2;
}

.all-categories .container .slider-wrapper .slider .card:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.title{
  margin-bottom: 15px;
  color: #8b6b3d;
  display: flex;
  align-items: center;
  gap: 10px;
}

.fa-icon{
  font-size: 1.8rem;
}
</style>