<docs lang="zh-CN">
开启 `changeOnSelect` 后可以只选到某个父级：弹层会显示「确定」按钮，点击后提交当前路径。
</docs>

<script setup lang="ts">
import { ref } from 'vue'
import { regions } from './data'

const value = ref<string[]>(['zhejiang'])
</script>

<template>
  <am-cascader v-model:value="value" :options="regions" change-on-select title="配送范围" />
</template>
