import { createApp } from 'vue'
import "bootstrap/dist/css/bootstrap.css"
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './assets/styles/variables.css'
import './assets/styles/dashboard-variables.css'
import './assets/styles/dashboard-layout.css'
import './assets/styles/dashboard-components.css'
import './assets/styles/theme.css'
import i18n from './i18n'
import { initializeTheme } from './utils/theme'


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'


// Initialize theme and direction
const { theme, direction, lang } = initializeTheme()
document.documentElement.setAttribute('data-theme', theme)
document.documentElement.dir = direction
document.documentElement.lang = lang

const app = createApp(App)

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
app.use(router)
app.use(ElementPlus)
app.use(i18n)



library.add(fas)


app.component('fa', FontAwesomeIcon)

app.mount('#app')
import "bootstrap/dist/js/bootstrap.js"