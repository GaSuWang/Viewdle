import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
import { SetupCalendar } from 'v-calendar';
import 'bootstrap-icons/font/bootstrap-icons.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import VueCountdown from '@chenfengyuan/vue-countdown';
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(SetupCalendar, {})
app.component(VueCountdown.name, VueCountdown);
app.use(VueVideoPlayer)
// Use the components
app.mount('#app')

