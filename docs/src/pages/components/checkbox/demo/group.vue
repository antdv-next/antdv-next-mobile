<docs lang="zh-CN">
`Checkbox.Group` 通过 `options` 快速生成一组多选框，也可以在默认插槽里自由组合 `Checkbox`。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const fruits = ref(['Apple'])
const options = [
  { label: '苹果', value: 'Apple' },
  { label: '梨', value: 'Pear' },
  { label: '橙子', value: 'Orange', disabled: true },
]

const cities = ref<string[]>(['hangzhou'])
</script>

<template>
  <am-flex vertical gap="middle">
    <am-checkbox-group v-model:value="fruits" :options="options" />
    <am-checkbox-group v-model:value="cities">
      <am-checkbox value="hangzhou">
        杭州
      </am-checkbox>
      <am-checkbox value="shanghai">
        上海
      </am-checkbox>
      <am-checkbox value="beijing">
        北京
      </am-checkbox>
    </am-checkbox-group>
    <div>已选：{{ [...fruits, ...cities].join('、') || '无' }}</div>
  </am-flex>
</template>
