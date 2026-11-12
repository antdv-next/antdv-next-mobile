<docs lang="zh-CN">
每一级的选项列表默认开启虚拟滚动（`virtual`）：下面第二级有 3,000 个选项，只渲染可视区域附近的十几项。点击页签回到某一级时，该级的已选项会滚动到列表中间。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = ['华东', '华南', '华北'].map((region, r) => ({
  label: `${region}大区`,
  value: `r${r}`,
  children: Array.from({ length: 3000 }, (_, index) => ({
    label: `${region}门店 ${String(index + 1).padStart(4, '0')}`,
    value: `r${r}-s${index}`,
    children: ['一楼', '二楼', '三楼'].map((floor, f) => ({ label: floor, value: `r${r}-s${index}-f${f}` })),
  })),
}))

const value = ref<string[]>(['r1', 'r1-s1999', 'r1-s1999-f1'])
</script>

<template>
  <am-flex vertical gap="small">
    <am-cascader v-model:value="value" :options="options" title="选择门店" placeholder="每个大区 3,000 家门店" />
    <div class="demo-result">
      绑定值：{{ JSON.stringify(value) }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
