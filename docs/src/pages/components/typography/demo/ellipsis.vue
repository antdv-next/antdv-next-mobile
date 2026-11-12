<docs lang="zh-CN">
`ellipsis` 默认单行省略，通过 `rows` 设置最多显示的行数。
</docs>

<script setup lang="ts">
const text = '蚂蚁的企业级产品是一个庞大且复杂的体系。这类产品不仅量级巨大且功能复杂，而且变动和并发频繁，常常需要设计与开发能够快速的做出响应。同时这类产品中有存在很多类似的页面以及组件，可以通过抽象得到一些稳定且高复用性的内容。'
</script>

<template>
  <am-typography-title :level="5" ellipsis>
    单行省略的标题：{{ text }}
  </am-typography-title>
  <am-typography-paragraph ellipsis>
    {{ text }}
  </am-typography-paragraph>
  <am-typography-paragraph :ellipsis="{ rows: 2 }">
    {{ text }}
  </am-typography-paragraph>
  <am-typography-paragraph :ellipsis="{ rows: 3 }" type="secondary">
    {{ text }}
  </am-typography-paragraph>
</template>
