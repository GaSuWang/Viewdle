import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
import { SetupCalendar } from 'v-calendar';
import 'bootstrap-icons/font/bootstrap-icons.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import VueCountdown from '@chenfengyuan/vue-countdown';

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons


const app = createApp(App)
app.use(store)
app.use(router)
app.use(SetupCalendar, {})
app.component(VueCountdown.name, VueCountdown);
app.use(PrimeVue);
app.component('Button',Button)
// Use the components
app.mount('#app')

