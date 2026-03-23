// packages/vue-ui/src/composables/useComponentRegistry.ts
import type { Component } from 'vue';

// 🚀 核心优化 1：去掉响应式，使用纯原生 Map，性能最高
const componentRegistry = new Map<string, Component>();

/**
 * 暴露给业务侧的单次注册方法
 */
export const registerComponent = (type: string, component: Component) => {
    componentRegistry.set(type, component);
};

/**
 * 暴露给业务侧的批量注册方法
 */
export const registerComponents = (components: Record<string, Component>) => {
    Object.entries(components).forEach(([key, comp]) => {
        componentRegistry.set(key, comp);
    });
};

/**
 * 内部引擎读取组件的方法
 */
export const useComponent = (type: string = 'input'): Component => {
    const comp = componentRegistry.get(type);

    if (!comp) {
        console.warn(`[ProForm] 未注册的组件类型: "${type}"。请确保在系统初始化时调用了 registerComponent。`);

        // 🚀 核心优化 2：尝试回退到基础 input，如果连 input 都没注册，则阻断渲染以暴露问题
        const fallback = componentRegistry.get('input');
        if (!fallback) {
            throw new Error(`[ProForm] 致命错误：连基础兜底组件 'input' 都未注册！`);
        }
        return fallback;
    }

    return comp;
};