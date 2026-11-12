<docs lang="zh-CN">
`columns` 传入函数即可实现多列联动：每次滚动后都会用最新的值重新计算列数据。层级较深或需要异步加载时推荐使用 [Cascader](/components/cascader)。
</docs>

<script setup lang="ts">
import type { PickerValue } from 'antdv-next-mobile'
import { ref } from 'vue'

const data: Record<string, string[]> = {
  水果: ['苹果', '香蕉', '葡萄', '西瓜'],
  蔬菜: ['番茄', '黄瓜', '土豆'],
  肉类: ['牛肉', '猪肉', '鸡肉', '羊肉'],
}
const toOptions = (list: string[]) => list.map(item => ({ label: item, value: item }))

function columns(value: PickerValue[]) {
  const category = data[value[0]] ? String(value[0]) : '水果'
  return [toOptions(Object.keys(data)), toOptions(data[category])]
}

const value = ref<PickerValue[]>([])
</script>

<template>
  <am-picker v-model:value="value" :columns="columns" title="选择食材" placeholder="请选择食材" />
</template>
