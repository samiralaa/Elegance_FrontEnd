<template>
  <section class="our-brands">
    <div class="container">
      <div class="title mt-5">
        <fa class="fa-icon" :icon="['fas','diagram-project']"></fa>
        <h2>{{ $t('home.brands') }}</h2>
      </div>
      <div v-for="brand in brands" :key="brand.id" class="content">
        <div class="brand-img">
          <img v-if="brand.images.length" :src="getImageUrl(brand.images[0].path)" :alt="brand.name_en" class="img-fluid"/>
          <span v-else class="text-muted small">No Image</span>
        </div>
      </div>
    </div>
  </section>
</template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "HomeBrands",
    data() {
      return {
        brands: [],
      };
    },
    created() {
      this.fetchBrands();
    },
    methods: {
      async fetchBrands() {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/website/brands/section"
          );
          this.brands = response.data.data;
        } catch (error) {
          console.error("Error fetching brands:", error);
        }
      },
      getImageUrl(path) {
        return `http://127.0.0.1:8000/storage/${path}`;
      },
      likeBrand(id) {
        console.log(`Brand ${id} liked!`);
      },
    },
  };
  </script>
  
<style scoped>
  .object-fit-contain {
    object-fit: contain;
  }

  .title{
    margin-bottom: 15px;
    color: #8b6b3d;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .fa-icon{
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  .our-brands .content{
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 30px;
  }

  .our-brands .content .brand-img{
    transition: all 0.2s ease-in-out;
  }

  .our-brands .content .brand-img:hover{
    scale: 1.2;
  }

  .our-brands .content .brand-img img{
    height: 200px;
    margin: 10px;
    margin-bottom: 20px;
    width: auto;
  }
</style>

  