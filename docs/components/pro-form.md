# ProForm 动态表单

作为组件库的核心引擎，`ProForm` 彻底改变了前端写表单的方式。
只需传入一份 JSON 配置（Columns），剩下的统统交给引擎！

## 基础演示

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import DemoContainer from '../.vitepress/theme/components/DemoContainer.vue'
// 1. 准备好要显示在“复制代码”里的字符串
const rawCode = `
<template>
  <ProForm 
    v-model="formData" 
    :columns="formColumns" 
    @submit="handleSubmit"
  />
</template>

<script setup>
const formData = ref({ username: '架构师', status: true })
const formColumns = [
  { prop: 'username', label: '用户昵称', component: 'input' },
  { prop: 'status', label: '启用状态', component: 'switch' }
]
const handleSubmit = (val) => console.log(val)
<\/script>
`

// 2. 实际运行的数据
const formData = ref({
  username: '架构师',
  status: true,
  role: 'admin',
  joinDate: '2026-03-22'
})

const formColumns = [
  { 
    prop: 'username', 
    label: '用户昵称', 
    component: 'input', 
    rules: [{ required: true, message: '请输入昵称', trigger: 'blur' }] 
  },
  { 
    prop: 'role', 
    label: '系统角色', 
    component: 'select', 
    props: {
      options: [
        { label: '超级管理员', value: 'admin' },
        { label: '普通用户', value: 'user' }
      ]
    }
  },
  {
    prop: 'joinDate',
    label: '入职时间',
    component: 'date',
    props: { type: 'date', valueFormat: 'YYYY-MM-DD' }
  },
  { prop: 'status', label: '启用状态', component: 'switch' }
]

const handleSubmit = (validData) => {
  ElMessage.success('提交成功！')
}
const handleReset = () => {
  ElMessage.warning('表单已重置')
}
</script>

<DemoContainer :code="rawCode">
  <ProForm 
    v-model="formData" 
    :columns="formColumns" 
    label-width="120px"
    @submit="handleSubmit"
    @reset="handleReset"
  >
</ProForm>

<template #code>

```typescript
const formColumns = [
  { prop: 'username', label: '用户昵称', component: 'input' },
  { prop: 'role', label: '系统角色', component: 'select', props: { options: [...] } },
  { prop: 'status', label: '启用状态', component: 'switch' }
]
```
</template>

</DemoContainer>
当前表单数据实时预览：

<div class="language-json">
  <pre><code>{{ JSON.stringify(formData, null, 2) }}</code></pre>
</div>

## API 参考

| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| `v-model` | 表单绑定的数据对象 | `Record<string, any>` | `{}` |
| `columns` | 表单项配置数组 | `FieldSchema[]` | `[]` |
| `label-width` | 标签宽度 | `string` | `'100px'` |
| `hide-action` | 是否隐藏底部的提交按钮 | `boolean` | `false` |

`columns` 数组中的每一个对象代表一个表单项，支持以下丰富的配置。这就是 Schema 引擎的“说明书”：

| 属性名 | 说明 | 类型 | 默认值 | 必填 |
| ------ | ---- | ---- | ------ | ---- |
| `prop` | 绑定的数据字段名（对应 v-model 中的 key） | `string` | `-` | **是** |
| `label` | 表单项的左侧标签文本 | `string` | `-` | **是** |
| `component` | 渲染的底层组件类型（如 `input`, `select`, `switch`, `date` 等） | `string` | `'input'` | 否 |
| `props` | 🌟 **透传属性**：直接传给底层组件的 props（如 `placeholder`, `disabled`, `options` 等） | `Record<string, any>` | `{}` | 否 |
| `rules` | 表单校验规则，完全兼容 Element Plus 的 async-validator 规范 | `RuleItem[]` | `[]` | 否 |
| `span` | 栅格布局占据的列数 (基于 24 栅格) | `number` | `24` | 否 |
| `defaultValue`| 表单初始化或重置时的默认值 | `any` | `-` | 否 |

> **💡 关于 `props` 透传的说明：**
> 如果你在 `component` 里写了 `'select'`，那么 `props` 里的所有属性都会原封不动地传给 `<el-select>`。这意味着 Element Plus 官方文档里支持的属性，这里全部支持！

### Events (事件)

| 事件名 | 说明 | 回调参数 |
| ------ | ---- | -------- |
| `submit` | 点击提交并完成内部校验后触发 | `(validData: Record<string, any>)` |
| `reset` | 点击重置按钮后触发 | `-` |