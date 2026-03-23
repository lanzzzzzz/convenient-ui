<template>
  <div class="pro-table-container">
    <ProForm
        v-if="searchColumns.length > 0"
        v-model="searchParam"
        :columns="searchColumns"
        :actionColProps="searchActionColProps"
        :label-width="searchLabelWidth"
        @submit="handleSearch"
        @reset="handleReset"
    >
      <template #action="{ submit, reset }">
        <div style="display: flex; gap: 10px;">
          <el-button type="primary" :icon="Search" :loading="loading" @click="submit">搜索</el-button>
          <el-button :icon="Refresh" @click="reset">重置</el-button>
        </div>
      </template>
    </ProForm>

    <div class="table-card">
      <div class="table-header" v-if="$slots.tableHeader || $slots.toolButton">
        <div class="header-button-lf"><slot name="tableHeader" :selectedList="selectedList"></slot></div>
        <div class="header-button-ri"><slot name="toolButton"></slot></div>
      </div>

      <el-table
          ref="tableRef"
          v-bind="attrs"
          :data="tableData"
          v-loading="loading"
          border
          @selection-change="handleSelectionChange"
          height="100%"
      >
        <!-- 🌟 微优化 1：引入 index 兜底，彻底杜绝多个无 prop 列导致的 key 冲突引发的 DOM Diff 异常 -->
        <template v-for="(col, index) in columns" :key="col.prop || col.type || index">

          <!-- 🌟 微优化 3：使用预定义的常量替代字面量数组，减少 Render 过程中的对象创建 -->
          <el-table-column v-if="specialColTypes.includes(col.type as string)" v-bind="col" />

          <el-table-column v-else-if="col.type === 'action'" v-bind="col">
            <template #default="scope">
              <slot v-if="$slots[col.prop]" :name="col.prop" :row="scope.row" :index="scope.$index"></slot>
              <template v-else>
                <template v-for="(btn, btnIndex) in col.actions" :key="btnIndex">
                  <template v-if="!btn.ifShow || btn.ifShow(scope.row)">
                    <el-popconfirm v-if="btn.isConfirm" :title="btn.confirmText || '确定执行此操作吗？'" @confirm="btn.onClick(scope.row)">
                      <template #reference>
                        <el-button link :type="btn.type || 'primary'">{{ btn.label }}</el-button>
                      </template>
                    </el-popconfirm>
                    <el-button v-else link :type="btn.type || 'primary'" @click="btn.onClick(scope.row)">
                      {{ btn.label }}
                    </el-button>
                  </template>
                </template>
              </template>
            </template>
          </el-table-column>

          <el-table-column v-else v-bind="col">

            <template #header="scope" v-if="col.headerRender">
              <RenderVNode :vnode="col.headerRender(scope)" />
            </template>

            <template #default="scope">
              <RenderVNode v-if="col.render" :vnode="col.render({ row: scope.row, index: scope.$index })" />

              <slot v-else-if="col.slot" :name="col.slot" :row="scope.row" :index="scope.$index"></slot>

              <slot v-else-if="col.type === 'slot'" :name="col.prop" :row="scope.row" :index="scope.$index"></slot>

              <span v-else>{{ scope.row[col.prop] }}</span>
            </template>

          </el-table-column>
        </template>
        <template #empty><slot name="empty"><el-empty description="暂无数据" /></slot></template>
      </el-table>

      <div v-if="total > 0" class="pagination-area" style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <el-pagination
            :current-page="pageable.pageNum"
            :page-size="pageable.pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            background layout="total, sizes, prev, pager, next, jumper"
            @update:current-page="handleCurrentChange"
            @update:page-size="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, reactive, computed, useAttrs, onMounted, watch, onBeforeUnmount } from 'vue';
import type { FunctionalComponent } from 'vue';
import { ElTable, ElEmpty, ElPagination, ElButton, ElPopconfirm } from 'element-plus';
import { Search, Refresh } from '@element-plus/icons-vue';
import type { TableColumnSchema } from '@convenient-ui/types';
import ProForm from '../ProForm/index.vue';

defineOptions({ name: 'ProTable', inheritAttrs: false });

// 🌟 常量提取：避免在 template 中每次渲染都创建新数组
const specialColTypes = ['selection', 'index', 'expand'];

const RenderVNode: FunctionalComponent<{ vnode: any }> = (props) => {
  return props.vnode;
};
RenderVNode.props = ['vnode'];

