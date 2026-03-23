## 进阶用法：自定义列渲染 (Slots)

在真实的业务场景中，单纯的文本展示往往不够。`ProTable` 提供了强大的插槽（Slot）功能。
在配置中设置 `type: 'slot'` 或 `type: 'action'`，然后在模板中用 `prop` 的名称作为插槽名，即可完美接管渲染逻辑！

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import DemoContainer from '../.vitepress/theme/components/DemoContainer.vue'

const slotRawCode = `
<template>
  <ProTable :data="data" :columns="columns">
    <template #status="{ row }">
      <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="dark">
        {{ row.status === 1 ? '正常' : '封禁' }}
      </el-tag>
    </template>

    <template #action="{ row }">
      <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button link type="danger" size="small">删除</el-button>
    </template>
  </ProTable>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const data = ref([
  { id: 101, name: '尤雨溪', role: '超级管理员', status: 1 },
  { id: 102, name: 'Evan You', role: '普通用户', status: 0 }
])

const columns = [
  { prop: 'name', label: '用户昵称' },
  { prop: 'role', label: '系统角色' },
  // 核心：设置 type 为 slot，插槽名为 prop 的值 'status'
  { prop: 'status', label: '账号状态', type: 'slot' }, 
  { prop: 'action', label: '操作', type: 'action', width: '150', fixed: 'right' }
]

const handleEdit = (row) => ElMessage.success('正在编辑：' + row.name)
<\/script>
`

const advanceData = ref([
  { id: 101, name: '尤雨溪', role: '超级管理员', status: 1 },
  { id: 102, name: 'Evan You', role: '普通用户', status: 0 }
])

// 🌟 完美契合你原版底层逻辑的 Schema 配置
const advanceColumns = [
  { prop: 'name', label: '用户昵称' },
  { prop: 'role', label: '系统角色' },
  { prop: 'status', label: '账号状态', type: 'slot' }, 
  { prop: 'action', label: '操作', type: 'action', width: '150', fixed: 'right' }
]

const handleAdvanceEdit = (row: any) => {
  ElMessage.success('正在编辑：' + row.name)
}
</script>

<DemoContainer :code="slotRawCode">
  <ProTable :data="advanceData" :columns="advanceColumns"><template #status="{ row }"><el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="dark">{{ row.status === 1 ? '正常' : '封禁' }}</el-tag></template><template #action="{ row }"><el-button link type="primary" size="small" @click="handleAdvanceEdit(row)">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template></ProTable>

<template #code>

```vue
<template>
  <ProTable :data="tableData" :columns="tableColumns">

    <template #status="{ row }">
      <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="dark">
        {{ row.status === 1 ? '正常' : '封禁' }}
      </el-tag>
    </template>

    <template #action="{ row }">
      <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button link type="danger" size="small">删除</el-button>
    </template>

  </ProTable>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'

  const tableData = ref([
    { id: 101, name: '尤雨溪', role: '超级管理员', status: 1 },
    { id: 102, name: 'Evan You', role: '普通用户', status: 0 }
  ])

  const tableColumns = [
    { prop: 'name', label: '用户昵称' },
    { prop: 'role', label: '系统角色' },
    // 🌟 使用底层自带的 type: 'slot' 和 type: 'action'
    { prop: 'status', label: '账号状态', type: 'slot' },
    { prop: 'action', label: '操作', type: 'action', width: '150', fixed: 'right' }
  ]

  const handleEdit = (row) => {
    ElMessage.success('正在编辑：' + row.name)
  }
</script>
```
</template>
</DemoContainer>


## API 参考

### ProTable 属性 (Props)

| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| `data` | 显示的数据列表 | `Array` | `[]` |
| `columns` | 表格列配置数组 (核心) | `TableColumnSchema[]` | `[]` |
| `loading` | 是否显示加载中动画 | `boolean` | `false` |

### 🌟 TableColumnSchema 配置项

`columns` 数组中的每一个对象代表表格的一列，底层完美透传并兼容 Element Plus 的 `<el-table-column>` 属性。

| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| `prop` | 字段名 (对应 data 数据项中的 key) | `string` | `-` |
| `label` | 表头显示的标题 | `string` | `-` |
| `width` | 对应列的宽度 | `string` | `-` |
| `min-width` | 对应列的最小宽度 | `string` | `-` |
| `type` | 对应列的类型 (如 `index`, `selection`, `expand`) | `string` | `-` |
| `fixed` | 列是否固定在左侧或者右侧 (`left` / `right`) | `string \| boolean` | `-` |
| `align` | 对齐方式 (`left` / `center` / `right`) | `string` | `'left'` |
| `slot` | 自定义插槽名称（用于接管该列的自定义渲染） | `string` | `-` |

> **💡 架构师提示：**
> 得益于底层良好的封装，如果在上述 Schema 中遇到未列出的属性，只要是 Element Plus 官方 `<el-table-column>` 支持的属性，你可以直接写在配置对象里，组件会自动向下透传！