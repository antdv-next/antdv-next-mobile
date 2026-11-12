<docs lang="zh-CN">
通过分隔符属性、`formatter` 属性或插槽自定义数值的展示。
</docs>

<script setup lang="ts">
function toWan(value: number | string) {
  return `${(Number(value) / 10000).toFixed(1)} 万`
}
</script>

<template>
  <am-flex gap="large" wrap>
    <am-statistic title="欧洲格式" :value="1234567.89" group-separator="." decimal-separator="," />
    <am-statistic title="播放量" :value="1234567" :formatter="toWan" />
    <am-statistic title="评分" :value="4.6">
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
