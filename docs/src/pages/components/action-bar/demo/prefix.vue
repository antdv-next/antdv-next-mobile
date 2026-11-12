<docs lang="zh-CN">
`prefix` 属性或插槽在动作前放置一块占满剩余宽度的自由内容，例如合计金额，用来实现提交订单栏。此时按钮保持自身宽度。
</docs>

<docs lang="en-US">
The `prefix` prop or slot puts free content before the actions and takes the remaining width, e.g. a total price, which makes a submit bar. Buttons keep their own width in this case.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(true)
</script>

<template>
  <am-action-bar :fixed="false" :safe-area="false">
    <template #prefix>
      <div class="summary">
        <am-checkbox v-model:checked="checked">
          All
        </am-checkbox>
        <span class="total">Total <b class="price">$ 128.00</b></span>
      </div>
    </template>
    <am-action-bar-button color="danger" :disabled="!checked">
      Submit
    </am-action-bar-button>
  </am-action-bar>
</template>

<style scoped>
.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline-end: 8px;
}

.total {
  color: var(--am-color-text-secondary);
}

.price {
  color: var(--am-color-error);
  font-size: var(--am-font-size-lg);
}
</style>
