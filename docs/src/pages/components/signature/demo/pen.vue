<docs lang="zh-CN">
`penColor` 设置笔触颜色（默认跟随主题文字色），`lineWidth` 设置笔触宽度，修改后只影响之后书写的笔画。
</docs>

<docs lang="en-US">
`penColor` sets the stroke color (follows the text color of the theme by default) and `lineWidth` sets the stroke width. Changes only apply to the strokes drawn afterwards.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const colors = [
  { label: 'Theme', value: '' },
  { label: 'Blue', value: '#1677ff' },
  { label: 'Red', value: '#f5222d' },
]
const color = ref('#1677ff')
const lineWidth = ref(4)
</script>

<template>
  <am-segmented v-model:value="color" :options="colors" block />
  <am-slider v-model:value="lineWidth" :min="1" :max="12" />
  <am-signature :pen-color="color || undefined" :line-width="lineWidth" placeholder="Sign here" />
</template>
