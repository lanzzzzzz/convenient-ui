import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            // 指定 tsconfig 文件路径，防止在 Monorepo 中读取错误
            tsconfigPath: './tsconfig.json',
            // 生成类型文件后是否把原来的 .vue.d.ts 删除（可选）
            cleanVueFileName: true,
            // 将类型文件输出到 dist 目录
            outDir: 'dist'
        })
    ],
    resolve: {
        // 配置别名，方便组件内部互相引用（可选，看你项目习惯）
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        // 库模式配置
        lib: {
            // 使用 resolve 解析绝对路径，确保 Windows/Mac 下都能找到
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'MyAdminVueUI', // UMD 模式下的全局变量名
            fileName: (format) => `index.${format}.js` // 输出文件名格式
        },
        rollupOptions: {
            // ⚠️ 关键：确保外部化处理那些你不想打包进库的依赖
            // 我们只把 Vue 和 ElementPlus 排除，让我们自己的 hooks 被打包进去
            external: ['vue', 'element-plus'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                    'element-plus': 'ElementPlus'
                },
                // 确保导出模式正确
                exports: 'named'
            }
        },
        // 压缩混淆配置
        minify: false,
        // 是否生成 source map (开发调试时很有用)
        sourcemap: true,
        // 清空输出目录
        emptyOutDir: true
    }
});