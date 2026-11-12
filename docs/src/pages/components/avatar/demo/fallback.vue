<docs lang="zh-CN">
图片加载失败时触发 `error` 事件，并依次回退为 `icon`、默认插槽中的字符。
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const failed = ref(0)
</script>

<template>
  <am-space vertical size="middle">
    <am-space size="middle">
      <am-avatar src="https://example.invalid/broken.png" @error="failed++">
        <template #icon>
          <UserOutlined />
        </template>
      </am-avatar>
      <am-avatar src="https://example.invalid/broken.png" @error="failed++">
        李
      </am-avatar>
    </am-space>
    <span class="tip">加载失败次数：{{ failed }}</span>
  </am-space>
</template>

<style scoped>
.tip {
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size-sm);
}
</style>
