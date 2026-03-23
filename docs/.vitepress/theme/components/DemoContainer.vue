<template>
  <div class="demo-container">
    <div class="demo-render">
      <slot />
    </div>

    <div class="demo-actions">
      <el-button link @click="copyCode">复制代码</el-button>
      <el-button link @click="isExpanded = !isExpanded">
        {{ isExpanded ? '隐藏代码' : '查看全部代码' }}
      </el-button>
    </div>

    <div v-show="isExpanded" class="demo-code">
      <slot name="code" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps(['code'])
const isExpanded = ref(false)

const copyCode = async () => {
  try {
    // 这里传入你想复制的字符串变量
    await navigator.clipboard.writeText(props.code)
    ElMessage.success('复制成功')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
}
.demo-render {
  padding: 24px;
}
.demo-actions {
  padding: 8px 16px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: flex-end;
  background-color: var(--vp-c-bg-soft);
}
.demo-code {
  border-top: 1px solid var(--vp-c-divider);
}
/* 隐藏插槽内 pre 标签的默认边距 */
:deep(pre) {
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>