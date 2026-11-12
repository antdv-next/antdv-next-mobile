<docs lang="zh-CN">
通过 `color` 设置蒙层颜色：`white` 为浅色蒙层，也可以传入任意 CSS 颜色值。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const color = ref('default')

function show(value: string) {
  color.value = value
  open.value = true
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button @click="show('default')">
      默认
    </am-button>
    <am-button @click="show('white')">
      白色
    </am-button>
    <am-button @click="show('rgb(22 119 255 / 40%)')">
      自定义颜色
    </am-button>
  </am-flex>
  <am-mask v-model:open="open" :color="color" closable />
</template>
