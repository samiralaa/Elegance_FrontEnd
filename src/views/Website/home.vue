<template>
  <div class="home" :dir="direction">
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
    <HomeBrands />
    <Products />
    <LatestProducts />
    <BestSelling />
  </div>
</template>

<script>
import Header from '@/components/Website/Header.vue'
import Categories from '@/components/Website/Categories.vue'
import HomeBrands from '@/components/Website/HomeBrands.vue'
import Products from '@/components/Website/ProductSection.vue'
import BestSelling from '@/components/Website/BestSelling.vue'
import LatestProducts from '@/components/Website/LatestProducts.vue'
import i18n from '@/i18n.js'

export default {
  name: 'Home',
  components: {
    Header,
    Categories,
    HomeBrands,
    LatestProducts,
    Products,
    BestSelling
  },
  computed: {
    direction() {
      return i18n.global.locale === 'ar' ? 'rtl' : 'ltr';
    }
  },
  data() {
    return {
    };
  },
  methods: {
    scrollLeft() {
      const width = window.innerWidth;
      const card = this.$refs.slider.querySelector('.card');
      const cardWidth = card.offsetWidth;

      if (width <= 440) {
        const gap = 26;
        this.$refs.slider.scrollBy({ left: -(cardWidth * 2 + gap), behavior: 'smooth' });
      } else if (width <= 768) {
        const gap = 50;
        this.$refs.slider.scrollBy({ left: -(cardWidth * 3 + gap), behavior: 'smooth' });
      } else if (width <= 1200) {
        const gap = 50;
        this.$refs.slider.scrollBy({ left: -(cardWidth * 4 + gap), behavior: 'smooth' });
      } else {
        const gap = 30; // optional for bigger screens
        this.$refs.slider.scrollBy({ left: -(cardWidth * 7 + gap), behavior: 'smooth' });
      }
    },
    scrollRight() {
      const width = window.innerWidth;
      const card = this.$refs.slider.querySelector('.card');
      const cardWidth = card.offsetWidth;

      if (width <= 440) {
        const gap = 26;
        this.$refs.slider.scrollBy({ left: cardWidth * 2 + gap, behavior: 'smooth' });
      } else if (width <= 768) {
        const gap = 50;
        this.$refs.slider.scrollBy({ left: cardWidth * 3 + gap, behavior: 'smooth' });
      } else if (width <= 1200) {
        const gap = 50;
        this.$refs.slider.scrollBy({ left: cardWidth * 4 + gap, behavior: 'smooth' });
      } else {
        const gap = 30; // optional for bigger screens
        this.$refs.slider.scrollBy({ left: cardWidth * 7 + gap, behavior: 'smooth' });
      }
    }
  }

};
</script>

<style scoped>
.home {
  min-height: 100vh;
}
</style>