
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/dependency/bootstrap-5.3.3-dist/css/bootstrap.min.css'

import '@/assets/dependency/bootstrap-5.3.3-dist/js/bootstrap.min.js'
import '@/assets/dependency/layui/css/layui.css'
import '@/assets/dependency/layui/layui.js'

import '@/assets/dependency/echarts-5.6.0-dist/echarts.js'

const app = createApp(App)

app.use(router)
app.use(ElementPlus,{
    locale:zhCn,
})
app.mount('#app')

for (const [key ,component] of Object.entries(ElementPlusIconsVue)){
    app.component(key,component)
}