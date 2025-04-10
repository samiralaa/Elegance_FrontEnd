import axios from 'axios'

const state = {
  items: [],
  loading: false,
  error: null
}

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.items = categories
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  ADD_CATEGORY(state, category) {
    state.items.push(category)
  },
  UPDATE_CATEGORY(state, updatedCategory) {
    const index = state.items.findIndex(c => c.id === updatedCategory.id)
    if (index !== -1) {
      state.items.splice(index, 1, updatedCategory)
    }
  },
  REMOVE_CATEGORY(state, categoryId) {
    state.items = state.items.filter(c => c.id !== categoryId)
  }
}

const actions = {
  async fetchCategories({ commit, rootState }) {
    try {
      if (!rootState.token) {
        throw new Error('Authentication required')
      }

      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      // Make sure Authorization header is set correctly
      const tokenData = JSON.parse(localStorage.getItem('tokenData'))
      if (tokenData?.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`
      }
      
      const response = await axios.get('/api/categories')
      
      if (response.data) {
        const categories = Array.isArray(response.data) ? response.data : 
                         response.data.data ? response.data.data :
                         response.data.categories ? response.data.categories : []
        
        commit('SET_CATEGORIES', categories)
        return categories
      } else {
        throw new Error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Fetch categories error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch categories'
      commit('SET_ERROR', errorMessage)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createCategory({ commit, rootState }, categoryData) {
    try {
      if (!rootState.token) {
        throw new Error('Authentication required')
      }

      commit('SET_LOADING', true)
      const response = await axios.post('/api/categories', categoryData)
      commit('ADD_CATEGORY', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateCategory({ commit, rootState }, { id, ...categoryData }) {
    try {
      if (!rootState.token) {
        throw new Error('Authentication required')
      }

      commit('SET_LOADING', true)
      const response = await axios.put(`/api/categories/${id}`, categoryData)
      commit('UPDATE_CATEGORY', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteCategory({ commit, rootState }, categoryId) {
    try {
      if (!rootState.token) {
        throw new Error('Authentication required')
      }

      commit('SET_LOADING', true)
      await axios.delete(`/api/categories/${categoryId}`)
      commit('REMOVE_CATEGORY', categoryId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  getCategories: state => state.items,
  isLoading: state => state.loading,
  getError: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 