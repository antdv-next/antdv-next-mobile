<docs lang="zh-CN">
`theme="custom"` 会在右侧增加删除键与大号的完成按钮，适合输入金额后直接进入下一步。点击完成按钮触发 `confirm` 并收起键盘，`confirmText` 可修改按钮文字。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const amount = ref('')
const paid = ref('')

function onInput(key: string) {
  // 金额最多两位小数、一个小数点
  const next = amount.value + key
  if (!/^(?:0|[1-9]\d{0,5})?(?:\.\d{0,2})?$/.test(next) || next === '.')
    return
  amount.value = next
}
</script>

<template>
  <am-flex vertical gap="small">
    <div class="demo-amount" @click="open = true">
      <span class="demo-symbol">¥</span>
      <span v-if="amount">{{ amount }}</span>
      <span v-else class="demo-placeholder">0.00</span>
    </div>
    <div v-if="paid" class="demo-tip">
      已支付 ¥{{ paid }}
    </div>
  </am-flex>
  <am-number-keyboard
    v-model:open="open"
    theme="custom"
    extra-key="."
    confirm-text="付款"
    @input="onInput"
    @delete="amount = amount.slice(0, -1)"
    @confirm="paid = amount || '0'"
  />
</template>

<style scoped>
.demo-amount {
  display: flex;
  gap: 4px;
  align-items: baseline;
  padding: 12px 0;
  font-weight: 600;
  font-size: 36px;
  border-bottom: 1px solid var(--am-color-border-secondary);
}

.demo-symbol {
  font-size: 24px;
}

.demo-placeholder {
  color: var(--am-color-text-placeholder);
}

.demo-tip {
  color: var(--am-color-success);
  font-size: 14px;
}
</style>
