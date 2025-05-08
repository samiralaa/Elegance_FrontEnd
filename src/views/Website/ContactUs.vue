<template>
  <Header/>
  <div class="contact-us">
    <div class="container">
      <div class="title">
          <div class="container">
              <h2>{{ $t('contact.title') }}</h2>
          </div>
      </div>
      <div class="contact-container pb-5 mb-5">
        <div class="contact-body">
          <div class="content-info">
            <h2>
              We are always ready to assist
              you and answer any questions
              you may have
            </h2>
            <p>If you've got great products your making or looking to work
              with us then drop us a line.</p>
          </div>
          <div class="content-info">
            <h5>Our Store:</h5>
            <div class="info">
              <fa icon="location-dot" class="icon" />
              <a href="https://www.google.com/maps/place/37+%D8%B4%D8%A7%D8%B1%D8%B9+%D9%83%D9%92%D9%88%D9%8E%D8%A7%D8%B1+-+%D8%A2%D9%84+%D9%86%D9%87%D9%8A%D8%A7%D9%86+-+Zone+1+-+%D8%A3%D8%A8%D9%88+%D8%B8%D8%A8%D9%8A%E2%80%AD/@24.46297,54.383641,16z/data=!4m6!3m5!1s0x3e5e6629e81bf275:0xe4551295f406885e!8m2!3d24.4629696!4d54.3836411!16s%2Fg%2F11f6xf4mf4?hl=ar&entry=ttu&g_ep=EgoyMDI1MDUwNS4wIKXMDSoASAFQAw%3D%3D">37 Kwar St - Al Nahyan - E20-02 <br> Abu Dhabi - United Arab Emirates</a>
            </div>
          </div>  
          <div class="content-info">
            <h5>Working Hours:</h5>
            <div class="info">
              <fa icon="clock" class="icon" />
              <p>From <span>10:00 AM</span> to <span>10:00 AM</span></p>
            </div>
          </div>  
          <div class="content-info">
            <h5>Contact Us:</h5>
            <div class="info">
              <fa icon="envelope" class="icon" />
              <a href="mailto:Eleganceoud22@gmail.com">Eleganceoud22@gmail.com</a>
            </div>
            <div class="info">
              <fa icon="fab fa-whatsapp" class="icon" />
              <a href="https://wa.me/971544887138">+971 54 488 7138</a>
            </div>
          </div>  
        </div>
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="container">
            <div class="form-group">
              <label for="name">Name</label>
              <input v-model="form.name" type="text" id="name" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input v-model="form.email" type="email" id="email" required />
            </div>
            <div class="form-group">
              <label for="subject">Subject</label>
              <input v-model="form.subject" type="text" id="subject" required />
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea v-model="form.message" id="message" rows="5" required></textarea>
            </div>
            <div class="submit-btn">
              <button class="btn" type="submit" :disabled="loading">Send Message</button>
            </div>
            <p v-if="success" class="success">Your message has been sent!</p>
            <p v-if="error" class="error">{{ error }}</p>
          </div>
        </form>
      </div>
      <div class="contact-footer mb-5">
        <div class="content-info col-md-12 col-lg-6">
          <h2>
            We are always ready to assist
            you and answer any questions
            you may have
          </h2>
        </div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.6485909291746!2d54.386216025984375!3d24.462974461050244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e6629e81bf275%3A0xe4551295f406885e!2zMzcg2LTYp9ix2Lkg2YPZktmI2Y7Yp9ixIC0g2KLZhCDZhtmH2YrYp9mGIC0gWm9uZSAxIC0g2KPYqNmIINi42KjZig!5e0!3m2!1sar!2sae!4v1723272974133!5m2!1sar!2sae" frameborder="0" width="100%" height="500"></iframe>
      </div>
    </div>
  </div>
  <Footer/>
</template>

<script>
  import Header from '@/components/Website/Header.vue'
  import i18n from '@/i18n.js'
  import Footer from '@/components/Website/Footer.vue' 
export default {
  name: 'ContactUs',
  components: {
    Header,
    Footer,
  },
  computed: {
    direction() {
      return i18n.global.locale === 'ar' ? 'rtl' : 'ltr';
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      loading: false,
      success: false,
      error: null
    }
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.success = false;
      this.error = null;
      try {
        // Replace with your backend endpoint or email service
        // Example: await axios.post('/api/contact', this.form)
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
        this.success = true;
        this.form = { name: '', email: '', subject: '', message: '' };
      } catch (e) {
        this.error = 'Failed to send message. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  background: #f8f8f8;
  padding: 2rem 3rem;
  border-radius: 10px;
}
.title {
    margin-top: 30px;
    color: #8b6b3d;
}
.form-group {
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
}
input, textarea {
  padding: 0.5rem;
  background-color: #ececec;
  border: none;
  min-height: 40px;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.submit-btn {
  display: flex;
  justify-content: end;
}
button {
  position: relative;
  padding: 0.75rem 1.5rem;
  color: #8b6b3d;
  background-color: #f9f9f9;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  width: fit-content;
  overflow: hidden;
  z-index: 0;
  border-radius: 0;
}

button::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #8b6b3d;
  transition: height 0.3s ease;
  z-index: -1;
}

button:hover {
  color: #fff;
  border-radius: 6px;
}

button:hover::before {
  height: 100%;

}

button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.success {
  color: green;
}
.error {
  color: red;
}
.contact-body {
  margin-top: 0 2rem;
  padding: 0 1rem;
  border-radius: 6px;
  width: 100%;
}
.contact-container {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 2rem;
}
.content-info{
  margin: 2rem 0;
}
.content-info p{
    color: #7c7c7c;
    margin: 0;
}
.content-info span{
  color: #8b6b3d;
  font-weight: 600;
}
.info{
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
}
.info a {
  color: #7c7c7c;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
}
.info a:hover {
  color: #8b6b3d;
  cursor: pointer;
}
.icon {
  font-size: 1.5rem;
  color: #8b6b3d;
}
.contact-footer iframe {
  border-radius: 10px;
  width: 100%;
  height: 500px;
}
</style>