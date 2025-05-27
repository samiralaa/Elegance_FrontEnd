<template>
  <button class="search-btn mx-2" @click="$emit('toggle')">
    <fa icon="search" />
  </button>
</template>

<script>
export default {
  name: 'SearchButton',
  emits: ['toggle']
}
</script>

<style scoped>
.search-btn {
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

.search-btn::after {
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

.search-btn:hover {
  color: #fff;
}

.search-btn:hover::after {
  transform: translate(-50%, -50%) scale(1);
}
</style> 