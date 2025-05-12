<template>
  <div class="loader-svg-wrapper">
    <svg class="loader-svg" viewBox="0 0 600 200" transform="translate(80, 30) scale(1.2)" xmlns="http://www.w3.org/2000/svg">
      <!-- Logo icon path with stroke animation -->
      <path transform="translate(-20, 1) scale(1.1)" class="jumper" stroke-linecap="round" stroke-linejoin="round" d="M47.5,94.3c0-23.5,19.9-42.5,44.5-42.5s44.5,19,44.5,42.5"/>
      <g transform="translate(-20, 1) scale(1.1)" stroke="#b8860b" stroke-width="1">
        <ellipse class="circleL" fill="none" stroke-miterlimit="10" cx="47.2" cy="95.6" rx="10.7" ry="2.7" />
        <ellipse class="circleR" fill="none" stroke-miterlimit="10" cx="136.2" cy="95.6" rx="10.7" ry="2.7" />
      </g>
      <path transform="translate(-20, 1) scale(1.1)" class="jumper clone" stroke-linecap="round" stroke-linejoin="round" d="M47.5,94.3c0-23.5,19.9-42.5,44.5-42.5s44.5,19,44.5,42.5"/>

      <!-- Text fade-in after drawing -->
      <text x="160" y="85" font-family="Georgia, serif" font-size="48" fill="#b8860b" class="fade-in-text">ELEGANCE</text>
      <text x="181" y="110" font-family="Arial, sans-serif" font-size="18" letter-spacing="3" fill="#b8860b" class="fade-in-text">PARFUMS AND OUD</text>
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
  background: #fff;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}
.loader-svg {
  width: 100%;
  height: 100vh;
  max-width: 800px;
  max-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Text fade in after logo draw */
.fade-in-text {
  opacity: 0;
  animation: fadeIn 1s ease forwards;
}

.jumper {
  fill: none;
  stroke: #b8860b;
  stroke-width: 10px;
  stroke-dashoffset: 0;
  stroke-dasharray: 0, 136.71884155273438px;
  animation: animJumper 1.3s linear infinite;
}

.jumper.clone {
  opacity: 0.05;
  transform: translateY(200px) scaleY(-1);
}

.circleL {
  opacity: 0;
  transform-origin: 47.2px 95.6px;
  animation: animCircle 1.3s infinite;
}

.circleR {
  opacity: 0;
  transform-origin: 136.2px 95.6px;
  animation: animCircle 1.3s 0.728s infinite;
}

@keyframes animJumper {
  8% {
    stroke-dasharray: 20.507826232910157px, 136.71884155273438px;
  }
  32% {
    stroke-dasharray: 41.01565246582031px, 136.71884155273438px;
    stroke-dashoffset: -48.05159454345703px;
  }
  56% {
    stroke-dasharray: 20.507826232910157px, 136.71884155273438px;
    stroke-dashoffset: -116.21097012472535px;
  }
  64% {
    stroke-dasharray: 0, 136.71884155273438px;
    stroke-dashoffset: -136.71884155273438px;
  }
}

@keyframes animCircle {
  0% {
    opacity: 1;
  }
  50% {
    transform: scale(3);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
