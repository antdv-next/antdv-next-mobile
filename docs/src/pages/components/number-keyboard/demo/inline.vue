<docs lang="zh-CN">
设置 `:poppable="false"` 后键盘内嵌在页面中，始终显示，可用于收银台、拨号盘等常驻键盘的页面。
</docs>

<docs lang="en-US">
With `:poppable="false"` the keyboard is embedded in the page and always visible, for pages with a permanent keyboard such as a checkout counter or a dial pad.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div class="demo-display">
    {{ value || 'Enter pickup code' }}
  </div>
  <am-number-keyboard v-model:value="value" :poppable="false" :maxlength="8" class="demo-inline-keyboard" />
</template>

<style scoped>
.demo-display {
  height: 48px;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 28px;
  line-height: 48px;
  letter-spacing: 4px;
  text-align: center;
}

.demo-inline-keyboard {
  border-radius: 12px;
}
</style>
