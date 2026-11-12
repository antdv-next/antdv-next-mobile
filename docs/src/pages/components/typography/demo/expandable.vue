<docs lang="zh-CN">
`expandable` 在文本被截断时显示「展开」按钮；设置为 `'collapsible'` 后可以再次收起。`symbol` 或 `ellipsisSymbol` 插槽可自定义按钮内容。
</docs>

<script setup lang="ts">
import { DownOutlined, UpOutlined } from '@antdv-next/icons'

const text = '蚂蚁的企业级产品是一个庞大且复杂的体系。这类产品不仅量级巨大且功能复杂，而且变动和并发频繁，常常需要设计与开发能够快速的做出响应。同时这类产品中有存在很多类似的页面以及组件，可以通过抽象得到一些稳定且高复用性的内容。随着商业化的趋势，越来越多的企业级产品对更好的用户体验有了进一步的要求。'
</script>

<template>
  <am-typography-paragraph :ellipsis="{ rows: 2, expandable: true }">
    {{ text }}
  </am-typography-paragraph>
  <am-typography-paragraph :ellipsis="{ rows: 3, expandable: 'collapsible' }">
    {{ text }}
  </am-typography-paragraph>
  <am-typography-paragraph
    :ellipsis="{ rows: 2, expandable: 'collapsible', symbol: (expanded: boolean) => (expanded ? '收起全文' : '阅读全文') }"
  >
    {{ text }}
  </am-typography-paragraph>
  <am-typography-paragraph :ellipsis="{ rows: 2, expandable: 'collapsible' }" type="secondary">
    {{ text }}
    <template #ellipsisSymbol="{ expanded }">
      <UpOutlined v-if="expanded" />
      <DownOutlined v-else />
    </template>
  </am-typography-paragraph>
  <am-typography-text :ellipsis="{ expandable: true }" style="width: 100%">
    单行文本同样支持展开：{{ text }}
  </am-typography-text>
</template>
