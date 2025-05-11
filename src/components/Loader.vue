<template>
  <div class="loader-svg-wrapper">
    <svg class="loader-svg" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Logo icon path with stroke animation -->
      <g transform="translate(0, 30) scale(1.1)">
        <path
          class="draw-path"
          d="M67.5,90c-4.1-6.8,2.5-11.4,5.8-13.6c5.1-3.4,6.4-4.9,6.9-9.2c1-8.7-5.7-11.3-6.9-17.5c-1-5.5,3.5-10.8,8.3-11.8
          c4.7-1,9.3,1.3,12.3,4.9c3,3.7,5.6,7.9,6.7,10.4c0.8,1.8,3.1,2.3,4.5,0.9c1.6-1.6,3.7-3.8,5.4-5.2c1.4-1.1,2.3-2.5,2.8-4.2
          c1.2-4.6-0.1-9.6-4.5-14c-4.4-4.4-8.7-4.9-11.4-4.9c-2.7,0-4.6-1.6-5.6-4.3c-1.6-4.2-2.6-8.7-3.1-13.3c-0.3-3,0.3-6.1,2-8.7
          c1.7-2.7,4.2-4.1,6.4-4.1c2.2,0,4.7,1.4,6.4,4.1c1.7,2.6,2.3,5.7,2,8.7c-0.5,4.6-1.5,9.1-3.1,13.3c-1,2.7-2.9,4.3-5.6,4.3
          c-2.6,0-7,0.5-11.4,4.9c-4.4,4.4-5.7,9.4-4.5,14c0.5,1.7,1.4,3.1,2.8,4.2c1.7,1.4,3.8,3.6,5.4,5.2c1.4,1.4,3.7,0.9,4.5-0.9
          c1.1-2.5,3.7-6.7,6.7-10.4c3-3.6,7.6-5.9,12.3-4.9c4.8,1,9.3,6.3,8.3,11.8c-1.2,6.2-7.9,8.8-6.9,17.5c0.5,4.3,1.8,5.8,6.9,9.2
          c3.3,2.2,9.9,6.8,5.8,13.6c-4.1,6.8-11.4,4.5-15.2,4.9c-6.2,0.5-9.6,5.8-10.4,9.5c-0.9,4.1-1.2,10.7-4.9,10.7
          c-3.7,0-4-6.6-4.9-10.7c-0.8-3.7-4.2-9-10.4-9.5C78.9,94.5,71.6,96.8,67.5,90z"
        />
      </g>

      <!-- Text fade-in after drawing -->
      <text x="160" y="85" font-family="Georgia, serif" font-size="48" fill="#b8860b" class="fade-in-text">ELEGANCE</text>
      <text x="165" y="125" font-family="Arial, sans-serif" font-size="18" letter-spacing="3" fill="#b8860b" class="fade-in-text">PARFUMS AND OUD</text>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Loader'
}
</script>

<style scoped>
.loader-svg-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent; /* ← شفافة */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

/* Drawing animation */
.draw-path {
  fill: none;
  stroke: #b8860b;
  stroke-width: 2;
  stroke-dasharray: 1800;
  stroke-dashoffset: 1800;
  animation: draw 3s ease forwards;
}

/* Text fade in after logo draw */
.fade-in-text {
  opacity: 0;
  animation: fadeIn 1s ease forwards;
  animation-delay: 3s;
}

/* Animations */
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
