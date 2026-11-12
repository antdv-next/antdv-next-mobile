<docs lang="zh-CN">
覆盖 `--am-list-*` 组件变量，或使用 `classes` / `styles` 定制语义化结构；`arrow` 插槽可以替换右侧箭头。
</docs>

<docs lang="en-US">
Override the `--am-list-*` component tokens, or use `classes` / `styles` to customize the semantic structure; the `arrow` slot replaces the arrow on the right.
</docs>

<script setup lang="ts">
import { CheckCircleOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const selected = ref('alipay')
const methods = [
  { key: 'alipay', title: 'Alipay', description: 'Recommended for Alipay users' },
  { key: 'wechat', title: 'WeChat Pay', description: 'Chosen by a billion users' },
  { key: 'card', title: 'Bank card', description: 'Debit and credit cards' },
]
</script>

<template>
  <am-list class="pay-list" mode="card" header="Payment method">
    <am-list-item
      v-for="method in methods"
      :key="method.key"
      :title="method.title"
      :description="method.description"
      :styles="{ title: { fontWeight: 600 } }"
      @click="selected = method.key"
    >
      <template #arrow>
        <CheckCircleOutlined v-if="selected === method.key" class="checked" />
        <span v-else class="unchecked" />
      </template>
    </am-list-item>
  </am-list>
</template>

<style scoped>
.pay-list {
  --am-list-card-border-radius: 16px;
  --am-list-item-padding-block: 14px;
  --am-list-item-description-font-size: 12px;
}

.checked {
  color: var(--am-color-primary);
  font-size: 20px;
}

.unchecked {
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 1px solid var(--am-color-border);
  border-radius: 50%;
}
</style>
