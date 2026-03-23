# 快速开始 (Quick Start)

寥寥几步，即可在你的项目中体验企业级 Schema 驱动的魅力。

## 环境准备

本组件库全面拥抱 Vue 3 生态，并在底层深度整合了 Element Plus。
在使用前，请确保你的项目环境满足以下版本要求：
* **Vue** `^3.2.0`
* **Element Plus** `^2.3.0`

---

## 安装 Convenient UI

推荐使用 `pnpm` 进行依赖管理，你也可以选择 `npm` 或 `yarn`。

::: code-group

```bash [pnpm]
pnpm add @convenient-ui/vue-ui element-plus
```

```bash[npm]
npm install @convenient-ui/vue-ui element-plus
```

```bash[yarn]
yarn add @convenient-ui/vue-ui element-plus
```

## 引入并使用

在你的项目的入口文件（通常是 `main.ts` 或 `main.js`）中，全局引入组件库和样式：

```typescript
import { createApp } from 'vue'
import App from './App.vue'

// 1. 引入 Element Plus 及样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 2. 🌟 引入 Convenient UI 及核心样式
import ConvenientUI from '@convenient-ui/vue-ui'
import '@convenient-ui/vue-ui/dist/style.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(ConvenientUI) // 一键注册所有 Pro 组件

app.mount('#app')
```