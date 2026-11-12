<docs lang="zh-CN">
通过分隔符属性、`formatter` 属性或插槽自定义数值的展示。
</docs>

<docs lang="en-US">
Customize how the value is displayed through the separator props, the `formatter` prop or the slot.
</docs>

<script setup lang="ts">
function toMillion(value: number | string) {
  return `${(Number(value) / 1000000).toFixed(1)} M`
}
</script>

<template>
  <am-flex gap="large" wrap>
    <am-statistic title="European" :value="1234567.89" group-separator="." decimal-separator="," />
    <am-statistic title="Views" :value="1234567" :formatter="toMillion" />
    <am-statistic title="Rating" :value="4.6">
      <template #formatter="{ value }">
        <span class="score">★ {{ Number(value).toFixed(1) }}</span>
      </template>
    </am-statistic>
  </am-flex>
</template>

<style scoped>
.score {
  color: var(--am-color-warning);
}
</style>
