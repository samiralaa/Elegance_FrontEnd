<template>
  <div v-if="isAuthenticated" class="dashboard-container" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Sidebar -->
    <aside class="dashboard-sidebar" :class="{ open: isSidebarOpen, 'sidebar-mobile': isMobile }">
      <!-- Brand Section -->
      <div class="brand-section">
        <div class="brand-logo">
          <div class="brand-icon">E</div>
          <div class="brand-text">
            <span class="brand-name">Elegance</span>
            <span class="brand-tagline">{{ $t('common.brand.tagline') }}</span>
          </div>
        </div>
      </div>
      <!-- Menu Navigation -->
      <nav class="sidebar-menu">
        <!-- Main Navigation -->
        <template v-for="item in mainMenuItems" :key="item.path || item.name">
          <div v-if="item.children" class="menu-item-group">
            <div class="menu-item" @click="toggleDropdown(item)" :class="{ active: isDropdownOpen(item) }">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ $t(item.name) }}</span>
              <el-icon class="dropdown-icon" :class="{ 'is-open': isDropdownOpen(item) }">
                <ArrowDown />
              </el-icon>
            </div>
            <transition name="dropdown">
              <div v-show="isDropdownOpen(item)" class="submenu">
                <router-link v-for="child in item.children" :key="child.path" :to="child.path" class="submenu-item"
                  :class="{ active: currentRoute === child.path }">
                  <el-icon>
                    <component :is="child.icon" />
                  </el-icon>
                  <span>{{ $t(child.name) }}</span>
                </router-link>
              </div>
            </transition>
          </div>
          <router-link v-else :to="item.path" class="menu-item" :class="{ active: currentRoute === item.path }">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ $t(item.name) }}</span>
          </router-link>
        </template>

        <div class="menu-divider"></div>

        <!-- Secondary Navigation -->
        <router-link v-for="item in secondaryMenuItems" :key="item.path" :to="item.path" class="menu-item"
          :class="{ active: currentRoute === item.path }">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ $t(item.name) }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-main">
      <!-- Responsive Navbar/Header -->
      <header class="dashboard-header navbar navbar-expand bg-white sticky-top shadow-sm px-2 px-md-4 py-2 d-flex align-items-center justify-content-between">
        <!-- Sidebar Toggle Button (Mobile) -->
        <button class="btn btn-outline-secondary d-md-none me-2" @click="toggleSidebar">
          <el-icon><Menu /></el-icon>
        </button>
        <!-- <div class="flex-grow-1"></div> -->
        <div class="header-actions d-flex align-items-center gap-2 ms-auto">
          <!-- Language Switcher -->
          <LanguageSwitcher class="header-item"/>
          <!-- Notifications -->
          <div class="notifications position-relative mx-2" @click="showNotifications">
            <el-icon><Bell /></el-icon>
            <span v-if="unreadNotifications" class="notification-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ unreadNotifications }}
            </span>
          </div>
          <!-- User Menu -->
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="user-menu d-flex align-items-center">
              <div class="user-avatar text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 36px; height: 36px;">
                {{ userInitials }}
              </div>
              <div class="user-info d-none d-sm-block">
                <span class="user-name fw-semibold">{{ userName }}</span>
                <span class="user-role d-block small text-muted">{{ userRole }}</span>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon> {{ $t('common.menu.profile') }}
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon> {{ $t('common.menu.settings') }}
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon> {{ $t('common.menu.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <div class="dashboard-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
  <router-view v-else />
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

export default {
  name: 'App',
  components: {
    LanguageSwitcher,
    ThemeSwitcher
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // const searchQuery = ref('')
    const isSidebarOpen = ref(false)
    const isMobile = ref(window.innerWidth <= 768)

    // Menu Items
    const mainMenuItems = [
      { path: '/dashboard', name: 'common.menu.dashboard', icon: 'Monitor' },
      { path: '/products', name: 'common.menu.products', icon: 'Goods' },
      { path: '/brands', name: 'common.menu.brands', icon: 'Trophy' },
      { path: '/categories', name: 'common.menu.categories' , icon: 'Folder' },
      {
        name: 'common.menu.input',
        icon: 'Location',
        children: [
          { path: '/units', name: 'common.menu.units', icon: 'List' },
          { path: 'currencies', name: 'common.menu.currencies', icon: 'Coin' }
        ]
      },
      { path: '/orders', name: 'common.menu.orders', icon: 'ShoppingCartFull' },
      { path: '/customers', name: 'common.menu.customers', icon: 'User' },
     
    ]

    const secondaryMenuItems = [
      { path: '/settings', name: 'common.menu.settings', icon: 'Setting' },
      { path: '/profile', name: 'common.menu.profile', icon: 'User' },
      // log
      { path: '/log', name: 'common.menu.log', icon: 'Document' },
      { path: '/help', name: 'common.menu.help', icon: 'QuestionFilled' }
    ]

    // Computed Properties
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const userName = computed(() => store.state.user?.name || 'User')
    const userRole = computed(() => store.state.user?.role || 'Admin')
    const userInitials = computed(() => {
      const name = userName.value
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })
    const currentRoute = computed(() => route.path)
    const unreadNotifications = computed(() => store.state.notifications?.unread || 0)

    // Methods
    // const handleSearch = () => {
    //   // Implement search functort', namionality
    //   console.log('Searching:', searchQuery.value)
    // }

    const handleCommand = async (command) => {
      switch (command) {
        case 'profile':
          router.push('/profile')
          break
        case 'settings':
          router.push('/settings')
          break
        case 'logout':
          await store.dispatch('logout')
          router.push('/login')
          break
      }
    }

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value
    }

    const showNotifications = () => {
      // Implement notifications panel
      console.log('Show notifications')
    }

    // Responsive handling
    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768
      if (!isMobile.value) {
        isSidebarOpen.value = false
      }
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    const openDropdowns = ref(new Set())

    const toggleDropdown = (item) => {
      if (openDropdowns.value.has(item.name)) {
        openDropdowns.value.delete(item.name)
      } else {
        openDropdowns.value.add(item.name)
      }
    }

    const isDropdownOpen = (item) => {
      return openDropdowns.value.has(item.name)
    }

    return {
      // searchQuery,
      isSidebarOpen,
      isMobile,
      mainMenuItems,
      secondaryMenuItems,
      isAuthenticated,
      userName,
      userRole,
      userInitials,
      currentRoute,
      unreadNotifications,
      // handleSearch,
      handleCommand,
      toggleSidebar,
      showNotifications,
      toggleDropdown,
      isDropdownOpen,
    }
  },
}
</script>

<style>
@import './assets/styles/variables.css';
@import './assets/styles/dashboard-variables.css';
@import './assets/styles/dashboard-layout.css';
@import './assets/styles/dashboard-components.css';

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Additional Styles */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-item {
  display: flex;
  align-items: center;
}

.header-actions .language-switcher a.lang-btn {
  background-color: #4a3c2b1a;
  color: #333;
  border-color: #333;
}

.header-actions .language-switcher a.lang-btn:hover {
  background-color: #4a3c2b43;
  /* color: #fff; */
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: var(--font-xl);
  cursor: pointer;
  padding: var(--spacing-sm);
}

.menu-item-group {
  position: relative;
}

.dropdown-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.dropdown-icon.is-open {
  transform: rotate(180deg);
}

.submenu {
  padding-left: var(--spacing-md);
  background: var(--bg-secondary);
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-normal);
}

.submenu-item:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.submenu-item.active {
  color: var(--primary-color);
  background: var(--bg-active);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dashboard-header {
  z-index: 1050;
  min-height: 56px;
}

@media (max-width: 768px) {
  .dashboard-header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;
    min-height: 56px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .dashboard-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    height: 100vh;
    width: 80vw;
    max-width: 320px;
    z-index: 2000;
    background: #fff;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 8px rgba(0,0,0,0.08);
  }
  .dashboard-sidebar.open {
    transform: translateX(0);
  }
  .dashboard-main {
    padding-top: 56px;
  }
  .menu-toggle {
    display: block;
  }
  .search-bar {
    width: 200px;
  }
}

.notification-badge {
  font-size: 0.75rem;
  min-width: 1.2em;
  min-height: 1.2em;
  display: inline-block;
  padding: 0.2em 0.4em;
  line-height: 1;
}

.user-avatar {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