const attrs = useAttrs();

const props = withDefaults(defineProps<{
  columns: TableColumnSchema[];
  requestApi?: (params: any, options?: { signal?: AbortSignal }) => Promise<any>;
  dataCallback?: (data: any) => { list: any[]; total: number };
  autoLoad?: boolean;
  data?: any[];
  initParam?: Record<string, any>;
  searchLabelWidth?: string;
  searchActionColProps?: number | Record<string, number>;
}>(), {
  autoLoad: true,
  searchLabelWidth: '80px',
  searchActionColProps: () => ({ xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }),
  initParam: () => ({})
});

const tableData = shallowRef<any[]>([]);
const loading = ref(false);
const total = ref(0);
const pageable = reactive({ pageNum: 1, pageSize: 10 });
const searchParam = ref<Record<string, any>>({});

// 🌟 微优化 2：移除 [...props.columns] 不必要的展开，filter 自身就是纯函数会返回新数组
const searchColumns = computed<TableColumnSchema[]>(() =>
    props.columns.filter(item => item.search).sort((a, b) => (a.searchOrder ?? 0) - (b.searchOrder ?? 0))
);

watch(() => props.data, (newVal) => {
  if (newVal) {
    tableData.value = newVal;
  }
}, { immediate: true });

const getSerializedParams = () => {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(searchParam.value)) {
    if (value === undefined || value === null || value === '') continue;
    const col = props.columns.find(c => c.prop === key);
    if (col?.serializer && value !== undefined && value !== null && value !== '') {
      Object.assign(result, col.serializer(value));
    } else {
      result[key] = value;
    }
  }
  return result;
};

const emit = defineEmits(['error']);

const getQueryParams = () => {
  return {
    pageNum: pageable.pageNum,
    pageSize: pageable.pageSize,
    ...getSerializedParams(),
    ...props.initParam
  };
};

let currentAbortController: AbortController | null = null;

const getTableList = async () => {
  if (!props.requestApi) return;

  if (currentAbortController) {
    currentAbortController.abort();
  }

  const controller = new AbortController();
  currentAbortController = controller;

  try {
    loading.value = true;
    const queryParams = getQueryParams();

    const res = await props.requestApi(queryParams, { signal: controller.signal });

    if (props.dataCallback) {
      const { list, total: formattedTotal } = props.dataCallback(res);
      tableData.value = list;
      total.value = formattedTotal;
    } else {
      tableData.value = res.data?.list || res.data || res.list || [];
      total.value = res.data?.total || res.total || 0;
    }
  } catch (error: any) {
    if (error?.name === 'AbortError' || error?.message?.includes('cancel')) {
      console.warn('📦 检测到并发请求，已阻断旧请求的渲染以防止数据竞态');
      return;
    }

    tableData.value = [];
    total.value = 0;
    emit('error', error);
  } finally {
    if (currentAbortController === controller) {
      loading.value = false;
    }
  }
};

const handleSearch = () => {
  pageable.pageNum = 1;
  getTableList();
};

const handleReset = () => {
  searchParam.value = {};
  pageable.pageNum = 1;
  getTableList();
};

const handleCurrentChange = (val: number) => {
  pageable.pageNum = val;
  getTableList();
};

const handleSizeChange = (val: number) => {
  pageable.pageNum = 1;
  pageable.pageSize = val;
  getTableList();
};

const tableRef = ref();
const selectedList = ref<any[]>([]);
const handleSelectionChange = (val: any[]) => {
  selectedList.value = val;
  if (attrs['onSelectionChange']) (attrs['onSelectionChange'] as Function)(val);
};

onMounted(() => {
  if (props.autoLoad) getTableList();
});

onBeforeUnmount(() => {
  if (currentAbortController) {
    currentAbortController.abort();
  }
});

defineExpose({
  element: tableRef,
  getTableList,
  searchParam,
  getQueryParams,
  clearSelection: () => tableRef.value?.clearSelection()
});
</script>

<style scoped>
.pro-table-container { display: flex; flex-direction: column; width: 100%; height: 100%; gap: 16px; }
.table-card { display: flex; flex-direction: column; flex: 1; padding: 20px; background-color: #ffffff; border-radius: 4px; box-shadow: 0 0 12px rgba(0, 0, 0, 0.05); overflow: hidden; }
.table-header { display: flex; justify-content: space-between; margin-bottom: 16px; }
</style>