<docs lang="zh-CN">
通过 `badge` 显示徽标数或小红点，支持 `overflowCount` 封顶与自定义颜色。
</docs>

<script setup lang="ts">
import { BellOutlined, ShoppingCartOutlined } from '@antdv-next/icons'

const abs = { position: 'absolute' } as const
</script>

<template>
  <div class="demo-box">
    <am-float-button :badge="{ dot: true }" :style="{ ...abs, insetInlineEnd: '204px' }">
      <template #icon>
        <BellOutlined />
      </template>
    </am-float-button>
    <am-float-button :badge="{ count: 5 }" :style="{ ...abs, insetInlineEnd: '144px' }">
      <template #icon>
        <ShoppingCartOutlined />
      </template>
    </am-float-button>
    <am-float-button shape="square" :badge="{ count: 120, overflowCount: 99 }" :style="{ ...abs, insetInlineEnd: '84px' }" />
    <am-float-button
      shape="square"
      type="primary"
      :badge="{ count: 'new', color: 'var(--am-color-success)' }"
      :style="abs"
    />
  </div>
</template>

<style scoped>
.demo-box {
  position: relative;
  height: 120px;
  overflow: hidden;
  background: var(--am-color-fill-quaternary);
  border-radius: var(--am-border-radius);
}

/* 组件变量声明在悬浮按钮（组）的根节点上，需要在其自身上覆盖 */
.demo-box > .am-float-button,
.demo-box > .am-float-button-group {
  --am-float-button-inset-block-end: 24px;
}
</style>
