import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Schema UI",
  description: "基于 Schema 驱动的企业级 Vue3 组件库",
  ssr: {
      noExternal: ['element-plus', '@convenient-ui/vue-ui']
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'Schema 配置详解', link: '/components/schema' }, // 🌟 加上这行！
      { text: 'GitHub', link: 'https://github.com/你的用户名/schema-ui' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'ProTable 超级表格', link: '/components/pro-table' },
          { text: 'ProDialogForm 弹窗表单', link: '/components/pro-dialog-form' }, // 👈 加到这里！
          { text: 'ProForm 弹窗表单', link: '/components/pro-form' } // 👈 加到这里！
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
