<docs lang="zh-CN">
通过 `v-model:open` 受控显示。`trigger="manual"` 时点击触发元素不会切换，只能通过 `open` 或实例的 `show` / `hide` 方法控制；`closeOnClickAway` 设为 `false` 后触摸外部不会关闭。
</docs>

<docs lang="en-US">
Control the visibility with `v-model:open`. With `trigger="manual"`, tapping the trigger element does not toggle it; it can only be controlled through `open` or the `show` / `hide` instance methods. With `closeOnClickAway` set to `false`, touching outside does not close it.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const manual = ref(false)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="small" align="center">
      <am-popover v-model:open="open" placement="topLeft">
        <template #content>
          <a @click="open = false">Close</a>
        </template>
        <am-button>Controlled</am-button>
      </am-popover>
      <span>open: {{ open }}</span>
    </am-flex>
    <am-flex gap="small" align="center">
      <am-popover
        :open="manual"
        trigger="manual"
        :close-on-click-away="false"
        content="Only the button on the right closes it"
        placement="bottomLeft"
        mode="dark"
      >
        <am-button>Manual target</am-button>
      </am-popover>
      <am-button type="primary" @click="manual = !manual">
        {{ manual ? 'Hide' : 'Show' }}
      </am-button>
    </am-flex>
  </am-flex>
</template>
