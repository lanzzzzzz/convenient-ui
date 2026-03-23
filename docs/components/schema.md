# 核心 Schema 配置详解

在 Schema UI 中，我们推崇**数据驱动视图**。
无论是超级表格、动态表单还是弹窗表单，它们底层的核心 API 都是高度统一的 `columns` 配置。掌握了 Schema，你就掌握了整个组件库的灵魂。

---

## 📝 FieldSchema (表单列配置)

适用于 `<ProForm>` 和 `<ProDialogForm>`。每一个配置对象代表表单中的一个独立控件。

### 基础属性
| 属性名 | 说明 | 类型 | 默认值 | 必填 |
| ------ | ---- | ---- | ------ | ---- |
| `prop` | 绑定的数据字段名（也是提交给后端的 key） | `string` | `-` | **是** |
| `label` | 表单项左侧的标签文本 | `string` | `-` | **是** |
| `component` | 渲染的底层组件类型（如 `input`, `select`, `switch`, `date` 等） | `string` | `'input'` | 否 |
| `defaultValue`| 表单初始化或重置时的默认值 | `any` | `-` | 否 |
| `span` | 栅格布局占据的列数 (基于 Element Plus 的 24 栅格体系) | `number` | `24` | 否 |

### 🌟 高级属性
| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| `props` | **透传属性**：直接传给底层 Element Plus 组件的 props（例如 `placeholder`, `disabled`, `options` 等）。官方组件支持什么，这里就支持什么！ | `Record<string, any>` | `{}` |
| `rules` | 表单校验规则，完美兼容 async-validator 规范（同 Element Plus `el-form` 的 rules） | `RuleItem[]` | `[]` |

---

## 📊 TableColumnSchema (表格列配置)

适用于 `<ProTable>`。它不仅包含了表格展示的逻辑，还**内置了搜索表单的生成逻辑**！

### 基础展示属性
| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| `prop` | 对应数据的字段名 | `string` | `-` |
| `label` | 表头显示的标题 | `string` | `-` |
| `width` | 对应列的宽度 | `string` | `-` |
| `min-width` | 对应列的最小宽度 | `string` | `-` |
| `fixed` | 列是否固定在左侧或者右侧 (`left` / `right`) | `string \| boolean` | `-` |
| `align` | 对齐方式 (`left` / `center` / `right`) | `string` | `'left'` |

### 🌟 渲染与插槽属性 (核心)
| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| `type` | 列类型 (`index`, `selection`, `expand`, `slot`, `action`) | `string` | `-` |
| `slot` | **具名插槽名**：指定该列使用哪个 template 插槽进行自定义渲染 | `string` | `-` |
| `render` | **JSX 渲染器**：如果不喜欢写插槽，可直接传入一个返回 VNode 的函数渲染内容 | `(scope: { row, index }) => VNode` | `-` |
| `headerRender`| **自定义表头渲染器**：支持通过 JSX 动态渲染复杂的表头 | `(scope) => VNode` | `-` |
| `actions` | 当 `type: 'action'` 时，传入的按钮配置数组 (含操作按钮的 label, type, onClick 等) | `ActionItem[]` | `-` |

### 🔍 搜索表单专属属性 (ProTable 独有魔法)
在 ProTable 中，你可以直接在表格的 Schema 里配置搜索项，引擎会自动提取并渲染顶部的搜索表单！

| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| `search` | **开启搜索**：设为 `true`，该列对应的字段会自动出现在顶部的搜索表单中 | `boolean` | `false` |
| `searchOrder` | 搜索表单项的排序权重（数字越小越靠前） | `number` | `0` |
| `serializer` | **参数序列化器**：提交搜索前，对该字段的值进行转换（例如把一个日期范围数组拆分成 startTime 和 endTime） | `(value: any) => Record<string, any>` | `-` |

---

## 💡 最佳实践：如何组织你的 Schema

在真实开发中，我们强烈建议将 Schema 提取到单独的 `.ts` 文件中，而不是写在 `.vue` 模板里。

**示例项目结构：**
```text
src/views/user/
├── index.vue      # 只负责引入组件和组装逻辑
└── schema.ts      # 专注定义 columns 数组