<template>
  <div class="container py-5">
    <div class="card shadow rounded-4 p-4 border-0">
      <h2 class="mb-4 text-center fw-bold">إعدادات الموقع</h2>

      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">جار التحميل...</span>
        </div>
      </div>

      <form v-else @submit.prevent="saveSettings">
        <!-- Category setting -->
        <div class="form-group mb-4">
          <label class="form-label fw-semibold mb-2">عرض التصنيفات (Category)</label>
          <div class="d-flex gap-4">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showCategoryTrue"
                :value="true"
                v-model="settings.show_category"
              />
              <label class="form-check-label" for="showCategoryTrue">تفعيل</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showCategoryFalse"
                :value="false"
                v-model="settings.show_category"
              />
              <label class="form-check-label" for="showCategoryFalse">تعطيل</label>
            </div>
          </div>
          <small
            class="d-block mt-2 fw-medium"
            :class="settings.show_category ? 'text-success' : 'text-danger'"
          >
            الحالة الحالية: {{ settings.show_category ? 'مفعّل' : 'معطّل' }}
          </small>
        </div>

        <!-- Brand setting -->
        <div class="form-group mb-4">
          <label class="form-label fw-semibold mb-2">عرض الماركات (Brand)</label>
          <div class="d-flex gap-4">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showBrandTrue"
                :value="true"
                v-model="settings.show_brand"
              />
              <label class="form-check-label" for="showBrandTrue">تفعيل</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showBrandFalse"
                :value="false"
                v-model="settings.show_brand"
              />
              <label class="form-check-label" for="showBrandFalse">تعطيل</label>
            </div>
          </div>
          <small
            class="d-block mt-2 fw-medium"
            :class="settings.show_brand ? 'text-success' : 'text-danger'"
          >
            الحالة الحالية: {{ settings.show_brand ? 'مفعّل' : 'معطّل' }}
          </small>
        </div>

        <!-- Our Products setting -->
        <div class="form-group mb-4">
          <label class="form-label fw-semibold mb-2">عرض المنتجات لدينا (Our Products)</label>
          <div class="d-flex gap-4">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showOurProductsTrue"
                :value="true"
                v-model="settings.show_our_products"
              />
              <label class="form-check-label" for="showOurProductsTrue">تفعيل</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showOurProductsFalse"
                :value="false"
                v-model="settings.show_our_products"
              />
              <label class="form-check-label" for="showOurProductsFalse">تعطيل</label>
            </div>
          </div>
          <small
            class="d-block mt-2 fw-medium"
            :class="settings.show_our_products ? 'text-success' : 'text-danger'"
          >
            الحالة الحالية: {{ settings.show_our_products ? 'مفعّل' : 'معطّل' }}
          </small>
        </div>

        <!-- Latest Products setting -->
        <div class="form-group mb-4">
          <label class="form-label fw-semibold mb-2">عرض المنتجات الجديدة (Latest Products)</label>
          <div class="d-flex gap-4">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showLatestProductsTrue"
                :value="true"
                v-model="settings.show_latest_products"
              />
              <label class="form-check-label" for="showLatestProductsTrue">تفعيل</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showLatestProductsFalse"
                :value="false"
                v-model="settings.show_latest_products"
              />
              <label class="form-check-label" for="showLatestProductsFalse">تعطيل</label>
            </div>
          </div>
          <small
            class="d-block mt-2 fw-medium"
            :class="settings.show_latest_products ? 'text-success' : 'text-danger'"
          >
            الحالة الحالية: {{ settings.show_latest_products ? 'مفعّل' : 'معطّل' }}
          </small>
        </div>

        <!-- Best Selling Products setting -->
        <div class="form-group mb-4">
          <label class="form-label fw-semibold mb-2">عرض المنتجات الأكثر مبيعًا (Best Selling Products)</label>
          <div class="d-flex gap-4">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showBestSellingProductsTrue"
                :value="true"
                v-model="settings.show_best_selling_products"
              />
              <label class="form-check-label" for="showBestSellingProductsTrue">تفعيل</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="showBestSellingProductsFalse"
                :value="false"
                v-model="settings.show_best_selling_products"
              />
              <label class="form-check-label" for="showBestSellingProductsFalse">تعطيل</label>
            </div>
          </div>
          <small
            class="d-block mt-2 fw-medium"
            :class="settings.show_best_selling_products ? 'text-success' : 'text-danger'"
          >
            الحالة الحالية: {{ settings.show_best_selling_products ? 'مفعّل' : 'معطّل' }}
          </small>
        </div>

        <!-- Save Button -->
        <div class="text-center">
          <button type="submit" class="btn btn-primary px-5 py-2 rounded-3 shadow-sm">
            حفظ التغييرات
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="message" class="alert alert-success mt-4 text-center rounded-3">
          {{ message }}
        </div>

        <!-- Error Message -->
        <div v-if="errors.length" class="alert alert-danger mt-4 text-center rounded-3">
          <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SettingsComponent',
  data() {
    return {
      settings: {
        show_category: true,
        show_brand: true,
        show_our_products: true,
        show_latest_products: true,
        show_best_selling_products: true,
      },
      loading: true,
      message: '',
      errors: []
    }
  },
  methods: {
    fetchSettings() {
  axios.get('/api/settings')
    .then(response => {
      const settingsArray = response.data.data;
      const transformedSettings = {};

      settingsArray.forEach(item => {
        transformedSettings[item.key] = item.value === '1';
      });

      this.settings = {
        show_category: transformedSettings.show_category ?? false,
        show_brand: transformedSettings.show_brand ?? false,
        show_our_products: transformedSettings.show_our_products ?? false,
        show_latest_products: transformedSettings.show_latest_products ?? false,
        show_best_selling_products: transformedSettings.show_best_selling_products ?? false
      };

      this.loading = false;
    })
    .catch(error => {
      console.error('Error fetching settings:', error);
      this.loading = false;
    });
},
    saveSettings() {
  const updatedSettings = {
    show_category: this.settings.show_category ? '1' : '0',
    show_brand: this.settings.show_brand ? '1' : '0',
    show_our_products: this.settings.show_our_products ? '1' : '0',
    show_latest_products: this.settings.show_latest_products ? '1' : '0',
    show_best_selling_products: this.settings.show_best_selling_products ? '1' : '0'
  };

  axios.post('/api/settings', updatedSettings)
    .then(response => {
      this.message = response.data.message || 'تم الحفظ بنجاح';
      this.errors = [];  // Clear any previous errors
    })
    .catch(error => {
      if (error.response && error.response.data.errors) {
        this.errors = Object.values(error.response.data.errors).flat();
      } else {
        console.error('Error saving settings:', error);
      }
    });
}


  },
  mounted() {
    this.fetchSettings();
  }
}
</script>

<style scoped>
.container {
  max-width: 650px;
}

.card {
  background-color: #ffffff;
}

label {
  color: #333;
}

.form-check-label {
  cursor: pointer;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.alert {
  border-radius: 5px;
  padding: 10px;
}
</style>
