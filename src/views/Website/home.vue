<template>
  <div class="home">
    <Header />
    <!-- Hero Section with Ramadan Theme -->
  
    <section class="hero-section">
      <div class="floating-elements">
        <div v-for="n in 5" :key="n" class="crescent" :style="{ animationDelay: `${n * 0.5}s` }"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('home.heroTitle') }}</h1>
        <p class="hero-subtitle">{{ $t('home.heroSubtitle') }}</p>
        <router-link to="/products" class="cta-button">
          {{ $t('home.shopNow') }}
        </router-link>
      </div>
    </section>
    <Categories />
    <!-- Featured Products Section -->
    <section class="featured-products">
      <h2 class="section-title">{{ $t('home.featuredProducts') }}</h2>
      <div class="products-grid">
        <!-- Products will be loaded here -->
      </div>
    </section>



    <!-- Brand Showcase -->
    <section class="brands-showcase">
      <h2 class="section-title">{{ $t('home.ourBrands') }}</h2>
      <div class="brands-grid">
        <!-- Brand logos will be loaded here -->
      </div>
    </section>
  </div>
</template>

<script>
import Header from '@/components/Website/Header.vue'
import Categories from '@/components/Website/Categories.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Categories
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

.hero-section {
  position: relative;
  height: 80vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.crescent {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ffd700, #ffa500);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  animation: float 8s infinite ease-in-out;
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