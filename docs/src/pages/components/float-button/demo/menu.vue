<docs lang="zh-CN">
设置 `trigger="click"` 进入菜单模式：点击触发按钮展开 / 收起。`placement` 控制展开方向，`v-model:open` 可以受控。
</docs>

<script setup lang="ts">
import { CommentOutlined, CustomerServiceOutlined, PlusOutlined, ShareAltOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const open = ref(true)
const abs = { position: 'absolute' } as const
</script>

<template>
  <div class="demo-box">
    <am-float-button-group
      v-model:open="open"
      trigger="click"
      type="primary"
      :style="abs"
    >
      <template #icon>
        <PlusOutlined />
      </template>
      <am-float-button>
        <template #icon>
          <CommentOutlined />
        </template>
      </am-float-button>
      <am-float-button>
        <template #icon>
          <ShareAltOutlined />
        </template>
      </am-float-button>
    </am-float-button-group>
    <am-float-button-group
      trigger="click"
      placement="left"
      shape="square"
      :style="{ ...abs, insetInlineEnd: '96px' }"
    >
      <template #icon>
        <CustomerServiceOutlined />
      </template>
      <am-float-button content="电话" />
      <am-float-button content="在线" />
    </am-float-button-group>
    <span class="state">open: {{ open }}</span>
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

.state {
  position: absolute;
  top: 12px;
  left: 12px;
  color: var(--am-color-text-secondary);
}

/* 组件变量声明在悬浮按钮（组）的根节点上，需要在其自身上覆盖 */
.demo-box > .am-float-button,
.demo-box > .am-float-button-group {
  --am-float-button-inset-block-end: 24px;
}
</style>
