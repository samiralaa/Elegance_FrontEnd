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
    <section class="featured-products">
      <h2 class="section-title">{{ $t('home.featuredProducts') }}</h2>
      <div class="products-grid">
        <!-- Products will be loaded here -->
      </div>
    </section>



    <HomeBrands />
  </div>
</template>

<script>
import Header from '@/components/Website/Header.vue'
import Categories from '@/components/Website/Categories.vue'
import HomeBrands from '@/components/Website/HomeBrands.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Categories,
    HomeBrands
  },
  data() {
    return {
      // Data properties will be added here
    }
  },
  methods: {
    // Methods will be added here
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}


@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 2rem;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #ffd700, #ffa500);
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.cta-button:hover {
  transform: scale(1.05);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin: 4rem 0 2rem;
}

.products-grid,
.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

/* RTL Support */
[dir="rtl"] .hero-section {
  direction: rtl;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>