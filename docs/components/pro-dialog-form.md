## 进阶用法：异步控制与自定义插槽

在真实业务中，弹窗表单最麻烦的是**管理提交按钮的 Loading 状态**和**渲染复杂的自定义组件（如上传、富文本）**。
`ProDialogForm` 完美解决了这两个痛点：
1. 提交时自动开启 Loading，并提供 `close` 和 `stopLoading` 方法供你精准控制。
2. 支持 `slot` 配置，轻松接入任何第三方组件！

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import DemoContainer from '../.vitepress/theme/components/DemoContainer.vue'

const advanceRawCode = `
<template>
  <el-button type="warning" @click="handleOpen">进阶场景演示</el-button>

  <ProDialogForm 
    ref="advanceDialogRef" 
    :columns="advanceColumns" 
    width="600px"
    label-width="120px"
    @submit="handleAdvanceSubmit" 
  >
    <template #avatarUpload>
      <div style="width: 100%; border: 1px dashed #d9d9d9; padding: 20px; text-align: center; border-radius: 6px; cursor: pointer;">
        <i class="el-icon-plus"></i> 点击上传头像 (模拟)
      </div>
    </template>
  </ProDialogForm>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const advanceDialogRef = ref()

const advanceColumns = [
  { prop: 'title', label: '文章标题', component: 'input', rules: [{ required: true, message: '必填' }] },
  // 声明使用插槽
  { prop: 'avatar', label: '文章封面', type: 'slot', slot: 'avatarUpload' },
  { prop: 'isPublish', label: '直接发布', component: 'switch', defaultValue: true }
]

const handleOpen = () => advanceDialogRef.value.open({ title: '发布新文章' })

const handleAdvanceSubmit = async (formData, { close, stopLoading }) => {
  // 按钮此时已经自动变成 Loading 状态...
  try {
    // 模拟网络请求耗时 2 秒
    await new Promise((resolve, reject) => setTimeout(() => {
      // 模拟 50% 的概率请求失败
      Math.random() > 0.5 ? resolve() : reject(new Error('网络超时'))
    }, 2000))
    
    ElMessage.success('发布成功！')
    close() // 成功：关闭整个弹窗
  } catch (err) {
    ElMessage.error('发布失败：' + err.message)
    stopLoading() // 失败：弹窗不关，仅停止按钮的 Loading 状态让用户重试
  }
}
<\/script>
`

const advanceDialogRef = ref()

const advanceColumns = [
  { prop: 'title', label: '文章标题', component: 'input', rules: [{ required: true, message: '请输入标题', trigger: 'blur' }] },
  { prop: 'avatar', label: '文章封面', type: 'slot', slot: 'avatarUpload' },
  { prop: 'isPublish', label: '直接发布', component: 'switch', defaultValue: true }
]

const handleOpen = () => {
  advanceDialogRef.value.open({ title: '发布新文章' })
}

const handleAdvanceSubmit = async (formData: any, { close, stopLoading }: any) => {
  try {
    // 模拟网络请求耗时 2 秒
    await new Promise((resolve, reject) => setTimeout(() => {
      // 模拟一定概率失败，展示 stopLoading 的作用
      Math.random() > 0.3 ? resolve(true) : reject(new Error('服务器繁忙，请重试'))
    }, 2000))
    
    ElMessage.success('发布成功！数据：' + JSON.stringify(formData))
    close()
  } catch (err: any) {
    ElMessage.error(err.message)
    stopLoading() // 🌟 核心：发生错误时，不关闭弹窗，只恢复按钮状态
  }
}
</script>

<DemoContainer :code="advanceRawCode">
  <div style="margin-bottom: 16px;">
    <el-button type="warning" @click="handleOpen">进阶场景：异步控制与自定义插槽</el-button>
  </div>

<ProDialogForm
    ref="advanceDialogRef"
    :columns="advanceColumns"
    width="600px"
    label-width="120px"
    @submit="handleAdvanceSubmit"
>
    <template #avatarUpload>
        <div style="width: 100%; border: 1px dashed var(--vp-c-divider); padding: 20px; text-align: center; border-radius: 6px; cursor: pointer; color: var(--vp-c-text-2);">+ 点击上传封面 (自定义插槽演示)
        </div>
    </template>
</ProDialogForm>

<template #code>

```vue
<template>
  <el-button type="warning" @click="handleOpen">进阶场景演示</el-button>

  <ProDialogForm 
    ref="advanceDialogRef" 
    :columns="advanceColumns" 
    width="600px"
    label-width="120px"
    @submit="handleAdvanceSubmit" 
  >
    <template #avatarUpload>
      <div class="mock-upload">
        + 点击上传封面 (插槽演示)
      </div>
    </template>
  </ProDialogForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const advanceDialogRef = ref()

const advanceColumns = [
  { prop: 'title', label: '文章标题', component: 'input', rules: [{ required: true, message: '必填' }] },
  // 🌟 声明使用插槽
  { prop: 'avatar', label: '文章封面', type: 'slot', slot: 'avatarUpload' },
  { prop: 'isPublish', label: '直接发布', component: 'switch', defaultValue: true }
]

const handleOpen = () => advanceDialogRef.value.open({ title: '发布新文章' })

// 🌟 核心点：利用 actions 参数精准控制按钮状态和弹窗生命周期
const handleAdvanceSubmit = async (formData, { close, stopLoading }) => {
  try {
    await new Promise((resolve, reject) => setTimeout(() => {
      Math.random() > 0.3 ? resolve(true) : reject(new Error('模拟网络故障'))
    }, 2000))
    
    ElMessage.success('发布成功！')
    close() // 成功：关闭整个弹窗
  } catch (err) {
    ElMessage.error('发布失败：' + err.message)
    stopLoading() // 失败：弹窗不关，仅停止按钮 Loading 让用户重试
  }
}
</script>
```
</template>
</DemoContainer>


## API 参考

### ProDialogForm 属性 (Props)

除了支持双向绑定外，本组件核心依托于底层 `ProForm`，因此 Schema 配置完全互通。

| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| `visible` / `v-model:visible` | 控制弹窗显示/隐藏（声明式调用） | `boolean` | `false` |
| `title` | 弹窗左上角的标题文本 | `string` | `'表单'` |
| `columns` | 表单项配置数组，直接透传给内部 ProForm | `FieldSchema[]` | `[]` |
| `width` | 弹窗的宽度 | `string` | `'60%'` |
| `label-width` | 表单标签的宽度 | `string` | `'100px'` |

> **💡 架构师提示：**
> 虽然组件支持传统的 `v-model:visible` 方式打开弹窗，但在真实的中后台 CRUD 场景中，我们**强烈建议使用 `ref.open()` 的命令式调用**。它能帮你省去在外部维护可见性状态和表单回显数据的无聊代码。

### 🌟 暴露的方法 (Expose)

通过给组件绑定 `ref`，你可以直接调用以下核心方法：

| 方法名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `open` | 🚀 **推荐**：命令式打开弹窗，支持动态修改标题和传入回显数据 | `options?: { title?: string, row?: Record<string, any> }` |
| `close` | 关闭弹窗 | `-` |
| `stopLoading` | 停止底部“确定”按钮的 Loading 状态（通常用于接口报错时） | `-` |

### Events (事件)

| 事件名 | 说明 | 回调参数 |
| ------ | ---- | -------- |
| `submit` | 点击确定且表单校验通过后触发。注意它的第二个参数！ | `(validData: Record<string, any>, actions: { close: () => void, stopLoading: () => void })` |
| `update:visible` | 弹窗显隐状态改变时触发 | `(visible: boolean)` |