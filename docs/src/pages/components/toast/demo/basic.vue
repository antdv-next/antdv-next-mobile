<docs lang="zh-CN">
`Toast.show()` 可以直接传入文字，默认 2 秒后自动关闭。文字较长时会自动换行。
</docs>

<script setup lang="ts">
import { Toast } from 'antdv-next-mobile'
</script>

<template>
  <am-flex vertical gap="small">
    <am-button type="primary" block @click="Toast.show('这是一条轻提示')">
      轻提示
    </am-button>
    <am-button block @click="Toast.show('这是一条比较长的轻提示，文字超过最大宽度时会自动换行显示')">
      长文字
    </am-button>
  </am-flex>
</template>
