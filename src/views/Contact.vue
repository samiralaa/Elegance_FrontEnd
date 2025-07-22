<template>
  <div class="contact-page container py-4">
    <h2>Contact Messages</h2>
    <el-table :data="contacts" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="subject" label="Subject" />
      <el-table-column prop="message" label="Message" />
      <el-table-column prop="created_at" label="Created At" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const contacts = ref([])
const loading = ref(false)

const fetchContacts = async () => {
  loading.value = true
  try {
    const response = await axios.get('https://backend.webenia.org/api/contact')
    contacts.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch contacts', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchContacts)
</script>

<style scoped>
.contact-page {
  max-width: 900px;
  margin: 0 auto;
}
</style> 