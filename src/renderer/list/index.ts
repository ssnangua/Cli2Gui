import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@assets/iconfont/iconfont.css'
import App from './App.vue'
import MyComponents from '@components/index'
import useI18n from '@store/useI18n'
import { APP_NAME } from '@shared/constants'

document.title = APP_NAME

const app = createApp(App)
app.use(useI18n().i18n)
app.use(ElementPlus)
app.use(MyComponents)
app.mount('#app')
