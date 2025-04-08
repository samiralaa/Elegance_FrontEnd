<template>
  <el-button-group>
    <el-button 
      :type="locale === 'en' ? 'primary' : 'default'"
      @click="switchLanguage('en')"
    >
      {{ $t('common.languages.english') }}
    </el-button>
    <el-button 
      :type="locale === 'ar' ? 'primary' : 'default'"
      @click="switchLanguage('ar')"
    >
      {{ $t('common.languages.arabic') }}
    </el-button>
  </el-button-group>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { setDirection } from '../utils/theme'

const { locale } = useI18n()

const switchLanguage = (lang) => {
  const direction = lang === 'ar' ? 'rtl' : 'ltr'
  setDirection(direction)
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style scoped>
.el-button-group {
  margin: 0 8px;
}

.el-button {
  min-width: 90px;
}
</style> 