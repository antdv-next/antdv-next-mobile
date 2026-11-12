<docs lang="zh-CN">
通过 `arrowIcon` 属性或插槽自定义箭头，`title` 插槽自定义标题；通过 `--am-dropdown-*` 组件变量调整外观。
</docs>

<script setup lang="ts">
import { DownOutlined, FilterOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const value = ref('hot')
const options = [
  { label: '最热', value: 'hot' },
  { label: '最新', value: 'new' },
]
</script>

<template>
  <am-dropdown class="custom-dropdown">
    <template #arrowIcon>
      <DownOutlined />
    </template>
    <am-dropdown-item key="sort" v-model:value="value" :options="options" root-class="custom-dropdown-layer" />
    <am-dropdown-item key="filter" root-class="custom-dropdown-layer">
      <template #title>
        <b>筛选</b>
      </template>
      <template #arrowIcon>
        <FilterOutlined />
      </template>
      <div class="panel">
        单独为这一项定制了标题与图标
      </div>
    </am-dropdown-item>
  </am-dropdown>
  <div class="page">
    自定义箭头与主题变量
  </div>
</template>

<style scoped>
.panel {
  padding: 24px 16px;
}

.page {
  padding: 48px 16px;
  color: var(--am-color-text-secondary);
  text-align: center;
}
</style>

<style>
.custom-dropdown {
  --am-dropdown-height: 48px;
  --am-dropdown-active-color: #eb2f96;
  --am-dropdown-arrow-size: 12px;
}

.custom-dropdown-layer {
  --am-dropdown-option-active-color: #eb2f96;
  --am-dropdown-panel-border-radius: 20px;
}
</style>
