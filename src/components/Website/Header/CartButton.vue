<template>
  <a class="cart-btn mx-2" @click="$emit('show')">
    <fa icon="shopping-cart" />
    <span v-if="count > 0" class="badge bg-danger">{{ count }}</span>
  </a>
</template>

<script>
export default {
  name: 'CartButton',
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
.cart-btn {
  position: relative;
  padding: 1em;
  background: transparent;
  border: none;
  cursor: pointer;
  isolation: isolate;
  overflow: hidden;
  color: #8b6b3d;
  border-radius: 50%;
  text-decoration: none;
}

.cart-btn::after {
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

.cart-btn:hover {
  color: #fff;
}

.cart-btn:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.badge {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 50%;
  transform: scale(1);
  transition: transform 0.2s ease;
}

.cart-btn:hover .badge {
  transform: scale(1.1);
}
</style> 