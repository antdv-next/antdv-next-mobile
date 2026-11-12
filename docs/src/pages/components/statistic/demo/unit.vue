<docs lang="zh-CN">
通过 `prefix` 和 `suffix` 属性或插槽，在数值前后添加图标或单位。
</docs>

<script setup lang="ts">
import { ArrowDownOutlined, ArrowUpOutlined, LikeOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-flex gap="large" wrap>
    <am-statistic title="点赞" :value="1128">
      <template #prefix>
        <LikeOutlined />
      </template>
    </am-statistic>
    <am-statistic title="未处理" :value="93" suffix="/ 100" />
    <am-statistic title="日环比" :value="11.28" :precision="2" suffix="%" :value-style="{ color: '#cf1322' }">
      <template #prefix>
        <ArrowUpOutlined />
      </template>
    </am-statistic>
    <am-statistic title="周环比" :value="9.3" :precision="2" suffix="%" :value-style="{ color: '#3f8600' }">
      <template #prefix>
        <ArrowDownOutlined />
      </template>
    </am-statistic>
  </am-flex>
</template>
