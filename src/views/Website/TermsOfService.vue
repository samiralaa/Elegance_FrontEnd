<template>
<Header />
    
<div class=" content">
  <div class="row mb-4">
    <div class="col-md-8">
      <h2 class="title">TERMS OF SERVICE</h2>

      <h5 class="section-title">GENERAL TERMS</h5>
      <p>
        Modification: We reserve the right to modify or update these terms at any time without prior notice.
        You are responsible for reviewing the terms periodically. Your continued use of our store after any
        modifications constitutes acceptance of those changes.
      </p>

      <h5 class="section-title">STORE USAGE</h5>
      <p>
        <strong>Product Information:</strong> We strive to provide accurate and up-to-date information about our products,
        including descriptions, prices, and availability.
      </p>
      <p>
        <strong>Purchases:</strong> By making a purchase through our store, you agree to provide accurate, complete,
        and current information. You are solely responsible for the accuracy of the information provided. We reserve
        the right to refuse or cancel any order if we suspect fraudulent activity or for any other reason deemed necessary.
      </p>
      <p>
        <strong>2.3 Pricing:</strong> All prices displayed on our store are in the specified currency and are subject to
        change without notice. We make every effort to ensure accurate pricing, but in the event of an error, we reserve
        the right to correct it and refuse or cancel any affected orders.
      </p>
      <p>
        <strong>2.4 Product Availability:</strong> Product availability is subject to change without notice. We make every
        effort to maintain accurate stock levels, but we cannot guarantee the availability of any product. If a product
        becomes unavailable after you place an order, we will notify you and provide alternatives or a refund.
      </p>

      <h5 class="section-title">SHIPPING AND DELIVERY</h5>
      <p>
        <strong>3.1 Shipping:</strong> We offer shipping services to specified locations. Shipping fees and estimated delivery
        times are provided during the checkout process. Please review our shipping policy for more information.
      </p>
    </div>

    <div class="col-md-4 text-center">
      <img src="@/assets/images/EleganceLogo.png" alt="Logo" class="logo mb-2">
      <div class="brand-text">ELEGANCE</div>
      <div class="subtitle">PARFUMS AND OUD</div>
    </div>
  </div>
</div>



   
<Footer />
  
</template>

<script>
import Header from '@/components/Website/Header.vue'
import Footer from '@/components/Website/Footer.vue'
import i18n from '@/i18n.js'
export default {
  name: 'RefundPolicy',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      direction: i18n.global.locale === 'ar' ? 'rtl' : 'ltr'
    };
  }
};
</script>

<style scoped>
.title {
      color: #c19f45;
      font-weight: bold;
      margin-bottom: 2rem;
    }

    .section-title {
      color: #c19f45;
      font-weight: bold;
      margin-top: 2rem;
    }

    .logo {
      max-height: 80px;
    }

    .brand-text {
      font-size: 2rem;
      font-weight: bold;
      color: #1a1a2e;
    }

    .subtitle {
      text-transform: uppercase;
      font-size: 0.9rem;
    }

    .content {
      /* max-width: 1000px; */
      /* margin: auto; */
      padding: 3rem;
    }
</style>