<template>
  <div class="category-details-container">
    <div class="header">
      <h2>Category Details</h2>
      <el-button type="primary" @click="$router.push('/categories')">Back to Categories</el-button>
    </div>

    <el-card v-if="category" class="category-card">
      <div class="category-content">
        <div class="image-section">
          <el-image
            v-if="category.image"
            :src="category.image"
            fit="cover"
            class="category-image"
            :preview-src-list="[category.image]"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
                <span>Image not available</span>
              </div>
            </template>
          </el-image>
        </div>

        <div class="info-section">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <div class="info-group">
                <h3>English Information</h3>
                <div class="info-item">
                  <label>Name:</label>
                  <span>{{ category.name }}</span>
                </div>
                <div class="info-item">
                  <label>Description:</label>
                  <p>{{ category.description || 'No description available' }}</p>
                </div>
              </div>
            </el-col>

            <el-col :xs="24" :sm="12">
              <div class="info-group arabic-section" dir="rtl">
                <h3 class="arabic-text">المعلومات العربية</h3>
                <div class="info-item">
                  <label class="arabic-text">الاسم:</label>
                  <span class="arabic-text">{{ category.name_ar || 'غير متوفر' }}</span>
                </div>
                <div class="info-item">
                  <label class="arabic-text">الوصف:</label>
                  <p class="arabic-text">{{ category.description_ar || 'لا يوجد وصف متوفر' }}</p>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="metadata-section">
            <h3>Additional Information</h3>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <div class="info-item">
                  <label>Created At:</label>
                  <span>{{ formatDate(category.created_at) }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12">
                <div class="info-item">
                  <label>Last Updated:</label>
                  <span>{{ formatDate(category.updated_at) }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-card>

    <div v-else class="loading-state">
      <el-skeleton :rows="3" animated />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Picture } from '@element-plus/icons-vue'

const route = useRoute()
const category = ref(null)

const fetchCategory = async () => {
  try {
    // Simulated API call - replace with actual API endpoint
    const response = await fetch(`/api/categories/${route.params.id}`)
    category.value = await response.json()
  } catch (error) {
    console.error('Error fetching category:', error)
    ElMessage.error('Failed to load category details')
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchCategory()
})
</script>

<style scoped>
.category-details-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.category-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.category-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.image-section {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.category-image {
  width: 100%;
  max-width: 400px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  font-size: 14px;
}

.info-section {
  padding: 0 1rem;
}

.info-group {
  margin-bottom: 2rem;
}

.info-group h3 {
  margin-bottom: 1rem;
  color: #303133;
  font-size: 1.2rem;
}

.info-item {
  margin-bottom: 1rem;
}

.info-item label {
  font-weight: bold;
  color: #606266;
  margin-right: 0.5rem;
}

.info-item p {
  margin: 0.5rem 0;
  line-height: 1.5;
  color: #303133;
}

.metadata-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ebeef5;
}

.arabic-text {
  font-family: 'Noto Sans Arabic', 'Noto Kufi Arabic', 'Arial', sans-serif;
  line-height: 1.6;
}

.arabic-section {
  text-align: right;
}

.arabic-section .info-item {
  display: flex;
  flex-direction: row-reverse;
  gap: 0.5rem;
}

.arabic-section label {
  margin-right: 0;
  margin-left: 0.5rem;
}

.loading-state {
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (min-width: 768px) {
  .category-content {
    flex-direction: row;
  }

  .image-section {
    flex: 0 0 40%;
  }

  .info-section {
    flex: 1;
  }
}

/* RTL Support */
[dir="rtl"] .header {
  flex-direction: row-reverse;
}

[dir="rtl"] .info-item label {
  margin-right: 0;
  margin-left: 0.5rem;
}
</style>