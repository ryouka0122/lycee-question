import { createApp } from 'vue'
import './style.css'
import App from '@/App.vue'

import router from "@/router"
import vuetify from "@/plugins/vuetify"
import { createPinia } from 'pinia'


console.log("env:", JSON.parse(JSON.stringify(import.meta.env)))

createApp(App)
  .use(router)
  .use(createPinia())
  .use(vuetify)
  .mount('#app')
