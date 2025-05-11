<template>
  <!-- <p>Categories</p>
  <div class="categories-section">
    <div class="categories-grid">
      <div v-for="category in categories" :key="category.id" class="category-card">
        <div class="category-image">
          <img :src="category.image" :alt="$i18n.locale === 'ar' ? category.name_ar : category.name" />
        </div>
        <h3 class="category-name" :class="{ 'rtl': $i18n.locale === 'ar' }">
          {{ $i18n.locale === 'ar' ? category.name_ar : category.name }}
        </h3>
      </div>
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div> -->
  <section class="all-categories py-4">
      <div class="container">
        <div class="title">
          <fa class="fa-icon" :icon="['fas','cubes']"></fa>
          <h2>{{ $t('home.categories') }}</h2>
        </div>
        <div class="slider-wrapper">
          <div class="scrollers ms-3 mb-2">
            <button class="btn nav-button left" @click="scrollLeft">&#8592;</button>
            <button class="btn nav-button right" @click="scrollRight">&#8594;</button>
          </div>
          <div class="slider py-5" ref="slider">
            <a v-for="category in categories" :key="category.id" class="card">
              <div class="category-content">
                <img  :src="category.image" :alt="$i18n.locale === 'ar' ? category.name_ar : category.name"/>
                <p :class="{ 'rtl': $i18n.locale === 'ar' }">{{ $i18n.locale === 'ar' ? category.name_ar : category.name }}</p>
              </div>
            </a>
          </div>
          <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { nextTick } from 'vue'

// import 'slick-carousel'
// import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'

export default {
  name: 'WebsiteCategories',
  computed: {
    ...mapState('websiteCategories', {
      categories: state => state.items,
      loading: state => state.loading,
      error: state => state.error
    })
  },
  created() {
    this.loadCategories()
  },
  methods: {
    ...mapActions('websiteCategories', {
      fetchCategories: 'fetchWebsiteCategories'
    }),
    async loadCategories() {
      try {
        // Fetch categories
        await this.fetchCategories()

        // Wait for DOM update
        await nextTick()

        // Destroy existing slider if it's already initialized
        if (this.$refs.slider && $(this.$refs.slider).hasClass('slider')) {
          $(this.$refs.slider).slick('unslick')
        }

        // Initialize Slick Carousel
        $(this.$refs.slider).slick({
          slidesToShow: 7,
          slidesToScroll: 1,
          arrows: true,
          infinite: true,
          rtl: this.$i18n.locale === 'ar',
          prevArrow: '<button type="button" class="slick-prev nav-btn left">❮</button>',
          nextArrow: '<button type="button" class="slick-next nav-btn right">❯</button>',
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 5
              }
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 4
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 3
              }
            },
            {
              breakpoint: 576,
              settings: {
                slidesToShow: 2
              }
            },
            {
              breakpoint: 400,
              settings: {
                slidesToShow: 1
              }
            }
          ]
        })

      } catch (error) {
        console.error('Error loading categories:', error)
      }
    },
    scrollLeft() {
      if (this.$refs.slider) {
        $(this.$refs.slider).slick('slickPrev')
      }
    },
    scrollRight() {
      if (this.$refs.slider) {
        $(this.$refs.slider).slick('slickNext')
      }
    },
    getAlt(category) {
      return this.$i18n.locale === 'ar' ? category.name_ar : category.name
    }
  },
  // Optional: Clean up slick carousel on component destruction
  beforeUnmount() {
    if (this.$refs.slider && $(this.$refs.slider).hasClass('slider')) {
      $(this.$refs.slider).slick('unslick')
    }
  }
}
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  color: #e74c3c;
  padding: 1rem;
  margin-top: 1rem;
}

.all-categories .container {
  max-width: 1200px;
  margin: auto;
  padding: 0 1rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #8b6b3d;
}

.fa-icon {
  font-size: 1.8rem;
}

.slider-wrapper {
  position: relative;
  overflow: hidden;
  padding: 16px 0;
}

.scrollers {
  display: none;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.slick-slider{
  opacity: 1 !important;
  width: 100% !important;;
  translate: inherit !important;;
  display: flex !important;;
  align-items: center !important;;
  justify-content: center !important;;
  gap: 30px !important;
}

.nav-button {
  background-color: #8b6b3d;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background-color: #725932;
}

.nav-button.left {
  margin-right: 10px;
}

.nav-button.right {
  margin-left: 10px;
}

.slider {
  display: flex;
  gap: 30px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 16px;
  scrollbar-width: none;
}

.slick-track{
  width: 100%;
}

.slick-list {
  width: 100%;
}

.slider::-webkit-scrollbar {
  display: none;
}

.card {
  flex: 0 0 calc(14.28% - 24px);
  background-color: #f7f7f7;
  border: none;
  padding: 12px;
  transition: all 0.3s ease;
  position: relative;
  text-align: center;
  text-decoration: none;
}

.category-content img {
  border-radius: 8px;
  width: 100%;
  height: auto;
}

.category-content p {
  margin-top: 8px;
  font-weight: bold;
}

.card::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: #8b6b3d;
  border-radius: 8px;
  transform: translate(-50%, -50%) scale(0);
  z-index: -1;
  transition: transform 0.3s ease;
}

.card:hover {
  color: #fff;
  transform: scale(1.1);
  z-index: 1;
}

.card:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

@media (max-width: 1200px) {
  .card {
    flex: 0 0 calc(20% - 24px);
  }
  .scrollers {
    display: flex;
  }
}

@media (max-width: 992px) {
  .card {
    flex: 0 0 calc(25% - 24px);
  }
}

@media (max-width: 768px) {
  .card {
    flex: 0 0 calc(33.33% - 20px);
  }
  .card:hover {
    transform: scale(1);
  }
  .card:hover::after {
    transform: translate(-50%, -50%) scale(0);
  }
}

@media (max-width: 576px) {
  .card {
    flex: 0 0 calc(50% - 16px);
  }
  .nav-button {
    font-size: 1.1rem;
  }
}

@media (max-width: 400px) {
  .card {
    flex: 0 0 100%;
  }
}
</style>