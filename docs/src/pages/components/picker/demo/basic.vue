<docs lang="zh-CN">
默认渲染一个类输入框的触发器，点击后从底部弹出滚轮。点击「确定」才会提交 `v-model:value`，点击「取消」或遮罩则放弃本次选择。
</docs>

<docs lang="en-US">
An input-like trigger is rendered by default; tapping it pops up the wheel from the bottom. `v-model:value` is committed only when "OK" is tapped; tapping "Cancel" or the mask discards the selection.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  ['Primary', 'Middle school', 'High school', 'Associate', 'Bachelor', 'Master', 'Doctorate'].map(label => ({ label, value: label })),
]
const value = ref<string[]>([])
</script>

<template>
  <am-picker v-model:value="value" :columns="columns" title="Education" placeholder="Please select" allow-clear />
</template>
