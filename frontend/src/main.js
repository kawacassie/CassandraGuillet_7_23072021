import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import 'bootstrap'
import 'sweetalert2'
import 'axios'

createApp(App).use(router).mount('#app')