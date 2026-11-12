<docs lang="zh-CN">
通过 `ellipsis.expanded` 受控展开状态，并监听 `expand` 事件。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const expanded = ref(false)
const rows = ref(2)
const text = '蚂蚁的企业级产品是一个庞大且复杂的体系。这类产品不仅量级巨大且功能复杂，而且变动和并发频繁，常常需要设计与开发能够快速的做出响应。同时这类产品中有存在很多类似的页面以及组件，可以通过抽象得到一些稳定且高复用性的内容。'
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="small" align="center" wrap>
      <am-button size="small" @click="expanded = !expanded">
        {{ expanded ? '收起' : '展开' }}
      </am-button>
      <am-button size="small" @click="rows = rows === 2 ? 3 : 2">
        显示 {{ rows }} 行
      </am-button>
    </am-flex>
    <am-typography-paragraph
      :ellipsis="{ rows, expandable: 'collapsible', expanded }"
      @expand="(value: boolean) => (expanded = value)"
    >
      {{ text }}
    </am-typography-paragraph>
  </am-flex>
</template>
