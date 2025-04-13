<template>
  <div class="categories-container">
    <div class="header">
      <h1 class="text-2xl font-bold text-gray-800">Categories Management</h1>
      <el-button
        type="primary"
        @click="openCreateDialog"
        class="add-category-btn"
      >
        <el-icon class="mr-2"><Plus /></el-icon>
        Add New Category
      </el-button>
    </div>

    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else class="table-container">
      <el-table
        :data="categories"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column label="Image" min-width="200" :resizable="true">
          <template #default="scope">
            <div class="d-flex align-center category-name">
              <div class="category-image-container" @click="previewImage(scope.row)">
                <el-avatar :size="120" class="category-image">
                  <el-image
                    v-if="scope.row.image"
                    :src="scope.row.image"
                    class="image-img"
                    :preview-src-list="[scope.row.image]"
                  />
                  <el-icon v-else size="24" color="#909399"><Picture /></el-icon>
                </el-avatar>
                <div class="image-overlay">
                  <el-icon><ZoomIn /></el-icon>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Name (EN)" min-width="150" :resizable="true" />

        <el-table-column prop="brand.name" label="Brand" min-width="150" :resizable="true">
          <template #default="scope">
            {{ scope.row.brand?.name || 'N/A' }}
          </template>
        </el-table-column>

        <el-table-column prop="name_ar" label="Name (AR)" min-width="150" :resizable="true">
          <template #default="scope">
            <div class="text-right arabic-text" dir="rtl">
              {{ scope.row.name_ar || 'N/A' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="Description (EN)" min-width="200" :resizable="true">
          <template #default="scope">
            <div class="description-cell">
              {{ scope.row.description || 'N/A' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="description_ar" label="Description (AR)" min-width="200" :resizable="true">
          <template #default="scope">
            <div class="text-right arabic-text" dir="rtl">
              {{ scope.row.description_ar || 'N/A' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="100" fixed="right">
          <template #default="scope">
            <div class="button-group">
              <el-tooltip content="View Details" placement="top">
                <el-button
                  type="info"
                  size="small"
                  class="action-button"
                  @click="$router.push(`/categories/${scope.row.id}`)"
                >
                  <el-icon><View /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Edit Category" placement="top">
                <el-button
                  type="primary"
                  size="small"
                  class="action-button"
                  @click="editItem(scope.row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Delete Category" placement="top">
                <el-button
                  type="danger"
                  size="small"
                  class="action-button"
                  @click="deleteItem(scope.row)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Empty State -->
      <el-empty
        v-if="!loading && categories.length === 0"
        description="No categories found"
      />
    </div>

    <!-- Category Form Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? 'Create New Category' : 'Edit Category'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="formRules"
        label-position="top"
      >
        <el-form-item label="Category Image" prop="image">
          <el-upload
            class="image-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImageChange"
          >
            <el-image
              v-if="categoryForm.image"
              :src="categoryForm.image"
              class="image-preview"
            />
            <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Brand" prop="brand_id">
              <el-select
                v-model="categoryForm.brand_id"
                placeholder="Select a brand"
                :loading="loadingBrands"
              >
                <el-option
                  v-for="brand in brands"
                  :key="brand.id"
                  :label="brand.name"
                  :value="brand.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Name (English)" prop="name">
              <el-input v-model="categoryForm.name" placeholder="Enter category name in English" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Name (Arabic)" prop="name_ar">
              <el-input v-model="categoryForm.name_ar" placeholder="Enter category name in Arabic" dir="rtl" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Description (English)" prop="description">
              <el-input
                v-model="categoryForm.description"
                type="textarea"
                :rows="3"
                placeholder="Enter category description in English"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Description (Arabic)" prop="description_ar">
              <el-input
                v-model="categoryForm.description_ar"
                type="textarea"
                :rows="3"
                placeholder="Enter category description in Arabic"
                dir="rtl"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ dialogType === 'create' ? 'Create' : 'Update' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Delete Confirmation Dialog -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="Delete Category"
      width="400px"
      :close-on-click-modal="false"
    >
      <p>Are you sure you want to delete this category? This action cannot be undone.</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">Cancel</el-button>
          <el-button type="danger" @click="confirmDelete" :loading="deleting">
            Delete
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Plus, Edit, Delete, Picture, ZoomIn, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const store = useStore()
const categories = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('create')
const deleteDialogVisible = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const selectedItem = ref(null)

const categoryFormRef = ref(null)
const brands = ref([])
const loadingBrands = ref(false)

const categoryForm = ref({
  name: '',
  name_ar: '',
  description: '',
  description_ar: '',
  image: null,
  brand_id: null
})

const formRules = {
  name: [{ required: true, message: 'Please enter category name in English', trigger: 'blur' }],
  name_ar: [{ required: true, message: 'Please enter category name in Arabic', trigger: 'blur' }],
  brand_id: [{ required: true, message: 'Please select a brand', trigger: 'change' }]
}

const fetchBrands = async () => {
  loadingBrands.value = true
  try {
    brands.value = await store.dispatch('brands/fetchBrands')
  } catch (error) {
    ElMessage.error(error.message || 'Failed to fetch brands')
  } finally {
    loadingBrands.value = false
  }
}

const fetchCategories = async () => {
  loading.value = true
  try {
    categories.value = await store.dispatch('categories/fetchCategories')
  } catch (error) {
    ElMessage.error(error.message || 'Failed to fetch categories')
  } finally {
    loading.value = false
  }
}

const handleImageChange = (file) => {
  categoryForm.value.image = URL.createObjectURL(file.raw)
}

// Inside openCreateDialog function
const openCreateDialog = () => {
  dialogType.value = 'create'
  categoryForm.value = {
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    image: null,
    brand_id: null
  }
  dialogVisible.value = true
}

// Inside editItem function
const editItem = (item) => {
  dialogType.value = 'edit'
  selectedItem.value = item
  categoryForm.value = {
    name: item.name,
    name_ar: item.name_ar,
    description: item.description,
    description_ar: item.description_ar,
    image: item.image,
    brand_id: item.brand_id
  }
  dialogVisible.value = true
}

const deleteItem = (item) => {
  selectedItem.value = item
  deleteDialogVisible.value = true
}

const submitForm = async () => {
  if (!categoryFormRef.value) return

  await categoryFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'create') {
          await store.dispatch('categories/createCategory', categoryForm.value)
          ElMessage.success('Category created successfully')
        } else {
          await store.dispatch('categories/updateCategory', {
            id: selectedItem.value.id,
            ...categoryForm.value
          })
          ElMessage.success('Category updated successfully')
        }
        dialogVisible.value = false
        fetchCategories()
      } catch (error) {
        ElMessage.error(error.message || 'Operation failed')
      } finally {
        submitting.value = false
      }
    }
  })
}

const confirmDelete = async () => {
  if (!selectedItem.value) return

  deleting.value = true
  try {
    await store.dispatch('categories/deleteCategory', selectedItem.value.id)
    ElMessage.success('Category deleted successfully')
    deleteDialogVisible.value = false
    fetchCategories()
  } catch (error) {
    ElMessage.error(error.message || 'Failed to delete category')
  } finally {
    deleting.value = false
  }
}

const previewImage = (row) => {
  if (row.image) {
    const images = document.querySelectorAll('.el-image__preview')
    images[0]?.click()
  }
}

onMounted(() => {
  fetchCategories()
  fetchBrands()
})
</script>

<style scoped>
.categories-container {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.table-container {
  background: #624a26;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  max-width: 100%;
}

.el-table {
  width: 100% !important;
  min-width: 900px;
}

.category-image-container {
  position: relative;
  cursor: pointer;
  max-width: 120px;
  margin: 0 auto;
}

.category-image {
  width: 100%;
  height: auto;
  max-width: 120px;
  max-height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.button-group {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  padding: 6px;
  min-width: 32px;
}

@media (max-width: 768px) {
  .categories-container {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    margin-bottom: 1.5rem;
  }

  .description-cell {
    max-width: 150px;
  }
}
.image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.category-image-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay .el-icon {
  color: #fff;
  font-size: 24px;
}

.description-cell {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arabic-text {
  font-family: 'Arial', sans-serif;
}

.button-group {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 8px;
}

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-uploader:hover {
  border-color: #409eff;
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.image-preview {
  width: 178px;
  height: 178px;
  object-fit: cover;
}

.loading-state {
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* RTL Support */
[dir="rtl"] .header {
  flex-direction: row-reverse;
}

[dir="rtl"] .button-group {
  flex-direction: row-reverse;
}
</style>