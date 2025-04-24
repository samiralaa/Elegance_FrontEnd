<template>
  <div class="settings-container p-6">
    <h1 class="text-2xl font-semibold mb-6">Website Settings</h1>

    <!-- Module Toggles -->
    <section class="mb-8 p-4 border rounded-lg shadow-sm">
      <h2 class="text-xl font-medium mb-4">Module Management</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="flex items-center justify-between p-3 border rounded">
          <label for="categories-toggle" class="font-medium">Categories</label>
          <input type="checkbox" id="categories-toggle" v-model="settings.modules.categories" class="toggle-switch" />
        </div>
        <div class="flex items-center justify-between p-3 border rounded">
          <label for="products-toggle" class="font-medium">Products</label>
          <input type="checkbox" id="products-toggle" v-model="settings.modules.products" class="toggle-switch" />
        </div>
        <div class="flex items-center justify-between p-3 border rounded">
          <label for="blog-toggle" class="font-medium">Blog</label>
          <input type="checkbox" id="blog-toggle" v-model="settings.modules.blog" class="toggle-switch" />
        </div>
        <!-- Add more module toggles as needed -->
      </div>
    </section>

    <!-- Theme Selection -->
    <section class="mb-8 p-4 border rounded-lg shadow-sm">
      <h2 class="text-xl font-medium mb-4">Appearance</h2>
      <div class="flex items-center space-x-4">
        <label class="font-medium">Theme:</label>
        <div class="flex space-x-3">
          <label class="flex items-center">
            <input type="radio" name="theme" value="light" v-model="settings.theme" class="mr-1">
            Light
          </label>
          <label class="flex items-center">
            <input type="radio" name="theme" value="dark" v-model="settings.theme" class="mr-1">
            Dark
          </label>
          <label class="flex items-center">
            <input type="radio" name="theme" value="custom" v-model="settings.theme" class="mr-1">
            Custom
          </label>
        </div>
      </div>
      <!-- Add custom theme options if 'custom' is selected -->
    </section>

    <!-- Global Configurations -->
    <section class="mb-8 p-4 border rounded-lg shadow-sm">
      <h2 class="text-xl font-medium mb-4">Global Configuration</h2>
      <div class="space-y-4">
        <div class="flex flex-col">
          <label for="site-title" class="mb-1 font-medium">Site Title</label>
          <input type="text" id="site-title" v-model="settings.global.siteTitle" class="p-2 border rounded" />
        </div>
        <div class="flex flex-col">
          <label for="site-logo" class="mb-1 font-medium">Logo URL</label>
          <input type="text" id="site-logo" v-model="settings.global.logoUrl" placeholder="Enter URL or path to logo" class="p-2 border rounded" />
          <!-- Consider adding a file upload component here -->
        </div>
        <div class="flex flex-col">
          <label for="contact-email" class="mb-1 font-medium">Contact Email</label>
          <input type="email" id="contact-email" v-model="settings.global.contactEmail" class="p-2 border rounded" />
        </div>
        <div class="flex flex-col">
          <label for="homepage-layout" class="mb-1 font-medium">Homepage Layout</label>
          <select id="homepage-layout" v-model="settings.global.homepageLayout" class="p-2 border rounded bg-white">
            <option value="default">Default</option>
            <option value="featured-products">Featured Products</option>
            <option value="latest-blog">Latest Blog Posts</option>
            <!-- Add more layout options -->
          </select>
        </div>
      </div>
    </section>

    <div class="flex justify-end mt-6">
      <button @click="saveSettings" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save Settings
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const settings = reactive({
  modules: {
    categories: true,
    products: true,
    blog: false,
  },
  theme: 'light', // 'light', 'dark', 'custom'
  global: {
    siteTitle: 'Elegance Website',
    logoUrl: '/img/logo.png',
    contactEmail: 'contact@elegance.com',
    homepageLayout: 'default',
  },
});

const saveSettings = () => {
  // Placeholder for saving logic (e.g., API call, local storage)
  console.log('Saving settings:', JSON.parse(JSON.stringify(settings)));
  alert('Settings saved (check console)! Actual saving mechanism needs implementation.');
};

</script>

<style scoped>
/* Basic styling for toggle switches - replace with your preferred UI library or custom styles */
.toggle-switch {
  /* Tailwind classes for a basic toggle switch appearance */
  @apply relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
  /* Background color when off */
  @apply bg-gray-200;
}

.toggle-switch::after {
  @apply inline-block w-5 h-5 transform bg-white rounded-full shadow ring-0 transition-transform ease-in-out duration-200;
  content: '';
  /* Translate X when off */
  @apply translate-x-0.5;
}

input:checked + .toggle-switch {
  /* Background color when on */
  @apply bg-indigo-600;
}

input:checked + .toggle-switch::after {
  /* Translate X when on */
  @apply translate-x-5;
}

/* Hide the actual checkbox */
input[type="checkbox"].toggle-switch {
  @apply sr-only;
}

/* Add other component-specific styles here */
input[type="text"],
input[type="email"],
select {
  width: 100%; /* Make inputs take full width of their container */
  @apply shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md;
}

/* Ensure labels and inputs align nicely */
label {
    @apply block text-sm font-medium text-gray-700;
}

/* Adjust spacing and alignment for radio buttons */
.flex.items-center.space-x-4 > .flex.space-x-3 label {
    @apply text-sm font-medium text-gray-700;
}

/* Add padding and border to sections */
section {
    @apply bg-white p-6 rounded-lg border border-gray-200 shadow-md;
}

/* Style the save button */
button {
    @apply bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

/* Add some overall padding if needed, though p-6 is on the container */
.settings-container {
    @apply max-w-4xl mx-auto;
}

/* Adjust grid layout for responsiveness */
.grid {
    @apply gap-6;
}

.flex.items-center.justify-between {
    @apply bg-gray-50 p-4 rounded-md border border-gray-200;
}

/* Style the radio buttons */
input[type="radio"] {
    @apply focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300;
}

</style>