<template>
  <div class="brands-container">
    <div class="header">
      <h1 class="text-2xl font-bold text-gray-800">Brands Management</h1>
      <el-button
        type="primary"
        @click="openCreateDialog"
        class="add-brand-btn"
      >
        <el-icon class="mr-2"><Plus /></el-icon>
        Add New Brand
      </el-button>
    </div>

    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else class="table-container">
      <el-table
        :data="brands"
        style="width: 100%"
        :border="true"
        v-loading="loading"
      >
        <el-table-column label="Logo " min-width="200" :resizable="true">
          <template #default="scope">
            <div class="d-flex align-center brand-name">
              <div class="brand-logo-container" @click="previewImage(scope.row)">
                <el-avatar :size="120" class="brand-logo">
                  <el-image
                    v-if="scope.row.media && scope.row.media.length > 0"
                    :src="scope.row.media[0].original_url"
                   
                    class="logo-img"
                    :preview-src-list="[scope.row.media[0].original_url]"
                  />
                  <el-icon v-else size="24" color="#909399"><Picture /></el-icon>
                </el-avatar>
                <div class="logo-overlay">
                  <el-icon><ZoomIn /></el-icon>
                </div>
              </div>
             
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="name_ar" label="Name (AR)" min-width="150" :resizable="true">
          <template #default="scope">
            <div class="text-right arabic-text" dir="rtl">
              {{ scope.row.name_ar || 'N/A' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="description_en" label="Description (EN)" min-width="200" :resizable="true">
          <template #default="scope">
            <div class="description-cell">
              {{ scope.row.description_en || 'N/A' }}
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
              <el-tooltip content="Edit Brand" placement="top">
                <el-button
                  type="primary"
                  size="small"
                  class="action-button"
                  @click="editItem(scope.row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Delete Brand" placement="top">
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
        v-if="!loading && brands.length === 0"
        description="No brands found"
      />
    </div>

    <!-- Brand Form Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? 'Create New Brand' : 'Edit Brand'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="brandForm"
        :model="brandForm"
        :rules="formRules"
        label-position="top"
      >
        <el-form-item label="Brand Logo" prop="logo">
          <el-upload
            class="logo-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleLogoChange"
          >
            <el-image
              v-if="brandForm.logo"
              :src="brandForm.logo"
              class="logo-preview"
            />
            <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Name (English)" prop="name_en">
              <el-input v-model="brandForm.name_en" placeholder="Enter brand name in English" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Name (Arabic)" prop="name_ar">
              <el-input v-model="brandForm.name_ar" placeholder="Enter brand name in Arabic" dir="rtl" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Description (English)" prop="description_en">
              <el-input
                v-model="brandForm.description_en"
                type="textarea"
                :rows="3"
                placeholder="Enter brand description in English"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Description (Arabic)" prop="description_ar">
              <el-input
                v-model="brandForm.description_ar"
                type="textarea"
                :rows="3"
                placeholder="Enter brand description in Arabic"
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
      title="Delete Brand"
      width="400px"
      :close-on-click-modal="false"
    >
      <p>Are you sure you want to delete this brand? This action cannot be undone.</p>
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

<script>
import axios from 'axios';
import { Edit, Delete, Plus, Picture, ZoomIn } from '@element-plus/icons-vue';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://ecommers.test/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if token is invalid
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  name: 'Brands',
  components: {
    Edit,
    Delete,
    Plus,
    Picture,
    ZoomIn
  },
  data() {
    return {
      brands: [],
      loading: true,
      dialogVisible: false,
      deleteDialogVisible: false,
      dialogType: 'create',
      submitting: false,
      deleting: false,
      selectedBrand: null,
      brandForm: {
        logo: '',
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: ''
      },
      formRules: {
        name_en: [
          { required: true, message: 'Please enter brand name in English', trigger: 'blur' }
        ],
        name_ar: [
          { required: true, message: 'Please enter brand name in Arabic', trigger: 'blur' }
        ],
        description_en: [
          { required: true, message: 'Please enter brand description in English', trigger: 'blur' }
        ],
        description_ar: [
          { required: true, message: 'Please enter brand description in Arabic', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.fetchBrands();
  },
  methods: {
    async fetchBrands() {
      try {
        this.loading = true;
        console.log('Fetching brands...');
        
        // Get token and verify it exists
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          this.$message.error('Authentication token not found. Please login again.');
          window.location.href = '/login';
          return;
        }

        // Log the request details
        console.log('Making API request with token:', token.substring(0, 10) + '...');
        
        const response = await api.get('/brands');
        console.log('API Response:', response);

        if (!response.data) {
          console.error('No data in response');
          this.$message.error('No data received from server');
          return;
        }

        if (response.data.status) {
          console.log('Brands data:', response.data.data);
          this.brands = response.data.data;
        } else {
          console.warn('API returned false status:', response.data);
          this.$message.warning('No brands found');
        }
      } catch (error) {
        console.error('Failed to fetch brands:', error);
        
        // Handle specific error cases
        if (error.response) {
          console.error('Error response:', error.response);
          
          if (error.response.status === 401) {
            this.$message.error('Session expired. Please login again.');
            window.location.href = '/login';
          } else if (error.response.status === 403) {
            this.$message.error('You do not have permission to view brands');
          } else if (error.response.status === 404) {
            this.$message.error('Brands endpoint not found');
          } else if (error.response.data?.message) {
            this.$message.error(error.response.data.message);
          } else {
            this.$message.error('Failed to fetch brands. Please try again later.');
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          this.$message.error('No response from server. Please check your connection.');
        } else {
          console.error('Error setting up request:', error.message);
          this.$message.error('Error setting up request: ' + error.message);
        }
      } finally {
        this.loading = false;
      }
    },
    openCreateDialog() {
      this.dialogType = 'create';
      this.brandForm = {
        logo: '',
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: ''
      };
      this.dialogVisible = true;
    },
    editItem(item) {
      this.dialogType = 'edit';
      this.selectedBrand = item;
      this.brandForm = { ...item };
      this.dialogVisible = true;
    },
    deleteItem(item) {
      this.selectedBrand = item;
      this.deleteDialogVisible = true;
    },
    handleLogoChange(file) {
      if (file) {
        // Create a URL for the selected file
        const reader = new FileReader();
        reader.onload = (e) => {
          this.brandForm.logo = e.target.result;
        };
        reader.readAsDataURL(file.raw);
      }
    },
    async submitForm() {
      try {
        await this.$refs.brandForm.validate();
        this.submitting = true;

        const formData = new FormData();
        formData.append('name_en', this.brandForm.name_en);
        formData.append('name_ar', this.brandForm.name_ar);
        formData.append('description_en', this.brandForm.description_en || '');
        formData.append('description_ar', this.brandForm.description_ar || '');
        
        if (this.brandForm.logo instanceof File) {
          formData.append('logo', this.brandForm.logo);
        } else if (this.brandForm.logo && typeof this.brandForm.logo === 'string') {
          const response = await fetch(this.brandForm.logo);
          const blob = await response.blob();
          const file = new File([blob], 'logo.png', { type: 'image/png' });
          formData.append('logo', file);
        }

        const url = this.dialogType === 'create' ? '/brands' : `/brands/${this.selectedBrand.id}`;
        const method = this.dialogType === 'create' ? 'post' : 'put';

        await api[method](url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.$message.success(`Brand ${this.dialogType === 'create' ? 'created' : 'updated'} successfully`);
        this.dialogVisible = false;
        this.fetchBrands();
      } catch (error) {
        console.error('Error saving brand:', error);
        if (error.response?.data?.errors) {
          Object.values(error.response.data.errors).forEach(errors => {
            this.$message.error(errors[0]);
          });
        } else {
          this.$message.error('Failed to save brand');
        }
      } finally {
        this.submitting = false;
      }
    },
    async confirmDelete() {
      try {
        this.deleting = true;
        await api.delete(`/brands/${this.selectedBrand.id}`);
        this.$message.success('Brand deleted successfully');
        this.deleteDialogVisible = false;
        this.fetchBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
        this.$message.error('Failed to delete brand');
      } finally {
        this.deleting = false;
      }
    },
    async deleteImage(brand) {
      try {
        if (!brand.media || brand.media.length === 0) return;

        const mediaId = brand.media[0].id;
        await api.delete(`/media/${mediaId}`);

        await api.put(`/brands/${brand.id}`, {
          name_en: brand.name_en,
          name_ar: brand.name_ar,
          description_en: brand.description_en,
          description_ar: brand.description_ar,
          logo: null
        });

        this.$message.success('Image deleted successfully');
        this.fetchBrands();
      } catch (error) {
        console.error('Error deleting image:', error);
        this.$message.error('Failed to delete image');
      }
    }
  }
};
</script>

<style scoped>
.brands-container {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.add-brand-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  height: auto;
  font-weight: 500;
}

.add-brand-btn .el-icon {
  margin-right: 8px;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.brand-name {
  padding: 12px 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logo-container {
  position: relative;
  margin-right: 16px;
 
  cursor: pointer;
  transition: all 0.3s ease;
}

.brand-logo {
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  width: 60px !important;
  height: 60px !important;
}

.brand-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.logo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(239, 68, 68, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 10px;
  cursor: pointer;
}

.brand-logo-container:hover .logo-overlay {
  opacity: 1;
}

.logo-overlay .el-icon {
  color: white;
  font-size: 24px;
  transition: transform 0.3s ease;
}

.brand-logo-container:hover .logo-overlay .el-icon {
  transform: scale(1.2);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.brand-text {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
  line-height: 1.4;
}

.arabic-text {
  font-family: 'Noto Sans Arabic', sans-serif;
  color: #1e293b;
  font-size: 0.875rem;
  line-height: 1.4;
}

.description-cell {
  max-width: none;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  color: #64748b;
  font-weight: 400;
  line-height: 1.5;
  word-break: break-word;
  text-align: left;
  font-size: 0.875rem;
  padding: 8px 0;
}

.button-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button.primary:hover {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.action-button.danger:hover {
  background-color: #ef4444;
  border-color: #ef4444;
}

.action-button .el-icon {
  font-size: 16px;
}

.loading-state {
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.el-table) {
  --el-table-border-color: #e2e8f0;
  --el-table-header-bg-color: #ffffff;
  --el-table-row-hover-bg-color: #f8fafc;
  --el-table-text-color: #1e293b;
  --el-table-header-text-color: #475569;
  --el-table-border: 1px solid #e2e8f0;
  width: 100% !important;
  table-layout: fixed;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.el-table__header) {
  background-color: #ffffff !important;
}

:deep(.el-table__header-wrapper) {
  border-bottom: 2px solid #e2e8f0;
}

:deep(.el-table th) {
  background-color: #ffffff !important;
  color: #475569 !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  padding: 16px !important;
  white-space: normal !important;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
}

:deep(.el-table td) {
  padding: 16px !important;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: normal !important;
  word-break: break-word;
  vertical-align: middle;
  line-height: 1.4;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.el-table__row) {
  height: auto !important;
  transition: all 0.2s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f8fafc !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.el-table__body-wrapper) {
  overflow-x: visible !important;
}

:deep(.el-table__body) {
  width: 100% !important;
}

.bottom-add-button {
  display: none;
}

.logo-uploader {
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.logo-uploader:hover {
  border-color: #3b82f6;
  background-color: #f0f7ff;
  transform: scale(1.02);
}

.logo-uploader-icon {
  font-size: 32px;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.logo-uploader:hover .logo-uploader-icon {
  color: #3b82f6;
  transform: scale(1.1);
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.logo-preview:hover {
  transform: scale(1.05);
}

.logo-uploader :deep(.el-upload) {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-uploader :deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

@media screen and (max-width: 1200px) {
  .brands-container {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header h1 {
    font-size: 1.25rem;
  }

  .add-brand-btn {
    width: 100%;
    justify-content: center;
  }

  :deep(.el-table) {
    font-size: 0.8125rem;
  }

  :deep(.el-table td),
  :deep(.el-table th) {
    padding: 12px !important;
  }

  .brand-logo {
    width: 50px !important;
    height: 50px !important;
  }

  .logo-overlay .el-icon {
    font-size: 20px;
  }
}

@media screen and (max-width: 768px) {
  .brands-container {
    padding: 12px;
  }

  .table-container {
    padding: 12px;
  }

  .header {
    padding: 12px;
  }

  :deep(.el-table) {
    font-size: 0.75rem;
  }

  :deep(.el-table td),
  :deep(.el-table th) {
    padding: 10px !important;
  }

  .brand-logo {
    width: 45px !important;
    height: 45px !important;
  }

  .logo-overlay .el-icon {
    font-size: 18px;
  }

  .logo-uploader {
    width: 120px;
    height: 120px;
  }

  .action-button {
    width: 28px;
    height: 28px;
  }
}

@media screen and (max-width: 480px) {
  .brands-container {
    padding: 8px;
  }

  .table-container {
    padding: 8px;
  }

  .header {
    padding: 8px;
  }

  .header h1 {
    font-size: 1rem;
  }

  :deep(.el-table) {
    font-size: 0.6875rem;
  }

  :deep(.el-table td),
  :deep(.el-table th) {
    padding: 8px !important;
  }

  .brand-logo {
    width: 40px !important;
    height: 40px !important;
  }

  .logo-overlay .el-icon {
    font-size: 16px;
  }

  .logo-uploader {
    width: 100px;
    height: 100px;
  }

  .action-button {
    width: 24px;
    height: 24px;
  }
}
</style>
