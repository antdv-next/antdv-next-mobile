import AntdvNextMobile from 'antdv-next-mobile'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { setupTouchEmulator } from './touch-emulator'
import './style.css'

setupTouchEmulator()

createApp(App).use(router).use(AntdvNextMobile).mount('#app')
