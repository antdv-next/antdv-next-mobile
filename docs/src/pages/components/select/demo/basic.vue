<docs lang="zh-CN">
单选模式下点击选项即提交并关闭弹层。`allowClear` 在有值时显示清除图标。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = [
  { label: '身份证', value: 'id' },
  { label: '护照', value: 'passport' },
  { label: '港澳居民来往内地通行证', value: 'hk' },
  { label: '台湾居民来往大陆通行证', value: 'tw' },
  { label: '军官证（暂不支持）', value: 'army', disabled: true },
]
const value = ref<string | null>(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-select v-model:value="value" :options="options" title="证件类型" placeholder="请选择证件类型" allow-clear />
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
