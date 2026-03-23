// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import DemoContainer from "./components/DemoContainer.vue";
// 🌟 把 ProDialogForm 也引入进来
import { ProTable, ProForm, ProDialogForm } from '@convenient-ui/vue-ui'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        // 1. 全局注册 Element Plus
        app.use(ElementPlus)
        app.use(DemoContainer)
        // 2. 全局注册你的核心组件
        app.component('ProTable', ProTable)
        app.component('ProForm', ProForm)
        app.component('ProDialogForm', ProDialogForm) // 👈 补上这最后一块拼图！
    }
}