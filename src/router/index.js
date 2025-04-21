import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Customers from '../views/Customers.vue'
import Brands from '../views/Brands.vue'
import Categories from '../views/Categories/index.vue'
import Settings from '../views/Settings.vue'
import Profile from '../views/Profile.vue'
import Help from '../views/Help.vue'

const routes = [
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Website/Checkout.vue'),
  },
  {
    path: '/otp',
    name: 'Otp',
    component: () => import('@/views/Otp.vue')
  },
  {
    path: '/Account/Login',
    name: 'Account/Login',
    component: () => import('../views/Website/AccountLogin.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Website/home.vue')
  },
  {
    path: '/read/products/:id',
    name: 'ProductShowHomePage',
    component: () => import('../views/Website/showProduct.vue') 
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../views/Customers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/brands',
    name: 'Brands',
    component: () => import('../views/Brands.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/Categories/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories/:id',
    name: 'CategoryShow',
    component: () => import('../views/Categories/show.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories/create',
    name: 'CategoryCreate',
    component: () => import('../views/Categories/create.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/Products/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id',
    name: 'ProductShow',
    component: () => import('../views/Products/show.vue'), 
  },
  {
    path: '/products/create',
    name: 'ProductCreate',
    component: () => import('../views/Products/create.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../views/Analytics.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
   
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/Help.vue'),
  },
  {
    path: '/units/list',
    name: 'UnitsList',
    component: () => import('../views/Dashboard/Units/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/units/create',
    name: 'UnitCreate',
    component: () => import('../views/Dashboard/Units/CreateUnit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product-listing',
    name: 'ProductListing',
    component: () => import('../views/Website/ProductListing.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const tokenData = JSON.parse(localStorage.getItem('tokenData'))
  
  if (to.meta.requiresAuth && !tokenData?.token) {
    next('/login')
  } else {
    next()
  }
})

export default router