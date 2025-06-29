<template>
  <button class="favorite-btn" @click="handleClick">
    <fa icon="heart" />
    <span v-if="favoritesStore.count > 0" class="favorite-count">({{ favoritesStore.count }})</span>
  </button>
</template>

<script>
import { useFavoritesStore } from '@/store/favorites';
import { onMounted } from 'vue';

export default {
  name: 'FavoriteButton',
  emits: ['show'],
  setup(props, { emit }) {
    const favoritesStore = useFavoritesStore();

    const handleClick = () => {
      if (!localStorage.getItem('auth_token')) {
        // Redirect to login if not authenticated
        window.location.href = '/Account/Login';
        return;
      }
      emit('show');
    };

    // Fetch favorites count when component is mounted
    onMounted(async () => {
      await favoritesStore.fetchFavorites();
    });

    return {
      favoritesStore,
      handleClick
    };
  }
}
</script>

<style scoped>
.favorite-btn {
  position: relative;
  padding: 1em;
  background: transparent;
  border: none;
  cursor: pointer;
  isolation: isolate;
  overflow: hidden;
  color: #8b6b3d;
  border-radius: 50%;
}

.favorite-btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  height: 45px;
  width: 45px;
  background-color: #a07840;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  z-index: -1;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  color: #6b4d2d;
}

.favorite-count {
  position: absolute;
  top: 5px;
  right: 5px;
  background: trasparent;
  color: #333;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); */
  transform: scale(1);
  transition: transform 0.2s ease;
}
</style> 