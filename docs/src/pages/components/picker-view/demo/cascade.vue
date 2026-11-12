<docs lang="zh-CN">
`columns` 传入函数时，会在每次选择后以最新的值重新计算列数据，后续列的值会自动修正为可选项，从而实现级联。
</docs>

<script setup lang="ts">
import type { PickerValue } from 'antdv-next-mobile'
import { ref } from 'vue'

const data: Record<string, Record<string, string[]>> = {
  浙江: { 杭州: ['西湖区', '余杭区', '滨江区'], 宁波: ['海曙区', '鄞州区'] },
  江苏: { 南京: ['玄武区', '鼓楼区', '建邺区'], 苏州: ['姑苏区', '吴中区', '工业园区'] },
  福建: { 福州: ['鼓楼区', '台江区'], 厦门: ['思明区', '湖里区', '集美区'] },
}
const toOptions = (list: string[]) => list.map(item => ({ label: item, value: item }))

function columns(value: PickerValue[]) {
  const province = data[value[0]] ? String(value[0]) : Object.keys(data)[0]
  const cities = data[province]
  const city = cities[value[1]] ? String(value[1]) : Object.keys(cities)[0]
  return [toOptions(Object.keys(data)), toOptions(Object.keys(cities)), toOptions(cities[city])]
}

const value = ref<PickerValue[]>(['江苏', '苏州', '工业园区'])
</script>

<template>
  <am-picker-view v-model:value="value" :columns="columns" />
  <div class="demo-result">
    {{ value.join(' / ') }}
  </div>
</template>

<style scoped>
.demo-result {
  margin-top: 12px;
  color: var(--am-color-text-secondary);
  font-size: 14px;
  text-align: center;
}
</style>
