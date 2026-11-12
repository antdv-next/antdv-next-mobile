<docs lang="zh-CN">
没有具体数字时，用 `dot` 显示一个小红点。
</docs>

<docs lang="en-US">
When there is no specific number, show a small red dot with `dot`.
</docs>

<script setup lang="ts">
import { BellOutlined, MessageOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-space size="large" align="center">
    <am-badge dot>
      <BellOutlined class="icon" />
    </am-badge>
    <am-badge dot>
      <MessageOutlined class="icon" />
    </am-badge>
    <am-badge dot>
      <span class="link">Messages</span>
    </am-badge>
  </am-space>
</template>

<style scoped>
.icon {
  color: var(--am-color-text);
  font-size: 24px;
}

.link {
  color: var(--am-color-link);
  font-size: var(--am-font-size-lg);
}
</style>
