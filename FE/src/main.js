import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
import vue3GoogleLogin from "vue3-google-login"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
// import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(vue3GoogleLogin, {
    clientId: "835634401246-ddaeprck32cbkjmajefeffl5vh7f5kd6.apps.googleusercontent.com"
})
app.mount('#app')

