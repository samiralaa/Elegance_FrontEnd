<template>
    <section class="brands-section py-5 bg-light">
      <div class="container">
        <h2 class="text-center text-warning mb-5 fs-2 fw-bold">
          Our Brands
          <span class="ms-2">💼</span>
        </h2>
  
        <div class="row g-4">
          <div
            v-for="brand in brands"
            :key="brand.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <div class="card h-100 text-center border-0 shadow-sm">
              <div class="card-body d-flex flex-column align-items-center">
                <div
                  class="rounded-circle border border-warning mb-3 d-flex justify-content-center align-items-center bg-light"
                  style="width: 100px; height: 100px; overflow: hidden;"
                >
                  <img
                    v-if="brand.images.length"
                    :src="getImageUrl(brand.images[0].path)"
                    :alt="brand.name_en"
                    class="img-fluid w-100 h-100 object-fit-contain"
                  />
                  <span v-else class="text-muted small">No Image</span>
                </div>
                <h5 class="card-title fw-bold">{{ brand.name_ar }}</h5>
                <p class="card-text text-muted">{{ brand.name_en }}</p>
                <button
                  @click="likeBrand(brand.id)"
                  class="btn btn-warning btn-sm mt-2 text-white"
                >
                  Like
                </button>
              </div>
            </div>
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
            "https://elegance_commers.test/api/website/brands/section"
          );
          this.brands = response.data.data;
        } catch (error) {
          console.error("Error fetching brands:", error);
        }
      },
      getImageUrl(path) {
        return `https://elegance_commers.test/storage/${path}`;
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
  </style>
  