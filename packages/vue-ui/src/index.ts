import { App } from 'vue';
import ProTable from './components/ProTable/index.vue';
import ProForm from './components/ProForm/index.vue';
import ProDialogForm  from './components/ProDialogForm/index.vue';

// 🌟 1. 引入你想作为“开箱即用”兜底的 Element Plus 基础表单组件
import {
    ElInput,
    ElSelect,
    ElSwitch,
    ElInputNumber,
    ElDatePicker,
    ElTimePicker,
    ElRadioGroup,
    ElCheckboxGroup
} from 'element-plus';

// 🌟 2. 引入你的注册逻辑
import { registerComponent, registerComponents } from './composables/useComponentRegistry';

// 🌟 3. 立即执行：注入基础组件灵魂！
// 这样业务侧（或 VitePress）只要引入了 UI 包，就再也不用担心找不到 input 了
registerComponent('input', ElInput);
registerComponent('select', ElSelect);
registerComponent('switch', ElSwitch);
registerComponent('number', ElInputNumber);
registerComponent('date', ElDatePicker);
registerComponent('time', ElTimePicker);
registerComponent('radio', ElRadioGroup);
registerComponent('checkbox', ElCheckboxGroup);

// 导出单独组件
export { ProTable, ProForm, ProDialogForm };
export { registerComponent, registerComponents };

// 导出默认安装插件 (Vue.use)
export default {
    install(app: App) {
        app.component('ProTable', ProTable);
        app.component('ProForm', ProForm);
        app.component('ProDialogForm', ProDialogForm);
    }
};

// 导出类型
export * from '@convenient-ui/types';