<template>
  <div class="profile-page">
    <div class="container">
      <h1 class="page-title">User Profile</h1>
      
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <img src="https://via.placeholder.com/100" alt="Profile Avatar">
          </div>
          <div class="profile-info">
            <h2>{{ user.name }}</h2>
            <p>{{ user.email }}</p>
            <p class="text-muted">Member since {{ formattedDate }}</p>
          </div>
        </div>

        <div class="profile-content">
          <div class="profile-section">
            <h3>Personal Information</h3>
            <form @submit.prevent="saveProfile">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" v-model="user.name" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="user.email" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" v-model="user.phone" class="form-control">
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
          
          <div class="profile-section">
            <h3>Change Password</h3>
            <form @submit.prevent="changePassword">
              <div class="form-group">
                <label for="current-password">Current Password</label>
                <input type="password" id="current-password" v-model="passwords.current" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="new-password">New Password</label>
                <input type="password" id="new-password" v-model="passwords.new" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="confirm-password">Confirm New Password</label>
                <input type="password" id="confirm-password" v-model="passwords.confirm" class="form-control">
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileView',
  data() {
    return {
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        joinDate: new Date('2023-01-15')
      },
      passwords: {
        current: '',
        new: '',
        confirm: ''
      }
    }
  },
  computed: {
    formattedDate() {
      return this.user.joinDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  methods: {
    saveProfile() {
      // TODO: Implement profile save functionality
      alert('Profile updated successfully!')
    },
    changePassword() {
      if (this.passwords.new !== this.passwords.confirm) {
        alert('New passwords do not match!')
        return
      }
      
      // TODO: Implement password change functionality
      alert('Password changed successfully!')
      this.passwords.current = ''
      this.passwords.new = ''
      this.passwords.confirm = ''
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 20px 0;
}

.page-title {
  margin-bottom: 30px;
  font-weight: 600;
}

.profile-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  padding: 30px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.profile-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.profile-info {
  margin-left: 20px;
}

.profile-info h2 {
  margin-bottom: 5px;
}

.text-muted {
  color: #6c757d;
}

.profile-content {
  padding: 30px;
}

.profile-section {
  margin-bottom: 40px;
}

.profile-section h3 {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-control {
  display: block;
  width: 100%;
  padding: 10px 15px;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-actions {
  margin-top: 30px;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 10px 20px;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 4px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  cursor: pointer;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  color: #fff;
  background-color: #0069d9;
  border-color: #0062cc;
}
</style> 