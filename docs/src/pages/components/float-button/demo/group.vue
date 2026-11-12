<docs lang="zh-CN">
使用 `FloatButton.Group`（`<am-float-button-group>`）把多个按钮组合在一起。`shape` 作用于组内所有按钮，方形的按钮组会合并为一张卡片。
</docs>

<script setup lang="ts">
import { CommentOutlined, CustomerServiceOutlined, QuestionCircleOutlined } from '@antdv-next/icons'

const abs = { position: 'absolute' } as const
</script>

<template>
  <div class="demo-box">
    <am-float-button-group :style="{ ...abs, insetInlineEnd: '96px' }">
      <am-float-button>
        <template #icon>
          <QuestionCircleOutlined />
        </template>
      </am-float-button>
      <am-float-button :badge="{ count: 3 }">
        <template #icon>
          <CommentOutlined />
        </template>
      </am-float-button>
      <am-float-button type="primary">
        <template #icon>
          <CustomerServiceOutlined />
        </template>
      </am-float-button>
    </am-float-button-group>
    <am-float-button-group shape="square" :style="abs">
      <am-float-button>
        <template #icon>
          <QuestionCircleOutlined />
        </template>
      </am-float-button>
      <am-float-button content="评论" />
      <am-float-button>
        <template #icon>
          <CustomerServiceOutlined />
        </template>
      </am-float-button>
    </am-float-button-group>
  </div>
</template>

<style scoped>
.demo-box {
  position: relative;
  height: 240px;
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
