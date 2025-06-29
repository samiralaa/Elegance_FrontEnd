<template>
  <div class="home">
    <Loader v-if="loading" />
    <Header />
    <VerifyOtp v-if="showVerifyOtp" :user="user" :token="token" />


    <!-- Hero Section with Ramadan Theme -->


    <section class="hero-section">
      <div id="carouselExample" class="carousel slide">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="@/assets/images/Hero/slider1.png" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="@/assets/images/Hero/slider2.png" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="@/assets/images/Hero/slider3.png" class="d-block w-100" alt="...">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </section>
    <Categories />
    <HomeBrands v-if="showBrand" />
    <Products v-if="showOurProducts" />
    <LatestProducts v-if="showLatestProducts" />
    <BestSelling v-if="showBestSelling" />
    <WhyChooseUs />
    <Footer />

  </div>
</template>

<script>
import Header from '@/components/Website/Header.vue'
import Categories from '@/components/Website/Categories.vue'
import HomeBrands from '@/components/Website/HomeBrands.vue'
import Products from '@/components/Website/ProductSection.vue'
import BestSelling from '@/components/Website/BestSelling.vue'
import WhyChooseUs from '@/components/Website/WhyChooseUs.vue'
import LatestProducts from '@/components/Website/LatestProducts.vue'
import i18n from '@/i18n.js'
import Footer from '@/components/Website/Footer.vue'
import Loader from '@/components/Loader.vue'
import VerifyOtp from '@/components/verifyOtpPopup.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Categories,
    HomeBrands,
    LatestProducts,
    Products,
    BestSelling,
    WhyChooseUs,
    Footer,
    Loader,
    VerifyOtp,
  },
  computed: {
    showVerifyOtp() {
      // Show VerifyOtp only if user exists and is_verified is not true (0 or false)
      return this.user && !this.user.is_verified;
    },
    direction() {
      return i18n.global.locale === 'ar' ? 'rtl' : 'ltr';
    }
  },
  data() {
    return {
      showBrand: false,
      showOurProducts: false,
      showLatestProducts: false,
      showBestSelling: false,
      loading: true,
      user: null,
      token: null,
    };
  },
  mounted() {
    this.fetchSettings();
  },
  methods: {


    async fetchSettings() {
      try {
     
        const response = await fetch('https://backend.webenia.org/api/settings');
        const result = await response.json();
        const settings = result.data;
        const findSetting = key => {
          const setting = settings.find(s => s.key === key);
          return setting && setting.value === "1";
        };
        this.showBrand = findSetting('show_brand');
        this.showOurProducts = findSetting('show_our_products');
        this.showLatestProducts = findSetting('show_latest_products');
        this.showBestSelling = findSetting('show_best_selling_products');
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      }
    },
    scrollLeft() {
      const width = window.innerWidth;
      const card = this.$refs.slider.querySelector('.card');
      const cardWidth = card.offsetWidth;

      if (width <= 440) {
        const gap = 26;
        this.$refs.slider.scrollBy({ left: -(cardWidth * 2 + gap), behavior: 'smooth' });
      } else if (width <= 768) {
        const gap = 50;
        this.$refs.slider.scrollBy({ left: -(cardWidth * 3 + gap), behavior: 'smooth' });
      } else if (width <= 1200) {
        const gap = 50;
        this.$refs.slider.scrollBy({ left: -(cardWidth * 4 + gap), behavior: 'smooth' });
      } else {
        const gap = 30; // optional for bigger screens
        this.$refs.slider.scrollBy({ left: -(cardWidth * 7 + gap), behavior: 'smooth' });
      }
    },

    scrollRight() {
      const width = window.innerWidth;
      const card = this.$refs.slider.querySelector('.card');
      const cardWidth = card.offsetWidth;

      if (width <= 440) {
        const gap = 26;
        this.$refs.slider.scrollBy({ left: cardWidth * 2 + gap, behavior: 'smooth' });
      } else if (width <= 768) {
        const gap = 50;
        this.$refs.slider.scrollBy({ left: cardWidth * 3 + gap, behavior: 'smooth' });
      } else if (width <= 1200) {
        const gap = 50;
        this.$refs.slider.scrollBy({ left: cardWidth * 4 + gap, behavior: 'smooth' });
      } else {
        const gap = 30; // optional for bigger screens
        this.$refs.slider.scrollBy({ left: cardWidth * 7 + gap, behavior: 'smooth' });
      }
    }
  },

  created() {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    if (savedUser) {
      this.user = JSON.parse(savedUser)
    }

    if (savedToken) {
      this.token = savedToken
    }
  }
};

</script>

<style scoped>
.home {
  min-height: 100vh;
}
:deep(.el-notification.right){
  top: 150px !important;
}
</style>