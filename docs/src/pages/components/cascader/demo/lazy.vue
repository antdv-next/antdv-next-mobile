<docs lang="zh-CN">
选项设置 `isLeaf: false` 并提供 `loadData` 即可动态加载下一级：在回调中为目标选项设置 `children`，返回 Promise 时加载图标会保持到其完成。
</docs>

<script setup lang="ts">
import type { CascaderOption } from 'antdv-next-mobile'
import { ref } from 'vue'

const options = ref<CascaderOption[]>([
  { label: '电子产品', value: 'digital', isLeaf: false },
  { label: '家用电器', value: 'appliance', isLeaf: false },
  { label: '图书', value: 'book' },
])
const value = ref<string[]>([])

function loadData(selectedOptions: CascaderOption[]) {
  const target = selectedOptions[selectedOptions.length - 1]
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      target.children = selectedOptions.length === 1
        ? [
            { label: `${target.label} · 热门`, value: `${target.value}-hot`, isLeaf: false },
            { label: `${target.label} · 新品`, value: `${target.value}-new` },
          ]
        : [
            { label: '销量优先', value: `${target.value}-sales` },
            { label: '好评优先', value: `${target.value}-rate` },
          ]
      resolve()
    }, 800)
  })
}
</script>

<template>
  <am-cascader v-model:value="value" :options="options" :load-data="loadData" title="商品分类" placeholder="请选择商品分类" />
</template>
