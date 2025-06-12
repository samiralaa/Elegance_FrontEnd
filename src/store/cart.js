import { defineStore } from 'pinia'
import axios from 'axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartCount: 0
  }),

  getters: {
    getCartCount: (state) => state.cartCount
  },

  actions: {
    async fetchCartCount() {
      try {
        const response = await axios.get('https://backend.webenia.org/api/cart-items', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.data.data?.original?.data) {
          this.cartCount = response.data.data.original.data.length
        } else {
          this.cartCount = 0
        }
      } catch (error) {
        console.error('Error fetching cart count:', error)
        this.cartCount = 0
      }
    },

    incrementCount() {
      this.cartCount++
    },

    decrementCount() {
      if (this.cartCount > 0) {
        this.cartCount--
      }
    },

    resetCount() {
      this.cartCount = 0
    },

    // New method to update count based on cart items
    updateCountFromItems(items) {
      this.cartCount = items.length
    }
  }
}) 