<docs lang="zh-CN">
通过 `v-model:open` 受控显示。`trigger="manual"` 时点击触发元素不会切换，只能通过 `open` 或实例的 `show` / `hide` 方法控制；`closeOnClickAway` 设为 `false` 后触摸外部不会关闭。
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
          <a @click="open = false">关闭</a>
        </template>
        <am-button>受控</am-button>
      </am-popover>
      <span>open: {{ open }}</span>
    </am-flex>
    <am-flex gap="small" align="center">
      <am-popover
        :open="manual"
        trigger="manual"
        :close-on-click-away="false"
        content="只能通过右侧按钮关闭"
        placement="bottomLeft"
        mode="dark"
      >
        <am-button>手动触发的目标</am-button>
      </am-popover>
      <am-button type="primary" @click="manual = !manual">
        {{ manual ? '隐藏' : '显示' }}
      </am-button>
    </am-flex>
  </am-flex>
</template>
