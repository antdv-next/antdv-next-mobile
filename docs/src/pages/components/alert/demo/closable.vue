<docs lang="zh-CN">
显示关闭按钮，点击后带有收起动画，`close` 与 `afterClose` 事件分别在点击时和动画结束后触发。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
const log = ref('点击右侧的关闭按钮')
</script>

<template>
  <am-flex vertical gap="small">
    <am-alert
      v-if="visible"
      title="警告提示的文案"
      type="warning"
      show-icon
      closable
      @close="log = '触发 close'"
      @after-close="log = '触发 afterClose'; visible = false"
    />
    <am-alert
      title="自定义关闭文字"
      description="closeIcon 可以是任意节点，设置后自动显示关闭按钮。"
      type="info"
      close-icon="知道了"
    />
    <am-flex align="center" justify="space-between">
      <span class="log">{{ log }}</span>
      <am-button size="small" :disabled="visible" @click="visible = true">
        重新显示
      </am-button>
    </am-flex>
  </am-flex>
</template>

<style scoped>
.log {
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}
</style>
