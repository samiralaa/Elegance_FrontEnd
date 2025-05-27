<template>
  <button class="favorite-btn mx-2" @click="$emit('show')">
    <fa icon="heart" />
    <span v-if="count > 0" class="favorite-count">{{ count }}</span>
  </button>
</template>

<script>
export default {
  name: 'FavoriteButton',
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  emits: ['show']
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
  background-color: #8b6b3d;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  z-index: -1;
  transition: transform 0.3s ease;
}

.favorite-btn:hover {
  color: #fff;
}

.favorite-btn:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.favorite-count {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: scale(1);
  transition: transform 0.2s ease;
}

.favorite-btn:hover .favorite-count {
  transform: scale(1.1);
}
</style> 