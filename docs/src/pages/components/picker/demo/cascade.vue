<docs lang="zh-CN">
`columns` 传入函数即可实现多列联动：每次滚动后都会用最新的值重新计算列数据。层级较深或需要异步加载时推荐使用 [Cascader](/components/cascader)。
</docs>

<docs lang="en-US">
Pass a function to `columns` to link multiple columns: the column data is recalculated from the latest value after every scroll. For deep hierarchies or async loading, [Cascader](/components/cascader) is recommended.
</docs>

<script setup lang="ts">
import type { PickerValue } from 'antdv-next-mobile'
import { ref } from 'vue'

const data: Record<string, string[]> = {
  Fruits: ['Apple', 'Banana', 'Grape', 'Watermelon'],
  Vegetables: ['Tomato', 'Cucumber', 'Potato'],
  Meat: ['Beef', 'Pork', 'Chicken', 'Lamb'],
}
const toOptions = (list: string[]) => list.map(item => ({ label: item, value: item }))

function columns(value: PickerValue[]) {
  const category = data[value[0]] ? String(value[0]) : 'Fruits'
  return [toOptions(Object.keys(data)), toOptions(data[category])]
}

const value = ref<PickerValue[]>([])
</script>

<template>
  <am-picker v-model:value="value" :columns="columns" title="Select food" placeholder="Please select" />
</template>
