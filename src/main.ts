import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import 'primeicons/primeicons.css'
import './core/styles/main.css'

import App from './App.vue'
import router from './router'
import { MyPreset } from './core/configs/primevue.config.ts'
import { ToastService } from 'primevue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.darkTheme',
    },
  },
  ripple: true,
})
app.use(ToastService);

app.mount('#app')
