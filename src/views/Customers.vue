<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">customers</h2>
      <div class="button-group">
        <el-button type="success" class="action-button" @click="showCreateDialog">
          <el-icon><Plus /></el-icon>
          <span>Create User</span>
        </el-button>
        <el-button type="primary" class="action-button" @click="loadCustomers">
          <el-icon><Refresh /></el-icon>
          <span>Refresh</span>
        </el-button>
      </div>
    </div>

    <!-- Error Alert -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      @close="clearError"
      class="mb-md"
    />

    <!-- Create User Dialog -->
    <el-dialog
      v-model="createDialogVisible"
      title="Create New User"
      width="500px"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="120px"
        class="form-container"
        @submit.prevent="handleCreate"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="createForm.name" placeholder="Enter name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="createForm.email" placeholder="Enter email" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="createForm.phone" placeholder="Enter phone number" />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="createForm.role" placeholder="Select role">
            <el-option label="Admin" value="admin" />
            <el-option label="User" value="user" />
            <el-option label="Manager" value="manager" />
          </el-select>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="createForm.password"
            type="password"
            placeholder="Enter password"
            show-password
          />
        </el-form-item>
        <el-form-item label="Confirm" prop="password_confirmation">
          <el-input
            v-model="createForm.password_confirmation"
            type="password"
            placeholder="Confirm password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="form-footer">
          <el-button @click="createDialogVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            :loading="isLoading"
            @click="handleCreate"
          >
            Create
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="card">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- Users Table -->
    <div v-else class="table-container">
      <el-table
        :data="usersList"
        style="width: 100%"
        :border="true"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Name" min-width="120" />
        <el-table-column prop="email" label="Email" min-width="180" />
        <el-table-column prop="phone" label="Phone" min-width="120" />
        <el-table-column prop="role" label="Role" width="120">
          <template #default="scope">
            <el-tag
              :type="getRoleType(scope.row.role)"
              class="status-tag"
            >
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="Created At" width="150">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="scope">
            <div class="button-group">
              <el-tooltip content="Edit User" placement="top">
                <el-button
                  type="primary"
                  size="small"
                  class="action-button"
                  @click="handleEdit(scope.row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Delete User" placement="top">
                <el-button
                  type="danger"
                  size="small"
                  class="action-button"
                  @click="handleDelete(scope.row)"
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
        v-if="!isLoading && usersList.length === 0"
        description="No users found"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Edit, Delete, Plus } from '@element-plus/icons-vue'
import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://testback.eleganceoud.com//api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'));
    if (tokenData?.token) {
      config.headers.Authorization = `Bearer ${tokenData.token}`;
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
      localStorage.removeItem('tokenData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default defineComponent({
  name: 'CustomersView',
  components: {
    Refresh,
    Edit,
    Delete,
    Plus
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const createFormRef = ref(null)
    const createDialogVisible = ref(false)
    const usersList = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const createForm = reactive({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      password: '',
      password_confirmation: ''
    })

    const createRules = {
      name: [
        { required: true, message: 'Please enter name', trigger: 'blur' },
        { min: 3, message: 'Name must be at least 3 characters', trigger: 'blur' }
      ],
      email: [
        { required: true, message: 'Please enter email', trigger: 'blur' },
        { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: 'Please enter phone number', trigger: 'blur' },
        { pattern: /^[0-9+\-\s()]*$/, message: 'Please enter a valid phone number', trigger: 'blur' }
      ],
      role: [
        { required: true, message: 'Please select role', trigger: 'change' }
      ],
      password: [
        { required: true, message: 'Please enter password', trigger: 'blur' },
        { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
      ],
      password_confirmation: [
        { required: true, message: 'Please confirm password', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== createForm.password) {
              callback(new Error('Passwords do not match'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    const getRoleType = (role) => {
      const types = {
        admin: 'danger',
        manager: 'warning',
        user: 'success'
      }
      return types[role] || 'info'
    }

    const showCreateDialog = () => {
      createDialogVisible.value = true
      createForm.name = ''
      createForm.email = ''
      createForm.phone = ''
      createForm.role = 'user'
      createForm.password = ''
      createForm.password_confirmation = ''
    }

    const handleCreate = async () => {
      if (!createFormRef.value) return

      try {
        await createFormRef.value.validate()
        isLoading.value = true

        const response = await api.post('/users', createForm)
        
        if (response.data.status) {
          ElMessage({
            message: 'User created successfully',
            type: 'success',
            duration: 2000
          })
          createDialogVisible.value = false
          loadCustomers()
        } else {
          throw new Error(response.data.message || 'Failed to create user')
        }
      } catch (err) {
        console.error('Error creating user:', err)
        ElMessage({
          message: err.response?.data?.message || 'Failed to create user',
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoading.value = false
      }
    }

    const loadCustomers = async () => {
      try {
        isLoading.value = true
        error.value = null

        // Get token data and log it for debugging
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        console.log('Token data:', tokenData)

        if (!tokenData?.token) {
          console.error('No token found')
          router.push('/login')
          return
        }

        // Log the request details
        console.log('Fetching customers with token:', tokenData.token)
        
        // Using Vuex store to load customers
        await store.dispatch('fetchCustomers')
        usersList.value = store.getters.getCustomers
        
        console.log('Customers loaded from store:', usersList.value)
      } catch (err) {
        console.error('Error loading customers:', err)
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        })
        
        error.value = err.response?.data?.message || 
                     err.message || 
                     'Failed to load customers'
        
        if (err.response?.status === 401) {
          localStorage.removeItem('tokenData')
          router.push('/login')
        }
      } finally {
        isLoading.value = false
      }
    }

    const handleEdit = async (user) => {
      try {
        const response = await api.put(`/users/${user.id}`, user)
        
        if (response.data.status) {
          ElMessage({
            message: 'User updated successfully',
            type: 'success',
            duration: 2000
          })
          loadCustomers()
        } else {
          throw new Error(response.data.message || 'Failed to update user')
        }
      } catch (err) {
        console.error('Error updating user:', err)
        ElMessage({
          message: err.response?.data?.message || 'Failed to update user',
          type: 'error',
          duration: 5000
        })
      }
    }

    const handleDelete = async (user) => {
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to delete user ${user.name}?`,
          'Warning',
          {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )

        const response = await api.delete(`/users/${user.id}`)
        
        if (response.data.status) {
          ElMessage({
            message: 'User deleted successfully',
            type: 'success',
            duration: 2000
          })
          loadCustomers()
        } else {
          throw new Error(response.data.message || 'Failed to delete user')
        }
      } catch (err) {
        if (err !== 'cancel') {
          console.error('Error deleting user:', err)
          ElMessage({
            message: err.response?.data?.message || 'Failed to delete user',
            type: 'error',
            duration: 5000
          })
        }
      }
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const clearError = () => {
      error.value = null
    }

    onMounted(() => {
      loadCustomers()
    })

    return {
      usersList,
      isLoading,
      error,
      loadCustomers,
      handleEdit,
      handleDelete,
      formatDate,
      clearError,
      createDialogVisible,
      createForm,
      createRules,
      createFormRef,
      showCreateDialog,
      handleCreate,
      getRoleType
    }
  }
})
</script>

<style>
@import '../assets/styles/variables.css';
@import '../assets/styles/common.css';

/* Additional component-specific styles if needed */
:deep(.el-select) {
  width: 100%;
}

:deep(.el-tag) {
  text-transform: capitalize;
}

.empty-state {
  padding: var(--spacing-xl) 0;
  text-align: center;
}
</style> 