<docs lang="zh-CN">
通过 `placement` 设置弹出位置，可选 `top`、`bottom`、`left`、`right`、`center`。左右弹出时可用 `width` 指定宽度。
</docs>

<script setup lang="ts">
import type { PopupPlacement } from 'antdv-next-mobile'
import { ref } from 'vue'

const open = ref(false)
const placement = ref<PopupPlacement>('bottom')
const placements: PopupPlacement[] = ['top', 'bottom', 'left', 'right', 'center']

function show(value: PopupPlacement) {
  placement.value = value
  open.value = true
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button v-for="item in placements" :key="item" @click="show(item)">
      {{ item }}
    </am-button>
  </am-flex>
  <am-popup
    v-model:open="open"
    :placement="placement"
    :width="placement === 'left' || placement === 'right' ? '70%' : undefined"
  >
    <div class="content">
      从 {{ placement }} 弹出
    </div>
  </am-popup>
</template>

<style scoped>
.content {
  padding: 48px 24px;
  text-align: center;
}
</style>
