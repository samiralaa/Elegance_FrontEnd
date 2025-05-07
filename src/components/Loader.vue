<template>
  <div class="loader-svg-wrapper">
    <svg class="loader-svg" width="80" height="80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M100 30 Q105 10 110 30 Q120 60 150 60 Q170 60 160 80 Q150 100 170 110 Q190 120 170 130 Q150 140 160 160 Q170 180 150 170 Q120 160 110 190 Q105 210 100 190 Q90 160 50 170 Q30 180 40 160 Q50 140 30 130 Q10 120 30 110 Q50 100 40 80 Q30 60 50 60 Q80 60 90 30 Q95 10 100 30 Z" stroke="#b8860b" stroke-width="6" fill="none"/>
        <circle cx="100" cy="100" r="18" stroke="#b8860b" stroke-width="4" fill="none"/>
        <path d="M100 55 Q102 45 104 55 Q106 65 100 70 Q94 65 96 55 Q98 45 100 55 Z" fill="#b8860b"/>
      </g>
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
  height: 100%;
}
.loader-svg {
  animation: rotate-loader 1.2s linear infinite;
  display: block;
}
@keyframes rotate-loader {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>