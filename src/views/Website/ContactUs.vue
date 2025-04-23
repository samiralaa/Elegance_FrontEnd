<template>
  <div class="contact-us">
    <h1>Contact Us</h1>
    <form @submit.prevent="submitForm" class="contact-form">
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
      <button type="submit" :disabled="loading">Send Message</button>
      <p v-if="success" class="success">Your message has been sent!</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <div class="contact-info">
      <h2>Our Contact Information</h2>
      <p>Email: info@elegance.com</p>
      <p>Phone: +1 234 567 890</p>
      <p>Address: 123 Elegance St, City, Country</p>
      <!-- Optionally, embed a map here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactUs',
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
.contact-us {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
input, textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.75rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #90caf9;
  cursor: not-allowed;
}
.success {
  color: green;
}
.error {
  color: red;
}
.contact-info {
  margin-top: 2rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 6px;
}
</style>