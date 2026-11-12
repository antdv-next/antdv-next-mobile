<docs lang="zh-CN">
`size` 控制流光可见段的尺寸，默认 `100`，数字按像素处理。手机上的容器通常较小，`size` 应明显小于容器短边的两倍。
</docs>

<docs lang="en-US">
`size` is the size of the visible beam segment, `100` by default; numbers are pixels. Containers are small on a phone: keep `size` clearly below twice the shorter side of the container.
</docs>

<script setup lang="ts">
const sizes = [
  { name: 'Compact', size: 56, description: 'A shorter highlight for dense card groups.' },
  { name: 'Default', size: 100, description: 'The default 100px beam segment.' },
  { name: 'Extended', size: 160, description: 'A longer highlight for wide feature panels.' },
]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-border-beam v-for="item in sizes" :key="item.size" :size="item.size">
      <am-card :title="item.name" :extra="`${item.size}px`">
        {{ item.description }}
      </am-card>
    </am-border-beam>
  </am-flex>
</template>
