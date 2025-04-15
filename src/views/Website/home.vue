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
    <section class="all-categories py-4">
      <div class="container">
        <div class="title">
          <fa class="fa-icon" :icon="['fas','cubes']"></fa>
          <h2>{{ $t('home.categories') }}</h2>
        </div>
        <div class="slider-wrapper">
          <div class="scrollers ms-3 mb-2">
            <button class="btn nav-button right" @click="scrollRight">&#8594;</button>
            <button class="btn nav-button left" @click="scrollLeft">&#8592;</button>
          </div>
          <div class="slider" ref="slider">
            <div class="card">
              <div class="category-content">
                <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
                <p>لبان هوجاري</p>
              </div>
            </div>
            <div class="card">
              <div class="category-content">
                <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
                <p>لبان هوجاري</p>
              </div>
            </div>
            <div class="card">
              <div class="category-content">
                <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
                <p>لبان هوجاري</p>
              </div>
            </div>
            <div class="card">
              <div class="category-content">
                <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
                <p>لبان هوجاري</p>
              </div>
            </div>
            <div class="card">
              <div class="category-content">
                <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
                <p>لبان هوجاري</p>
              </div>
            </div>
            <div class="card">
              <div class="category-content">
                <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
                <p>لبان هوجاري</p>
              </div>
            </div>
            <div class="card">
              <div class="category-content">
                <img src="@/assets/images/dd54ced2-6f85-47ef-8a24-f3ff5c196125..jpg" alt="لبان هوجاري" />
                <p>لبان هوجاري</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Brands />
    <!-- Featured Products Section -->



    <HomeBrands />
    <section class="our-brands">
      <div class="container">
        <div class="title mt-5">
          <fa class="fa-icon" :icon="['fas','diagram-project']"></fa>
          <h2>{{ $t('home.brands') }}</h2>
        </div>
        <div class="content">
          <a href=""><img src="@/assets/images/VervainLogo.png" alt="Vervain Logo"></a>
        </div>
      </div>
    </section>
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

/* Categories */
.category-content{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slider-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 16px;
  font-weight: bolder;
}

.slider {
  display: flex;
  width: 100%;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 30px;
  padding: 16px;
  overflow: hidden;
}

.card {
  flex: 0 0 calc(100% / 7 - 30px);
  background-color: #f7f7f7;
  border: none;
  padding: 12px;
  margin-top: 5px;
  transition: all 0.3s ease;
}

.scrollers {
  display: none;
  align-self: flex-end;
}


.nav-button {
  background-color: #8b6b3d;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #fff;
  z-index: 1;
  
}

.nav-button:hover{
  background-color: #725932;
}

.nav-button:focus{
  color: #fff;
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

@media (max-width: 1200px) {
  .card {
    flex: 0 0 calc(100% / 4 - 20px);
  }
  .slider {
    gap: 26px;
  }
  .scrollers {
    display: block;
  }
}

@media (max-width: 768px) {
  .card {
    flex: 0 0 calc(100% / 3 - 5px);
  }
  .all-categories .container .slider-wrapper .slider .card:hover {
    color: inherit;
    scale: 1;
  }

  .all-categories .container .slider-wrapper .slider .card:hover::after {
    transform: translate(-50%, -50%) scale(0);
  }
  .slider {
    gap: 14px;
  }
}

@media (max-width: 440px) {
  .card {
    flex: 0 0 calc(100% / 2 + 2px);
  }
  .slider {
    gap: 10px;
  }
}

/* Our Brandes */
.our-brands .content{
  display: flex;
  width: 100%;
  justify-content: center;
}

.our-brands .content a{
  /* margin-top: 30px; */
  transition: all 0.2s ease-in-out;
}

.our-brands .content a:hover{
  scale: 1.2;
}

.our-brands .content a img{
  height: 300px;
  width: auto;
  justify-self: center;
}  
</style>