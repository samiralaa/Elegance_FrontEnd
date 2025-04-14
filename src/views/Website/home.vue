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
        <div class="card-container">
          <div class="card">
            <div class="category-content">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="" >
              <p>لبان هوجاري</p>
            </div>
          </div>
          <div class="card">
            <div class="category-content">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="" >
              <p>لبان هوجاري</p>
            </div>
          </div>
          <div class="card">
            <div class="category-content">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="" >
              <p>لبان هوجاري</p>
            </div>
          </div>
          <div class="card">
            <div class="category-content">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="" >
              <p>لبان هوجاري</p>
            </div>
          </div>
          <div class="card">
            <div class="category-content">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="" >
              <p>لبان هوجاري</p>
            </div>
          </div>
          <div class="card">
            <div class="category-content">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="" >
              <p>لبان هوجاري</p>
            </div>
          </div>
          <div class="card">
            <div class="category-content">
              <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="" >
              <p>لبان هوجاري</p>
            </div>
          </div>
        </div>
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

.category-content{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.all-categories .container .card-container .card{
  background-color: #f7f7f7;
  border: none;
  padding: 12px;
  transition: all 0.3s ease;
}

.all-categories .container .card-container{
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 أعمدة للشاشة الكاملة */
  gap: 30px;
  padding: 16px;
}

.category-content img{
  border-radius: 8px;
  width: 100%;
}

.all-categories .container .card-container .card::after {
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

.all-categories .container .card-container .card:hover{
  color: #fff;
  scale: 1.2;
}

.all-categories .container .card-container .card:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.title{
  margin-bottom: 20px;
  color: #8b6b3d;
  display: flex;
  align-items: center;
  gap: 10px;
}

.fa-icon{
  font-size: 1.8rem;
}

@media (max-width: 1200px) {
  .card-container {
    grid-template-columns: repeat(5, 1fr); /* 5 أعمدة للشاشات المتوسطة */
  }
}

@media (max-width: 768px) {
  .card-container {
    grid-template-columns: repeat(3, 1fr); /* 3 أعمدة للشاشات الصغيرة */
  }
}
</style>