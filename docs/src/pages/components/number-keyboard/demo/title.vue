<docs lang="zh-CN">
`title` 设置键盘标题，`closeButtonText` 设置标题栏右侧的关闭按钮；`randomKeyOrder` 在每次打开时随机打乱数字键，提升安全性；`showDeleteKey` 控制删除键。
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
      带标题的键盘
    </am-button>
    <am-button block @click="random = true">
      随机数字键盘
    </am-button>
    <div class="demo-log">
      {{ log || '按键记录' }}
    </div>
  </am-flex>
  <am-number-keyboard
    v-model:open="titled"
    title="请输入验证码"
    close-button-text="关闭"
    @input="onInput"
    @delete="log = 'delete'"
    @close="log = 'close'"
    @blur="log = 'blur'"
  />
  <am-number-keyboard v-model:open="random" random-key-order title="安全键盘" close-button-text="完成" @input="onInput" />
</template>

<style scoped>
.demo-log {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
  text-align: center;
}
</style>
