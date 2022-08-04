import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
// import vue3GoogleLogin from "vue3-google-login"
import 'bootstrap-icons/font/bootstrap-icons.css'
import "bootstrap"
// import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')

