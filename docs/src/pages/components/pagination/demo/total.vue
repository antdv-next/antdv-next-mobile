<docs lang="zh-CN">
通过 `showTotal` 属性或同名插槽展示数据总量与当前数据范围。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref(1)
const showTotal = (total: number) => `共 ${total} 条`
</script>

<template>
  <am-flex vertical gap="large">
    <am-pagination v-model:current="current" :total="85" :page-size="20" :show-total="showTotal" />
    <am-pagination v-model:current="current" simple :total="85" :page-size="20">
      <template #showTotal="{ total, range }">
        第 <b>{{ range[0] }}-{{ range[1] }}</b> 条 / 共 {{ total }} 条
      </template>
    </am-pagination>
  </am-flex>
</template>
