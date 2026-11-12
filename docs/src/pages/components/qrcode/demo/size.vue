<docs lang="zh-CN">
`size` 可以是数字（px），也可以是任意 CSS 长度：`100%` 让二维码撑满容器宽度并保持正方形。
</docs>

<docs lang="en-US">
`size` is a number (px) or any CSS length: `100%` makes the QR code as wide as its container while staying square.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref(160)
const full = ref(false)
</script>

<template>
  <am-flex vertical align="center" gap="middle">
    <am-flex gap="small">
      <am-button size="small" :disabled="full || size <= 80" @click="size -= 20">
        Smaller
      </am-button>
      <am-button size="small" :disabled="full || size >= 300" @click="size += 20">
        Larger
      </am-button>
      <am-button size="small" :type="full ? 'primary' : 'default'" @click="full = !full">
        100%
      </am-button>
    </am-flex>
    <am-qrcode
      error-level="H"
      :size="full ? '100%' : size"
      :icon-size="full ? 64 : size / 4"
      value="https://www.antdv-next.com"
      icon="/logo.svg"
    />
  </am-flex>
</template>
