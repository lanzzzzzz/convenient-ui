<template>
  <el-dialog
      v-model="dialogVisible"
      :title="currentTitle"
      :width="width"
      destroy-on-close
      append-to-body
      @closed="handleClosed"
  >
    <ProForm
        v-if="dialogVisible"
        ref="formRef"
        v-model="formData"
        :columns="columns"
        :label-width="labelWidth"
        :hide-action="true"
        @submit="handleProFormSubmit"
    />

    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 12px; width: 100%;">
        <el-button @click="close" :disabled="loading">取消</el-button>
        <el-button @click="formRef?.reset()" :disabled="loading">重置</el-button>
        <el-button type="primary" :loading="loading" @click="formRef?.submit()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElDialog, ElButton } from 'element-plus';
import ProForm from '../ProForm/index.vue';
import type { FieldSchema } from '@convenient-ui/types';
import { cloneDeep } from 'lodash-es';

// 🌟 1. 扩充 Props，支持外部传入 visible 和 title
const props = withDefaults(defineProps<{
  columns: FieldSchema[];
  visible?: boolean;
  title?: string;
  width?: string;
  labelWidth?: string;
}>(), {
  visible: false,
  title: '表单',
  width: '60%',
  labelWidth: '100px'
});

// 🌟 2. 增加 update:visible 事件，支持 v-model 双向绑定
const emit = defineEmits(['update:visible', 'submit']);

// 内部状态
const dialogVisible = ref(props.visible);
const currentTitle = ref(props.title);
const formData = ref<Record<string, any>>({});
const loading = ref(false);
const formRef = ref();

// 🌟 3. 同步外部的 v-model:visible 到内部
watch(() => props.visible, (val) => {
  dialogVisible.value = val;
});
// 内部关闭时，通知外部更新 v-model
watch(dialogVisible, (val) => {
  emit('update:visible', val);
});
// 同步外部的 title
watch(() => props.title, (val) => {
  currentTitle.value = val;
});

// 🌟 你的核心命令式逻辑完美保留！
const open = (options: { title?: string; row?: Record<string, any> } = {}) => {
  if (options.title) currentTitle.value = options.title;

  if (options.row) {
    formData.value = cloneDeep(options.row);
  } else {
    const initialData: Record<string, any> = {};
    props.columns.forEach(col => {
      if (col.defaultValue !== undefined) {
        initialData[col.prop] = cloneDeep(col.defaultValue);
      }
    });
    formData.value = initialData;
  }

  dialogVisible.value = true;
};

const close = () => {
  dialogVisible.value = false;
};

const handleClosed = () => {
  formData.value = {};
  loading.value = false;
};

const stopLoading = () => {
  loading.value = false;
};

// 提交逻辑保持不变
const handleProFormSubmit = (validData: any) => {
  loading.value = true;
  emit('submit', validData, { close, stopLoading });
};

// 暴露出去
defineExpose({ open, close, stopLoading });
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  gap: 12px;
}
</style>