import AntdvMobile from '@antdv-next/mobile'
import { createApp } from 'vue'
import { setDocsLocale } from '../shared/locale'
import App from './App.vue'
import { router } from './router'
import { setupTouchEmulator } from './touch-emulator'
import './style.css'

setupTouchEmulator()

const requestedLocale = new URLSearchParams(window.location.search).get('lang')
if (requestedLocale === 'zh-CN' || requestedLocale === 'en-US')
  setDocsLocale(requestedLocale)

createApp(App).use(router).use(AntdvMobile).mount('#app')
