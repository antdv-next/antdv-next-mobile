<docs lang="zh-CN">
`title` 设置键盘标题，`closeButtonText` 设置标题栏右侧的关闭按钮；`randomKeyOrder` 在每次打开时随机打乱数字键，提升安全性；`showDeleteKey` 控制删除键。
</docs>

<docs lang="en-US">
`title` sets the keyboard title and `closeButtonText` sets the close button on the right of the title bar; `randomKeyOrder` shuffles the number keys every time the keyboard opens to improve security; `showDeleteKey` controls the delete key.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const titled = ref(false)
const random = ref(false)
const log = ref('')

function onInput(key: string) {
  log.value = `input: ${key}`
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="titled = true">
      Keyboard with title
    </am-button>
    <am-button block @click="random = true">
      Random keyboard
    </am-button>
    <div class="demo-log">
      {{ log || 'Key log' }}
    </div>
  </am-flex>
  <am-number-keyboard
    v-model:open="titled"
    title="Enter the code"
    close-button-text="Close"
    @input="onInput"
    @delete="log = 'delete'"
    @close="log = 'close'"
    @blur="log = 'blur'"
  />
  <am-number-keyboard v-model:open="random" random-key-order title="Secure keyboard" close-button-text="Done" @input="onInput" />
</template>

<style scoped>
.demo-log {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
  text-align: center;
}
</style>
