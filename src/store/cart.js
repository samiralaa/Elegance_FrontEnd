import { defineStore } from 'pinia'
import axios from 'axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartCount: 0,
    isLoading: false,
    cartItems: [],
    error: null
  }),

  getters: {
    getCartCount: (state) => state.cartCount,
    getCartItems: (state) => state.cartItems,
    getError: (state) => state.error
  },

  actions: {
    async fetchCartCount() {
      if (this.isLoading) return
      
      try {
        this.isLoading = true
        this.error = null
        const response = await axios.get('https://backend.webenia.org/api/cart-items', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        
        if (response.data.data?.original?.data) {
          this.cartItems = response.data.data.original.data
          this.cartCount = this.cartItems.length
        } else {
          this.cartItems = []
          this.cartCount = 0
        }
      } catch (error) {
        console.error('Error fetching cart count:', error)
        this.error = error.response?.data?.message || 'Failed to fetch cart'
        this.cartItems = []
        this.cartCount = 0
      } finally {
        this.isLoading = false
      }
    },

    async fetchCartItems() {
      return this.fetchCartCount()
    },

    async updateQuantity(itemId, newQuantity) {
      try {
        this.error = null
        const response = await axios.post(`https://backend.webenia.org/api/cart-items/${itemId}`, {
          quantity: newQuantity
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })

        if (response.data.status) {
          // Update local state
          const item = this.cartItems.find(i => i.id === itemId)
          if (item) {
            item.quantity = newQuantity
          }
          // Refresh cart items to ensure sync
          await this.fetchCartCount()
          return true
        }
        return false
      } catch (error) {
        console.error('Error updating quantity:', error)
        this.error = error.response?.data?.message || 'Failed to update quantity'
        return false
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
      this.cartItems = []
      this.error = null
    },

    updateCountFromItems(items) {
      this.cartItems = items
      this.cartCount = items.length
      this.error = null
    },

    async handleCartUpdate() {
      await this.fetchCartCount()
    },

    clearError() {
      this.error = null
    },

    async removeFromCart(itemId) {
      try {
        this.isLoading = true;
        this.error = null;

        await axios.delete(`https://backend.webenia.org/api/cart-items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // أعد تحميل البيانات بالكامل من السيرفر
        await this.fetchCartCount();
      } catch (error) {
        console.error('Error removing item from cart:', error);
        this.error = error.response?.data?.message || 'Failed to remove item';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

  }
}) 