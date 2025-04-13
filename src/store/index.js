import { createStore } from 'vuex'
import axios from 'axios'
import categories from './modules/categories'
import brands from './modules/brands'

const API_URL = 'https://elegance_commers.test'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false
})

// Add token to requests if it exists
api.interceptors.request.use(config => {
  const tokenData = JSON.parse(localStorage.getItem('tokenData'))
  if (tokenData?.token) {
    config.headers.Authorization = `Bearer ${tokenData.token}`
  }
  return config
})

export default createStore({
  modules: {
    categories,
    brands
  },
  state: {
    products: [],
    orders: [],
    customers: [],
    brands: [],
    salesData: {
      daily: [],
      weekly: [],
      monthly: []
    },
    loading: false,
    error: null,
    token: localStorage.getItem('tokenData') ? JSON.parse(localStorage.getItem('tokenData')).token : null,
    user: null,
    profile: null
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_ORDERS(state, orders) {
      state.orders = orders
    },
    SET_CUSTOMERS(state, customers) {
      state.customers = customers
    },
    SET_BRANDS(state, brands) {
      state.brands = brands
    },
    SET_SALES_DATA(state, { period, data }) {
      state.salesData[period] = data
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        const tokenData = { token }
        localStorage.setItem('tokenData', JSON.stringify(tokenData))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        localStorage.removeItem('tokenData')
        delete api.defaults.headers.common['Authorization']
      }
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_PROFILE(state, profile) {
      state.profile = profile
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        const response = await api.post('/api/login', {
          email: credentials.email,
          password: credentials.password
        })
        
        console.log('Login response:', response.data)
        
        // Check for token structure in response
        const token = response.data.token || response.data.access_token
        const user = response.data.user || { name: 'Admin' }
        
        if (token) {
          // Save token to localStorage and state
          commit('SET_TOKEN', token)
          commit('SET_USER', user)
          
          // Explicitly set Authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          return response.data
        } else {
          throw new Error('Login failed: No token received')
        }
      } catch (error) {
        console.error('Login error:', error)
        const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    logout({ commit }) {
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
      commit('SET_CUSTOMERS', [])
      commit('SET_PRODUCTS', [])
      commit('SET_ORDERS', [])
    },

    async fetchCustomers({ commit, state }) {
      try {
        if (!state.token) {
          throw new Error('Authentication required')
        }

        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        console.log('Fetching customers with token:', state.token)
        
        // Make sure Authorization header is set correctly
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (tokenData?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        }
        
        const response = await api.get('/api/users')
        
        console.log('Customers API Response:', response.data)
        
        if (response.data) {
          // Handle both array and object responses
          const users = Array.isArray(response.data) ? response.data : 
                       response.data.data ? response.data.data :
                       response.data.users ? response.data.users : []
          
          console.log('Processed customers:', users)
          commit('SET_CUSTOMERS', users)
          return users
        } else {
          throw new Error('Failed to fetch customers')
        }
      } catch (error) {
        console.error('Fetch customers error:', error)
        console.error('Error response:', error.response)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch customers'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchBrands({ commit, state }) {
      try {
        if (!state.token) {
          throw new Error('Authentication required')
        }

        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        console.log('Fetching brands with token:', state.token)
        
        // Make sure Authorization header is set correctly
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (tokenData?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        }
        
        const response = await api.get('/api/brands')
        
        console.log('Brands API Response:', response.data)
        
        if (response.data) {
          // Handle both array and object responses
          const brands = Array.isArray(response.data) ? response.data : 
                        response.data.data ? response.data.data :
                        response.data.brands ? response.data.brands : []
          
          console.log('Processed brands:', brands)
          commit('SET_BRANDS', brands)
          return brands
        } else {
          throw new Error('Failed to fetch brands')
        }
      } catch (error) {
        console.error('Fetch brands error:', error)
        console.error('Error response:', error.response)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch brands'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchProducts({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await api.get('/products')
        commit('SET_PRODUCTS', response.data)
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch products')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchOrders({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await api.get('/orders')
        commit('SET_ORDERS', response.data)
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch orders')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async registerUser({ commit }, userData) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        const response = await api.post('/api/register', {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          password: userData.password,
          password_confirmation: userData.password_confirmation
        })
        
        console.log('Registration response:', response.data)
        
        // Check for token in response
        if (response.data && response.data.token) {
          // Optionally set the token and user if you want to log in immediately after registration
          commit('SET_TOKEN', response.data.token)
          commit('SET_USER', response.data.user)
          return response.data
        } else {
          throw new Error('Registration failed: No token received')
        }
      } catch (error) {
        console.error('Registration error:', error)
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchProfile({ commit, state }) {
      try {
        if (!state.token) {
          throw new Error('Authentication required')
        }

        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        // Make sure Authorization header is set correctly
        const tokenData = JSON.parse(localStorage.getItem('tokenData'))
        if (tokenData?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
        }
        
        const response = await api.get('/api/me')
        
        console.log('Profile Response:', response.data)
        
        if (response.data) {
          commit('SET_PROFILE', response.data)
          return response.data
        } else {
          throw new Error('Failed to fetch profile')
        }
      } catch (error) {
        console.error('Fetch profile error:', error)
        console.error('Error response:', error.response)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profile'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {
    totalProducts: state => state.products.length,
    totalOrders: state => state.orders.length,
    totalCustomers: state => state.customers.length,
    totalBrands: state => state.brands.length,
    totalRevenue: state => {
      return state.orders.reduce((total, order) => total + order.total, 0)
    },
    getCustomers: state => state.customers,
    getBrands: state => state.brands,
    isLoading: state => state.loading,
    getError: state => state.error,
    isAuthenticated: state => !!state.token,
    getUser: state => state.user,
    getProfile: state => state.profile
  }
})