import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// 引入我们的组件库
import MyAdminUI from '@convenient-ui/vue-ui'
import { registerComponents } from '@convenient-ui/vue-ui';
// 🔥 业务侧的按需引入，Tree-Shaking 完美生效！
import { ElInput, ElSelect, ElDatePicker, ElInputNumber } from 'element-plus';

// 初始化时，将基础组件注入到底层引擎中
registerComponents({
    'input': ElInput,
    'select': ElSelect,
    'date-picker': ElDatePicker,
    'input-number': ElInputNumber,
    // 🚀 最爽的是，业务侧随时可以把自己写的奇葩业务组件扔进去！
    // 'user-select': MyCustomUserSelectComponent
});
const app = createApp(App)

app.use(ElementPlus)
app.use(MyAdminUI) // 全局注册 ProTable

app.mount('#app')