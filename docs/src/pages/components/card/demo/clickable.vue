<docs lang="zh-CN">
移动端特有：开启 `clickable` 后整张卡片在按下时有缩放与透明度反馈，点击事件直接绑定在卡片上。
</docs>

<script setup lang="ts">
import { RightOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <am-card clickable @click="count++">
    <am-flex justify="space-between" align="center">
      <am-card-meta title="我的优惠券" :description="`已点击 ${count} 次`" />
      <RightOutlined style="color: var(--am-color-text-quaternary)" />
    </am-flex>
  </am-card>
</template>
