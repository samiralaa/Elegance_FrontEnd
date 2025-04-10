<template>
  <div class="categories">
    <!-- Header Section -->
    <div class="header">
      <h1>{{ $t('categories.title') }}</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ $t('categories.addCategory') }}
      </el-button>
    </div>

    <!-- Loading State -->
    <el-skeleton v-if="loading" :rows="5" animated />

    <!-- Data Table -->
    <el-table
      v-else
      :data="categories"
      style="width: 100%"
      border
      v-loading="loading"
    >
      <el-table-column
        prop="name"
        :label="$t('categories.name')"
        min-width="150"
        resizable
      >
        <template #default="{ row }">
          <div class="name-cell">
            {{ row.name || 'N/A' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="description"
        :label="$t('categories.description')"
        min-width="200"
        resizable
      >
        <template #default="{ row }">
          <div class="description-cell">
            {{ row.description || 'N/A' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('common.actions')"
        width="120"
        fixed="right"
      >
        <template #default="{ row }">
          <div class="actions">
            <el-tooltip :content="$t('common.edit')" placement="top">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(row)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('common.delete')" placement="top">
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(row)"
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
      v-if="!loading && !categories.length"
      :description="$t('common.noData')"
    />

    <!-- Category Form Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          :label="$t('categories.name')"
          prop="name"
        >
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item
          :label="$t('categories.description')"
          prop="description"
        >
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ $t('common.save') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Delete Confirmation Dialog -->
    <el-dialog
      v-model="deleteDialogVisible"
      :title="$t('common.warning')"
      width="500px"
    >
      <span>{{ $t('categories.deleteConfirm') }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="danger" @click="handleDeleteConfirm">
            {{ $t('common.yes') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// Store and i18n
const store = useStore()
const { t } = useI18n()

// State
const loading = ref(true)
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const formRef = ref(null)
const selectedId = ref(null)

// Form
const form = ref({
  name: '',
  description: ''
})

// Rules
const rules = {
  name: [
    { required: true, message: 'Category name is required', trigger: 'blur' }
  ]
}

// Computed
const categories = computed(() => store.state.categories?.items || [])
const dialogTitle = computed(() => 
  selectedId.value ? t('categories.editCategory') : t('categories.addCategory')
)

// Methods
const handleAdd = () => {
  selectedId.value = null
  form.value = { name: '', description: '' }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  selectedId.value = row.id
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  selectedId.value = row.id
  deleteDialogVisible.value = true
}

const handleCancel = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        if (selectedId.value) {
          await store.dispatch('categories/updateCategory', {
            id: selectedId.value,
            ...form.value
          })
          ElMessage.success(t('categories.updateSuccess'))
        } else {
          await store.dispatch('categories/createCategory', form.value)
          ElMessage.success(t('categories.createSuccess'))
        }
        dialogVisible.value = false
        await store.dispatch('categories/fetchCategories')
      } catch (error) {
        ElMessage.error(error.message || t('common.error.general'))
      } finally {
        loading.value = false
      }
    }
  })
}

const handleDeleteConfirm = async () => {
  try {
    loading.value = true
    await store.dispatch('categories/deleteCategory', selectedId.value)
    ElMessage.success(t('categories.deleteSuccess'))
    deleteDialogVisible.value = false
    await store.dispatch('categories/fetchCategories')
  } catch (error) {
    ElMessage.error(error.message || t('common.error.general'))
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await store.dispatch('categories/fetchCategories')
  } catch (error) {
    ElMessage.error(error.message || t('common.error.general'))
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.categories {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.name-cell {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.description-cell {
  color: var(--el-text-color-regular);
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
