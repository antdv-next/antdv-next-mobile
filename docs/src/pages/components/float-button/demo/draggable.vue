<docs lang="zh-CN">
开启 `draggable` 后可以按住按钮拖动。`axis` 限制拖拽方向，`magnetic` 让按钮在松手后吸附到最近的边缘，`v-model:offset` 可以读取或设置位置。拖拽结束不会触发 `click`。
</docs>

<script setup lang="ts">
import type { FloatButtonOffset } from 'antdv-next-mobile'
import { CustomerServiceOutlined, DragOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next-mobile'
import { ref } from 'vue'

const offset = ref<FloatButtonOffset>()
const abs = { position: 'absolute' } as const
</script>

<template>
  <div class="demo-box">
    <p class="tip">
      蓝色按钮可自由拖动并吸附到左右边缘；白色按钮只能上下拖动。
    </p>
    <p class="tip">
      offset: {{ offset ? `${Math.round(offset.x)}, ${Math.round(offset.y)}` : '未拖动' }}
    </p>
    <am-float-button
      v-model:offset="offset"
      draggable
      magnetic="x"
      type="primary"
      :gap="12"
      :style="abs"
      @click="message.info('点击了按钮')"
    >
      <template #icon>
        <CustomerServiceOutlined />
      </template>
    </am-float-button>
    <am-float-button
      draggable
      axis="y"
      :gap="12"
      :style="{ ...abs, insetInlineEnd: 'auto', insetInlineStart: '12px' }"
    >
      <template #icon>
        <DragOutlined />
      </template>
    </am-float-button>
  </div>
</template>

<style scoped>
.demo-box {
  position: relative;
  height: 320px;
  overflow: hidden;
  background: var(--am-color-fill-quaternary);
  border-radius: var(--am-border-radius);
}

.tip {
  margin: 0;
  padding: 12px 12px 0;
  color: var(--am-color-text-secondary);
}

/* 组件变量声明在悬浮按钮（组）的根节点上，需要在其自身上覆盖 */
.demo-box > .am-float-button,
.demo-box > .am-float-button-group {
  --am-float-button-inset-inline-end: 12px;
  --am-float-button-inset-block-end: 12px;
}
</style>
