<docs lang="zh-CN">
默认样式下设置 `block`，选项以列表形态通栏展示：文字在左、单选框在右，整行都是点击热区。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('wechat')
const options = [
  { label: '微信支付', value: 'wechat' },
  { label: '支付宝', value: 'alipay' },
  { label: '银行卡', value: 'card' },
  { label: '货到付款（暂不支持）', value: 'cod', disabled: true },
]
</script>

<template>
  <div class="demo-radio-list">
    <am-radio-group v-model:value="value" :options="options" block />
  </div>
</template>

<style scoped>
.demo-radio-list {
  padding: 0 var(--am-padding);
  background: var(--am-color-bg-container);
}
</style>
