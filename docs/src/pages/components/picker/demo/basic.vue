<docs lang="zh-CN">
默认渲染一个类输入框的触发器，点击后从底部弹出滚轮。点击「确定」才会提交 `v-model:value`，点击「取消」或遮罩则放弃本次选择。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  ['小学', '初中', '高中', '大专', '本科', '硕士', '博士'].map(label => ({ label, value: label })),
]
const value = ref<string[]>([])
</script>

<template>
  <am-picker v-model:value="value" :columns="columns" title="最高学历" placeholder="请选择学历" allow-clear />
</template>
