<template>
  <Header />
  <div class="profile-outer">
    <div v-if="loading" class="profile-loading">
      <span class="loader"></span>
      <span>{{ $t('profile.loading') }}</span>
    </div>
    <div v-else-if="error" class="profile-error">
      <span>{{ error }}</span>
    </div>
    <div v-else class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <span>{{ user.name ? user.name.charAt(0).toUpperCase() : '?' }}</span>
        </div>
        <div class="user-info">
          <h1>{{ user.name }}</h1>
          <span class="user-role">{{ user.role }}</span>
        </div>
        <button class="reset-password-btn" @click="goToResetPassword">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 15v2m0 0v2m0-2h2m-2 0H10m8-6a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ $t('profile.resetPassword') }}
        </button>
      </div>
      <div class="profile-details">
        <div class="detail-row">
          <span>{{ $t('profile.name') }}</span>
          <span>{{ user.name }}</span>
        </div>
        <div class="detail-row">
          <span>{{ $t('profile.email') }}</span>
          <span>{{ user.email }}</span>
        </div>
      
        <div class="detail-row">
          <span>{{ $t('profile.phone') }}</span>
          <span>{{ user.phone }}</span>
        </div>
       
       
        <div v-if="user.address && user.address.length" class="address-block">
          <h3>{{ $t('profile.address') }}</h3>
          <div class="address-details">
            <div class="detail-row"><span>{{ $t('profile.buildingName') }}</span><span>{{ user.address[0].building_name }}</span></div>
            <div class="detail-row"><span>{{ $t('profile.floorNumber') }}</span><span>{{ user.address[0].floor_number }}</span></div>
            <div class="detail-row"><span>{{ $t('profile.apartmentNumber') }}</span><span>{{ user.address[0].apartment_number }}</span></div>
            <div class="detail-row"><span>{{ $t('profile.postalCode') }}</span><span>{{ user.address[0].postal_code }}</span></div>
            <div class="detail-row"><span>{{ $t('profile.landmark') }}</span><span>{{ user.address[0].landmark }}</span></div>
            <div class="detail-row"><span>{{ $t('profile.cityId') }}</span><span>{{ user.address[0].city_id }}</span></div>
            <div class="detail-row"><span>{{ $t('profile.countryId') }}</span><span>{{ user.address[0].country_id }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Website/Header.vue'

export default {
  components: { Header },
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
    },
    goToResetPassword() {
      this.$router.push({ name: 'ResetPassword', query: { email: this.user.email } });
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
.profile-outer {
  min-height: 100vh;
  background: var(--background-color-base, #F4F4F8);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}
.profile-loading, .profile-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  color: var(--el-color-primary, #232946);
  font-size: 1.2em;
}
.loader {
  border: 4px solid #eee;
  border-top: 4px solid var(--el-color-primary, #232946);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.profile-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(35,41,70,0.08);
  max-width: 480px;
  width: 100%;
  padding: 32px 28px 28px 28px;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--el-color-primary-light-9, #B8C1EC);
  padding-bottom: 18px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--el-color-primary-light-9, #B8C1EC);
  color: var(--el-color-primary, #232946);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2em;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(35,41,70,0.08);
}
.user-info h1 {
  margin: 0;
  font-size: 1.5em;
  color: var(--el-color-primary, #232946);
}
.user-role {
  display: inline-block;
  margin-top: 6px;
  padding: 2px 14px;
  background: var(--el-accent-color, #E9B949);
  color: #fff;
  border-radius: 12px;
  font-size: 0.95em;
  font-weight: 500;
  letter-spacing: 0.5px;
}
.reset-password-btn {
  margin-left: auto;
  background: var(--el-color-primary, #232946);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}
.reset-password-btn:hover {
  background: var(--el-color-primary-dark, #121629);
}
.profile-details {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1.05em;
}
.detail-row span:first-child {
  color: var(--el-text-color-secondary, #4A4E69);
  font-weight: 500;
}
.detail-row span:last-child {
  color: var(--el-text-color-primary, #232946);
}
.address-block {
  margin-top: 18px;
  background: var(--el-color-primary-light-9, #B8C1EC);
  border-radius: 10px;
  padding: 14px 16px;
}
.address-block h3 {
  margin: 0 0 10px 0;
  color: var(--el-color-primary, #232946);
  font-size: 1.1em;
  font-weight: 600;
}
.address-details .detail-row {
  border-bottom: none;
  padding: 4px 0;
  font-size: 0.98em;
}
@media (max-width: 600px) {
  .profile-outer {
    padding: 16px 0;
  }
  .profile-card {
    max-width: 100%;
    padding: 18px 8px 16px 8px;
    margin-top: 16px;
    border-radius: 10px;
  }
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 10px;
  }
  .avatar {
    width: 48px;
    height: 48px;
    font-size: 1.3em;
  }
  .user-info h1 {
    font-size: 1.1em;
  }
  .reset-password-btn {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
    justify-content: center;
    padding: 8px 0;
  }
  .profile-details {
    gap: 6px;
  }
  .detail-row {
    font-size: 0.98em;
    flex-direction: column;
    gap: 2px;
    padding: 6px 0;
  }
  .address-block {
    padding: 8px 6px;
    border-radius: 6px;
  }
  .address-block h3 {
    font-size: 1em;
  }
}
@media (max-width: 400px) {
  .profile-card {
    padding: 8px 2px 8px 2px;
  }
}
</style>
