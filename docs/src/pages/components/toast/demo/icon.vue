<docs lang="zh-CN">
`Toast.success()` 与 `Toast.fail()` 带有预设图标，也可以通过 `icon` 传入自定义图标。
</docs>

<script setup lang="ts">
import { HeartFilled } from '@antdv-next/icons'
import { Toast } from 'antdv-next-mobile'
import { h } from 'vue'

function custom() {
  Toast.show({ content: '已收藏', icon: () => h(HeartFilled) })
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button @click="Toast.success('保存成功')">
      成功
    </am-button>
    <am-button @click="Toast.fail('保存失败')">
      失败
    </am-button>
    <am-button @click="custom">
      自定义图标
    </am-button>
  </am-flex>
</template>
