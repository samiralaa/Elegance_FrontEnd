<template>
  <div class="category-create">
    <div class="form-card">
      <h2 class="form-title">{{ $t('Categories.AddCategory') }}</h2>

      <div v-if="loading" class="loading-overlay">
        <span class="spinner"></span>
      </div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <form @submit.prevent="submitCategory" :style="loading ? 'pointer-events:none;opacity:0.5;' : ''">
        <div class="form-group">
          <label>{{ $t('Categories.NameEn') }}</label>
          <input v-model="form.name" required class="form-input" />
        </div>

        <div class="form-group">
          <label>{{ $t('Categories.NameAr') }}</label>
          <input v-model="form.name_ar" required class="form-input" />
        </div>

        <div class="form-group">
          <label>{{ $t('Categories.DescriptionEn') }}</label>
          <textarea v-model="form.description" required class="form-input form-textarea"></textarea>
        </div>

        <div class="form-group">
          <label>{{ $t('Categories.DescriptionAr') }}</label>
          <textarea v-model="form.description_ar" required class="form-input form-textarea"></textarea>
        </div>

        <div class="form-group">
          <label>{{ $t('Categories.Brand') }}</label>
          <el-select
            v-model="form.brand_id"
            :placeholder="$t('Categories.SelectBrand')"
            filterable
            clearable
            class="form-input"
          >
            <el-option
              v-for="brand in brands"
              :key="brand.id"
              :label="brand.name_en"
              :value="brand.id"
            />
          </el-select>
        </div>
        <div class="form-group">
          <label>{{ $t('Categories.Selected-Brand') }}</label>
          <input class="form-input" :value="form.brand_id" readonly />
        </div>

        <div class="form-group">
          <label>{{ $t('Categories.Image') }}</label>
          <div class="file-input-wrapper">
            <input type="file" @change="onFileChange" accept="image/*" required class="form-input file-input" />
          </div>
        </div>

        <div v-if="imagePreview" class="image-preview-container">
          <p class="preview-title">{{ $t('Categories.ImagePreview') }}</p>
          <div class="image-preview">
            <img :src="imagePreview" alt="Image Preview" />
          </div>
        </div>

        <button type="submit" class="submit-button">{{ $t('Categories.CreateButton') }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateCategory',
  data() {
    return {
      form: {
        name: '',
        name_ar: '',
        description: '',
        description_ar: '',
        brand_id: '',
        image: null,
      },
      imagePreview: null,
      brands: [],
      successMessage: '',
      errorMessage: '',
      loading: false,
    }
  },
  created() {
    this.fetchBrands()
  },
  methods: {
    async fetchBrands() {
      try {
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (tokenData?.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        }

        const response = await axios.get('https://backend.webenia.org/api/brands')


        if (response.data.status) {
          const data = response.data.data
          this.brands = Array.isArray(data) ? data : [data]
        } else {
          throw new Error(response.data.message || 'Failed to fetch brands')
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
        alert('Failed to load brands')
      }
    },

    onFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.image = file
        this.imagePreview = URL.createObjectURL(file)
      } else {
        this.form.image = null
        this.imagePreview = null
      }
    },

    async submitCategory() {
      this.successMessage = '';
      this.errorMessage = '';
      this.loading = true;
      try {
        const formData = new FormData()
        formData.append('name_en', this.form.name)
        formData.append('name_ar', this.form.name_ar)
        formData.append('description_en', this.form.description)
        formData.append('description_ar', this.form.description_ar)
        formData.append('brand_id', this.form.brand_id)
        if (this.form.image) {
          formData.append('image', this.form.image)
        }

        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (tokenData?.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        }

        const response = await axios.post('https://backend.webenia.org/api/categories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.data?.status && response.data?.data) {
          this.loading = false;
          this.successMessage = 'Category created successfully!';
          this.form = {
            name: '',
            name_ar: '',
            description: '',
            description_ar: '',
            brand_id: '',
            image: null,
          }
          this.imagePreview = null;
          setTimeout(() => {
            this.$router.push('/categories');
          }, 1500);
        } else {
          throw new Error(response.data?.message || 'Failed to create category')
        }
      } catch (error) {
        this.loading = false;
        this.errorMessage = error.response?.data?.message || error.message || 'An error occurred while creating the category.'
      }
    },
  },
}
</script>

<style scoped>
.category-create {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.form-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
}

.form-title {
  color: #8b6b3d;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus {
  border-color: #8b6b3d;
  box-shadow: 0 0 0 2px rgba(139, 107, 61, 0.1);
  outline: none;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
}

.file-input-wrapper {
  position: relative;
}

.file-input {
  cursor: pointer;
}

.image-preview-container {
  margin-top: 1.5rem;
}

.preview-title {
  color: #666;
  margin-bottom: 0.5rem;
}

.image-preview {
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.submit-button {
  background-color: #8b6b3d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 1.5rem;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #725932;
}

.submit-button:active {
  transform: translateY(1px);
}

.success-message {
  color: #388e3c;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #e0e0e0;
  border-top: 5px solid #8b6b3d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
