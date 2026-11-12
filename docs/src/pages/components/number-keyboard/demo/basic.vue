<docs lang="zh-CN">
通过 `v-model:open` 控制键盘显示，`v-model:value` 绑定输入的字符串。点击键盘以外的区域会自动收起（示例中的输入区域阻止了事件冒泡，因此重复点击不会收起）；键盘不会抢占焦点，也不会锁定页面滚动。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const value = ref('')
</script>

<template>
  <am-flex vertical gap="small">
    <div class="demo-field" :class="{ 'demo-field-focus': open }" @touchstart.stop @mousedown.stop @click="open = true">
      <span v-if="value">{{ value }}</span>
      <span v-else class="demo-placeholder">点击输入手机号</span>
    </div>
    <am-button block @click="value = ''">
      清空
    </am-button>
  </am-flex>
  <am-number-keyboard v-model:open="open" v-model:value="value" :maxlength="11" close-button-text="完成" />
</template>

<style scoped>
.demo-field {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 12px;
  font-size: 18px;
  letter-spacing: 1px;
  background: var(--am-color-bg-container);
  border: 1px solid var(--am-color-border);
  border-radius: 8px;
}

.demo-field-focus {
  border-color: var(--am-color-primary);
}

.demo-placeholder {
  color: var(--am-color-text-placeholder);
  font-size: 16px;
  letter-spacing: 0;
}
</style>
