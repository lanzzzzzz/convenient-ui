<template>
  <el-form
      ref="formRef"
      :model="localModel"
      :label-width="labelWidth"
      class="pro-form"
      :class="formClass"
      @submit.prevent
  >
    <el-row :gutter="20">
      <template v-for="item in columns" :key="item.prop">
        <el-col v-if="!item.ifShow || item.ifShow(localModel)" v-bind="item.colProps || { span: 12 }">
          <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules" :class="item.className">
            <component
                :is="useComponent(item.type)"
                :model-value="localModel[item.prop]"
                v-bind="item.componentProps as any"
                :placeholder="(item.componentProps as any)?.placeholder || `请输入${item.label}`"
                :style="item.fieldStyle || { width: '100%' }"
                @update:model-value="(val: any) => handleFieldChange(item.prop, val)"
            >
              <template v-if="item.type === 'select' && (item.componentProps as any)?.options">
                <el-option v-for="opt in (item.componentProps as any).options" :key="opt.value" :label="opt.label" :value="opt.value" />
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>

      <el-col
          v-if="!hideAction"
          v-bind="typeof actionColProps === 'number' ? { span: actionColProps } : actionColProps"
      >
        <el-form-item>
          <slot name="action" :model="localModel" :submit="submit" :reset="reset">
            <el-button type="primary" @click="submit">搜索 / 提交</el-button>
            <el-button @click="reset">重置</el-button>
          </slot>
        </el-form-item>
      </el-col>

    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FieldSchema } from '@convenient-ui/types';
import { ElOption } from 'element-plus';
import { useComponent } from '../../composables/useComponentRegistry';
import { cloneDeep, isEqual } from 'lodash-es';

const props = withDefaults(defineProps<{
  columns: FieldSchema[];
  modelValue?: Record<string, any>;
  labelWidth?: string;
  formClass?: string;
  actionColProps?: number | Record<string, number>;
  hideAction?: boolean;
}>(), {
  modelValue: () => ({}),
  labelWidth: '100px',
  actionColProps: 24,
  hideAction: false
});

const emit = defineEmits(['update:modelValue', 'submit', 'reset']);

const localModel = ref<Record<string, any>>({});

// 🌟 引入快照模型
const initialSnapshot = ref<Record<string, any>>({});

watch(() => props.modelValue, (newVal) => {
  if (newVal && !isEqual(newVal, localModel.value)) {
    const cloned = cloneDeep(newVal);
    localModel.value = cloned;
    // 锁定快照！
    initialSnapshot.value = cloneDeep(newVal);
  }
}, { deep: true, immediate: true });

const handleFieldChange = (prop: string, val: any) => {
  localModel.value[prop] = val;
  emit('update:modelValue', { ...localModel.value });
};

const reset = () => {
  if (!formRef.value) return;
  formRef.value.clearValidate();

  // 🌟 核心：重置永远回退到【刚挂载/刚传入时的快照】，而不是父组件当前的 state
  localModel.value = cloneDeep(initialSnapshot.value);

  emit('update:modelValue', { ...localModel.value });
  emit('reset');
};


// 🌟 修复：彻底放弃 structuredClone，使用最稳定的 cloneDeep 处理 Vue Proxy
watch(() => props.modelValue, (newVal) => {
  if (newVal && !isEqual(newVal, localModel.value)) {
    localModel.value = cloneDeep(newVal);
  }
}, { deep: true, immediate: true });


const formRef = ref();

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 🌟 修复：稳定深拷贝
      emit('submit', cloneDeep(localModel.value));
    }
  });
};


defineExpose({ submit, reset, formRef });
</script>

<style scoped>
.pro-form { width: 100%; }
.action-item { margin-bottom: 0; }
</style>