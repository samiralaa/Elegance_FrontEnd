<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-section col-lg-3 col-sm-6">
        <h3>Download App</h3>
        <div class="app-links d-flex justify-content-center align-items-center">
          <div class="d-flex flex-column justify-content-center align-items-center flex-column">
            <a href=""><img src="@/assets/images/app-store.png" alt="App Store" /></a>
            <a href=""><img src="@/assets/images/google-play.png" alt="Google Play" /></a>
          </div>
          <img src="@/assets/images/qr-code.png" alt="QR Code" />
        </div>
      </div>
      <div class="footer-section col-lg-3 col-sm-6">
        <h3>Quick Link</h3>
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Refund Policy</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div class="footer-section col-lg-3 col-sm-6">
        <h3>Account</h3>
        <ul>
          <li><a href="#">Login / Register</a></li>
        </ul>
      </div>
      <div class="footer-section col-lg-3 col-sm-6">
        <h3>Support</h3>
        <ul>
          <li class="address">
            <fa icon="location-dot" class="fa"></fa>
            <a href="">
              37 Kwar St - Al Nahyan - E20-02 <br> - Abu Dhabi - United Arab Emirates
            </a>
          </li>
          <li class="email">
            <fa icon="envelope" class="fa"></fa>
            <a href="mailto:eleganceoud22@gmail.com">eleganceoud22@gmail.com</a>
          </li>
          <li class="phone">
            <fa icon="phone" class="fa"></fa>
            <a href="">+971 54 488 7138</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom d-flex justify-content-between align-items-center">
      <div class="footer-section d-flex justify-content-center align-items-center">
        <h6>Accept For</h6>
        <div class="payment-methods pb-2 ps-2">
          <img src="@/assets/images/payment/cart-5.png" alt="Visa" />
          <img src="@/assets/images/payment/cart-4.png" alt="Apple Pay" />
          <img src="@/assets/images/payment/cart-2.png" alt="Mastercard" />
          <img src="@/assets/images/payment/cart-3.png" alt="PayPal" />
          <img src="@/assets/images/payment/cart-1.png" alt="Tabby" />
        </div>
      </div>
      <p>Powered by Webenia 2024 ©</p>
      <div class="social-media d-flex justify-content-center align-items-center">
        <a href="https://www.facebook.com/eleganceouduae?mibextid=ZbWKwL"><fa icon="fab fa-facebook-f"></fa></a>
        <a href="https://www.instagram.com/eleganceoud?igsh=eWZicHkwY29weWlv"><fa icon="fab fa-instagram"></fa></a>
        <a href="https://www.tiktok.com/@eleganceouduae?lang=en"><fa icon="fab fa-tiktok"></fa></a>
        <a href="https://wa.me/+971544887138"><fa icon="fa-brands fa-whatsapp"></fa></a>
        <a href="https://www.snapchat.com/add/elegant_oud"><fa icon="fa-brands fa-snapchat"></fa></a>
        <a href="https://www.youtube.com/@eleganceoud"><fa icon="fa-brands fa-youtube"></fa></a>
      </div>
    </div>
  </footer>

</template>

<script setup>

// Add any necessary JavaScript here
</script>

<style scoped>
.footer {
  background-color: #fff;
  padding: 0;
  text-align: center;
}
.container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.footer .container {
  padding: 20px 0;
}
.app-links img,
.payment-methods img {
  width: 100%;
  max-width: 150px;
  margin: 10px;
}
.app-links img{
  padding: 10px;

}
.footer-bottom {
  margin-top: 20px;
  padding: 0 50px;
  background-color: #f8f8f8;
}
.footer-section ul {
  text-align: center ;
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.footer-section ul li {
  color: #999999;
  font-size: 14px;
  font-family: inherit;
  padding: 5px 0px 5px 0px;
  cursor: pointer;
  transition: .2s;
  -webkit-transition: .2s;
  -moz-transition: .2s;
  width: fit-content;
}
.footer-section ul li a {
  color: #999999;
  text-decoration: none;
  font-size: 14px;
  font-family: inherit;
  padding: 5px 0px 5px 0px;
  cursor: pointer;
  transition: .2s;
  -webkit-transition: .2s;
  -moz-transition: .2s;
}
.footer-section ul li a:hover {
  color: #8b6b3d;
  text-decoration: none;
  font-size: 14px;
  font-family: inherit;
  padding: 5px 0px 5px 0px;
  cursor: pointer;
  transition: .2s;
  -webkit-transition: .2s;
  -moz-transition: .2s;
}
.footer-section ul li:hover {
  color: #8b6b3d;
  text-decoration: none;
  font-size: 14px;
  font-family: inherit;
  padding: 5px 0px 5px 0px;
  cursor: pointer;
  transition: .2s;
  -webkit-transition: .2s;
  -moz-transition: .2s;
}
.footer-section ul li.address {
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-section ul li.address .fa {
  margin-right: 5px;
  font-size: 1.2rem;
}
.footer-section ul li.email {
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-section ul li.email .fa {
  margin-right: 5px;
  font-size: 1.2rem;
}
.footer-section ul li.phone {
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-section ul li.phone .fa {
  margin-right: 5px;
  font-size: 1.2rem;
}
.footer-bottom .social-media {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 1.8rem;
}
.footer-bottom .social-media a {
  color: #999999;
  transition: color 0.3s;
}
.footer-bottom .social-media a:hover {
  color: #8b6b3d;
}
.footer-bottom {
  margin: 0;
  font-size: 14px;
  color: #999999;
}
.payment-methods {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.footer-bottom .payment-methods img {
  width: 40px;
  transition: transform 0.3s;
}
.footer-bottom .payment-methods img:hover {
  transform: scale(1.1);
}
.footer-bottom p{
  padding: 0 !important;
  margin: 0 !important;
}
@media (max-width: 1200px) {
  .footer-bottom .social-media {
    font-size: 1.4rem;
  }
  .footer-bottom .payment-methods img {
    width: 30px;
  }
  h6{
    font-size: .8rem;
  }
  .footer-section ul{
    text-align: start !important;
    align-items: start !important;
  }
  h3{
    text-align: start;
  }
  .footer-bottom{
    padding: 0;
  }
}
@media (max-width: 768px) {
  .footer-bottom{
    flex-direction: column;
  }
}

</style>