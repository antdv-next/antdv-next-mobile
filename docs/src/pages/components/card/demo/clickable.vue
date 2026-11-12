<docs lang="zh-CN">
移动端特有：开启 `clickable` 后整张卡片在按下时有缩放与透明度反馈，点击事件直接绑定在卡片上。
</docs>

<docs lang="en-US">
Mobile only: with `clickable` turned on, the whole card gives scale and opacity feedback when pressed, and the click event is bound directly on the card.
</docs>

<script setup lang="ts">
import { RightOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <am-card clickable @click="count++">
    <am-flex justify="space-between" align="center">
      <am-card-meta title="My coupons" :description="`Clicked ${count} times`" />
      <RightOutlined style="color: var(--am-color-text-quaternary)" />
    </am-flex>
  </am-card>
</template>
