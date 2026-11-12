<docs lang="zh-CN">
通过 `type` 改变按钮类型，`shape` 改变形状，`icon` 自定义图标，`content` 在图标下方显示文字；只设置 `content` 时仅显示文字。设置 `href` 后按钮渲染为链接。
</docs>

<script setup lang="ts">
import { CustomerServiceOutlined, QuestionCircleOutlined } from '@antdv-next/icons'

const abs = { position: 'absolute' } as const
</script>

<template>
  <div class="demo-box">
    <am-float-button :style="{ ...abs, insetInlineEnd: '264px' }">
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </am-float-button>
    <am-float-button type="primary" :style="{ ...abs, insetInlineEnd: '204px' }">
      <template #icon>
        <CustomerServiceOutlined />
      </template>
    </am-float-button>
    <am-float-button shape="square" :style="{ ...abs, insetInlineEnd: '144px' }" />
    <am-float-button shape="square" type="primary" content="客服" :style="{ ...abs, insetInlineEnd: '84px' }">
      <template #icon>
        <CustomerServiceOutlined />
      </template>
    </am-float-button>
    <am-float-button shape="square" content="帮助" href="https://github.com/antdv-next" target="_blank" :style="abs" />
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
