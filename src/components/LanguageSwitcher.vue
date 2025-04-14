<template>
  <div class="language-switcher">
    <el-button-group>
      <el-button 
        :class="['lang-btn', { active: locale === 'en' }]"
        @click="switchLanguage('en')"
      >
        <span class="lang-code">EN</span>
        <span class="lang-name">{{ $t('common.languages.english') }}</span>
      </el-button>
      <el-button 
        :class="['lang-btn', { active: locale === 'ar' }]"
        @click="switchLanguage('ar')"
      >
        <span class="lang-code">ع</span>
        <span class="lang-name">{{ $t('common.languages.arabic') }}</span>
      </el-button>
    </el-button-group>
  </div>
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
.language-switcher {
  margin: 0 8px;
}

.lang-btn {
  min-width: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  border: 1px solid var(--el-border-color);
}

.lang-btn.active {
  background-color: var(--el-color-primary);
  color: white;
  border-color: var(--el-color-primary);
}

.lang-code {
  font-weight: bold;
  font-size: 0.9em;
}

.lang-name {
  font-size: 0.9em;
}

:deep(.el-button-group .el-button) {
  border-radius: 4px;
  margin: 0 4px;
}
</style>