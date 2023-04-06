import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from './includes/validation'

import { auth } from './includes/firebase'

import './assets/main.css'
import './assets/base.css'

import Icon from './directives/icon'
import i18n from './includes/i18n'

let app

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin)
    app.use(i18n)
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
