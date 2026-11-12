<docs lang="zh-CN">
`v-model:value` 绑定值路径数组。选中一项后自动进入下一级，选中叶子节点后自动提交并关闭弹层；点击页签可以回到上一级重新选择。
</docs>

<script setup lang="ts">
import { ref } from 'vue'
import { regions } from './data'

const value = ref<string[]>([])
</script>

<template>
  <am-flex vertical gap="small">
    <am-cascader v-model:value="value" :options="regions" title="所在地区" placeholder="请选择所在地区" allow-clear />
    <div class="demo-result">
      绑定值：{{ JSON.stringify(value) }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
