<template>
  <div class="app-container">
    <ProTable
        ref="proTableRef"
        :columns="columns"
        :request-api="getUserListApi"
        :data-callback="formatTableData"
        search-label-width="100px"
        :search-action-col-props="6"
        stripe
        border
        size="large"
    />

    <ProDialogForm
        ref="dialogFormRef"
        :columns="formColumns"
        width="500px"
        @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { ProTable, ProDialogForm, registerComponents } from '@convenient-ui/vue-ui';
import type { TableColumnSchema } from '@convenient-ui/types';
import { ElTag, ElMessage, ElInput, ElSelect, ElDatePicker } from 'element-plus';

// ==========================================
// 🚀 0. 初始化阶段：IoC 控制反转，注册所需组件
// (在真实项目中，这段代码通常放在 main.ts 中)
// ==========================================
registerComponents({
  'input': ElInput,
  'select': ElSelect,
  'date-picker': ElDatePicker
});

// ==========================================
// 🚀 1. 页面级 Ref 与 模拟 API
// ==========================================
const proTableRef = ref();
const dialogFormRef = ref();

// 模拟后端拉取列表接口（带 AbortSignal 竞态拦截测试）
const getUserListApi = async (params: any, options?: { signal?: AbortSignal }) => {
  console.log('📡 [API] 发起列表请求，合并后的参数:', params);

  return new Promise((resolve, reject) => {
    // 模拟 800ms 的网络延迟
    const timer = setTimeout(() => {
      resolve({
        code: 200,
        result: {
          items: [
            { id: 1, username: params.username || 'Admin', status: 1, role: 'super', createTime: '2026-01-01' },
            { id: 2, username: 'TestUser', status: 0, role: 'user', createTime: '2026-02-14' },
            { id: 3, username: 'Developer', status: 1, role: 'admin', createTime: '2026-03-24' }
          ],
          totalCount: 100
        }
      });
    }, 800);

    // 🌟 竞态拦截：如果收到取消信号，立刻中断！
    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        clearTimeout(timer);
        console.warn('🛑 [API] 请求已被 AbortController 拦截取消！');
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
};

// 🌟 数据适配器：把奇葩的后端结构映射成组件需要的 { list, total }
const formatTableData = (res: any) => {
  return {
    list: res.result.items,
    total: res.result.totalCount
  };
};

// ==========================================
// 🚀 2. 核心 Schema 配置
// ==========================================

// 表格配置 (读 + 搜)
const columns: TableColumnSchema[] = [
  { type: 'selection', width: 55, fixed: 'left' },
  { type: 'index', label: '序号', width: 80 },
  {
    prop: 'username', label: '用户姓名', search: true, colProps: { span: 6 },
    componentProps: { placeholder: '请输入姓名模糊查询' }
  },
  {
    prop: 'status', label: '状态', search: true, type: 'select', colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },
    render: ({ value }: { value: any }) => h(ElTag, { type: value === 1 ? 'success' : 'danger' }, () => value === 1 ? '启用' : '禁用')
  },
  {
    prop: 'createTime', label: '创建时间', search: true, type: 'date-picker', width: 200, colProps: { span: 6 },
    componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD', startPlaceholder: '开始', endPlaceholder: '结束' },
    // 序列化器：把日期数组拆解为两个独立字段
    serializer: (val: any) => (!val || val.length !== 2) ? {} : { startTime: val[0], endTime: val[1] }
  },
  // 🌟 混合驱动：操作列！
  {
    prop: 'action', label: '操作', type: 'action', width: 220, fixed: 'right',
    actions: [
      { label: '新增', type: 'success', onClick: () => handleAdd() }, // 放在这里方便测试
      { label: '编辑', type: 'primary', onClick: (row: any) => handleEdit(row) },
      {
        label: '删除', type: 'danger', isConfirm: true,
        confirmText: '确定要永久删除该用户吗？',
        onClick: (row: any) => ElMessage.warning(`模拟删除用户: ${row.username}`)
      }
    ]
  }
];

// 表单配置 (写)
const formColumns: TableColumnSchema[] = [
  {
    prop: 'username', label: '用户姓名',
    rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    colProps: { span: 24 }
  },
  {
    prop: 'status', label: '状态', type: 'select',
    defaultValue: 1, // 🌟 默认值魔法：新增时自动选中“启用”！
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },
    rules: [{ required: true, message: '请选择状态', trigger: 'change' }],
    colProps: { span: 24 }
  }
];

// ==========================================
// 🚀 3. 业务逻辑控制流
// ==========================================

const handleAdd = () => {
  dialogFormRef.value.open({ title: '新增用户' });
};

const handleEdit = (row: any) => {
  dialogFormRef.value.open({ title: `编辑用户 - ${row.username}`, row });
};

// 弹窗表单提交闭环
const handleFormSubmit = async (formData: any, action: { close: () => void, stopLoading: () => void }) => {
  console.log('🚀 准备提交到后端的干净深拷贝数据:', formData);
  try {
    // 模拟接口请求
    await new Promise(resolve => setTimeout(resolve, 1000));

    ElMessage.success('保存成功！');
    // 🌟 闭环：关闭弹窗并自动刷新底层表格
    action.close();
    await proTableRef.value.getTableList();
  } catch (error) {
    ElMessage.error('保存失败');
    action.stopLoading();
  }
};
</script>

<style>
body {
  margin: 0;
  background-color: #f0f2f5;
}
.app-container {
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}
</style>