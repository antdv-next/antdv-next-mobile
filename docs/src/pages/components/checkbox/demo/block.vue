<docs lang="zh-CN">
`block` 让选项以列表形态通栏展示：文字在左、勾选框在右，整行都是点击热区，适合放在设置页或表单中。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(['push'])
const options = [
  { label: '推送通知', value: 'push' },
  { label: '短信通知', value: 'sms' },
  { label: '邮件通知', value: 'email' },
  { label: '电话通知（暂不支持）', value: 'phone', disabled: true },
]
</script>

<template>
  <div class="demo-checkbox-list">
    <am-checkbox-group v-model:value="value" :options="options" block shape="round" />
  </div>
</template>

<style scoped>
.demo-checkbox-list {
  padding: 0 var(--am-padding);
  background: var(--am-color-bg-container);
}
</style>
