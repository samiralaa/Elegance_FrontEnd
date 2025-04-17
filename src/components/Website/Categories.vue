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
            <button class="btn nav-button right" @click="scrollRight">&#8594;</button>
            <button class="btn nav-button left" @click="scrollLeft">&#8592;</button>
          </div>
          <div class="slider" ref="slider">
            <div v-for="category in categories" :key="category.id" class="card">
              <div class="category-content">
                <img  :src="category.image" :alt="$i18n.locale === 'ar' ? category.name_ar : category.name"/>
                <p :class="{ 'rtl': $i18n.locale === 'ar' }">{{ $i18n.locale === 'ar' ? category.name_ar : category.name }}</p>
              </div>
            </div>
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
        await this.fetchCategories()
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
  }
}
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: center;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  color: #e74c3c;
  padding: 1rem;
  margin-top: 1rem;
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
  margin-bottom: 10px;
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
</style>