<template>
    <div>
      <form @submit.prevent="submitCategory">
        <div>
          <label>Name (EN):</label>
          <input v-model="form.name" required />
        </div>
        <div>
          <label>Name (AR):</label>
          <input v-model="form.name_ar" required />
        </div>
        <div>
          <label>Description (EN):</label>
          <textarea v-model="form.description" required></textarea>
        </div>
        <div>
          <label>Description (AR):</label>
          <textarea v-model="form.description_ar" required></textarea>
        </div>
        <div>
          <label>Brand:</label>
          <select v-model="form.brand_id" required>
            <option disabled value="">-- Select a brand --</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name_en }}
            </option>
          </select>
        </div>
        <div>
          <label>Image:</label>
          <input type="file" @change="onFileChange" accept="image/*" required />
        </div>
        <div v-if="imagePreview">
          <p>Image Preview:</p>
          <img :src="imagePreview" alt="Image Preview" style="max-width: 200px; margin-top: 10px;" />
        </div>
        <button type="submit">Create Category</button>
      </form>
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
  
          const response = await axios.get('https://elegance_commers.test/api/brands')
  
          if (response.data.status) {
            const data = response.data.data
            // Ensure brands is always an array
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
  
          const response = await axios.post('https://elegance_commers.test/api/categories', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
  
          if (response.data?.status && response.data?.data) {
            alert('Category created successfully!')
            this.form = {
              name: '',
              name_ar: '',
              description: '',
              description_ar: '',
              brand_id: '',
              image: null,
            }
            this.imagePreview = null
          } else {
            throw new Error(response.data?.message || 'Failed to create category')
          }
        } catch (error) {
          console.error('Error creating category:', error)
          alert(error.message || 'An error occurred while creating the category.')
        }
      },
    },
  }
  </script>
  
  <style scoped>
  form {
    max-width: 500px;
    margin: auto;
  }
  form div {
    margin-bottom: 15px;
  }
  </style>
  