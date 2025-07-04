<template>
  <div class="custom-search-modal">
    <div class="modal-content">
      <div class="d-flex gap-2 mb-3">
        <input
          v-model="query"
          @input="debouncedSearch"
          type="text"
          class="form-control"
          placeholder="ابحث عن منتج أو قسم"
        />
        <button class="btn btn-primary" @click="searchNow">بحث</button>
      </div>

      <div v-if="loading" class="text-center py-3">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <ul v-if="results.length && !loading" class="list-unstyled">
        <li
          v-for="item in results"
          :key="item.id + '-' + item.type"
          class="product-item d-flex align-items-center gap-3 border-bottom pb-2 mb-2"
        >
          <div
            @click="handleResultClick(item)"
            style="cursor: pointer; width: 100%; display: flex; align-items: center; gap: 12px;"
          >
            <template v-if="item.type === 'product'">
              <img :src="getImage(item)" class="product-image" />
              <div>
                <h6 class="mb-1">
                  {{ isArabic(query) ? item.name_ar : item.name_en }}
                </h6>
                <small class="text-muted">
                  {{ isArabic(query) ? item.name_en : item.name_ar }}
                </small>
                <div class="mt-1">{{ item.price }} {{ item.currency?.name_en }}</div>
              </div>
            </template>

            <template v-else-if="item.type === 'category'">
              <div>
                <h6 class="mb-1">
                  {{ isArabic(query) ? item.name_ar : item.name_en }}
                </h6>
                <small class="text-muted">
                  {{ isArabic(query) ? item.name_en : item.name_ar }}
                </small>
                <span class="badge bg-info">قسم</span>
              </div>
            </template>
          </div>
        </li>
      </ul>

      <p v-else-if="query && !loading" class="text-center text-muted mt-3">لا توجد نتائج</p>

      <button class="btn btn-outline-secondary w-100 mt-4" @click="$emit('close')">إغلاق</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchModal',
  data() {
    return {
      query: '',
      results: [],
      loading: false,
      debounceTimer: null
    };
  },
  methods: {
    isArabic(text) {
      return /[\u0600-\u06FF]/.test(text);
    },
    debouncedSearch() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchNow();
      }, 400);
    },
    async searchNow() {
      if (!this.query || this.query.length < 2) {
        this.results = [];
        return;
      }

      this.loading = true;
      try {
        const res = await axios.post('/api/search-products', {
          query: this.query
        });
        this.results = res.data.data || [];
      } catch (error) {
        console.error('Search error:', error);
        this.results = [];
      } finally {
        this.loading = false;
      }
    },
    getImage(product) {
      const base = 'https://backend.webenia.org/public/storage/';
      if (product.images && product.images.length && product.images[0].path) {
        const path = product.images[0].path;
        return path.startsWith('http') ? path : base + path;
      }
      return '/placeholder-image.jpg';
    },
    handleResultClick(item) {
      if (item.type === 'product') {
        this.$router.push(`/read/products/${item.id}`);
      } else if (item.type === 'category') {
        this.$router.push(`/category/${item.id}`);
      }
    }
  }
};
</script>

<style scoped>
.custom-search-modal {
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  z-index: 1050;
  max-height: 80vh;
  overflow-y: auto;
}
.product-image {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
