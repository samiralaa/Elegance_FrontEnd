<template>
  <Header />
  <div v-if="loading">{{ $t('profile.loading') }}</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="profile-container">
    <div class="profile-header">
      <div class="user-info">
        <h1>{{ user.name }}</h1>
        <span class="user-role">{{ user.role }}</span>
      </div>
    </div>
    <div class="profile-details">
      <p><strong>{{ $t('profile.name') }}:</strong> {{ user.name }}</p>
      <p><strong>{{ $t('profile.email') }}:</strong> {{ user.email }}</p>
      <p><strong>{{ $t('profile.role') }}:</strong> {{ user.role }}</p>
      <p><strong>{{ $t('profile.phone') }}:</strong> {{ user.phone }}</p>
      <p><strong>{{ $t('profile.emailVerified') }}:</strong> {{ formatDate(user.email_verified_at) }}</p>
      <p><strong>{{ $t('profile.memberSince') }}:</strong> {{ formatDate(user.created_at) }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Website/Header.vue'

export default {
  components: {
    Header
  },
  data() {
    return {
      loading: true,
      error: null,
      user: {}
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    }
  },
  async created() {
    try {
      const response = await axios.get('api/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      this.user = response.data.data.user;
    } catch (err) {
      this.error = err.response?.data?.message || 'Failed to fetch profile';
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  background: var(--el-color-primary-light-9);
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info h1 {
  margin: 0;
  color: var(--el-color-primary);
  font-size: 2em;
}

.user-role {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 12px;
  background: var(--el-color-primary);
  color: white;
  border-radius: 20px;
  font-size: 0.9em;
}

.profile-details {
  background: var(--el-bg-color);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-details p {
  margin: 10px 0;
  font-size: 16px;
}

.profile-details strong {
  color: var(--el-text-color-primary);
  min-width: 150px;
  display: inline-block;
}
</style>
