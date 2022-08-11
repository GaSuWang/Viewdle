import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
import { SetupCalendar } from 'v-calendar';
// import vue3GoogleLogin from "vue3-google-login"
import 'bootstrap-icons/font/bootstrap-icons.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
// import 'bootstrap-icons/font/bootstrap-icons.css'
import VueCountdown from '@chenfengyuan/vue-countdown';

const app = createApp(App)
app.use(store)
app.use(router)
app.use(SetupCalendar, {})
app.component(VueCountdown.name, VueCountdown);
// Use the components
app.mount('#app')

