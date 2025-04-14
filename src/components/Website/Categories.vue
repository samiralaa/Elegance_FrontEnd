<template>
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
  </div>
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
.categories-section {
  padding: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  position: relative;
}

.category-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-name {
  padding: 1rem;
  margin: 0;
  text-align: center;
  font-size: 1.2rem;
  color: #333;
}

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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  color: #e74c3c;
  padding: 1rem;
  margin-top: 1rem;
}
</style>