<docs lang="zh-CN">
`mask` 控制是否显示遮罩，`maskClosable` 控制点击遮罩是否关闭。没有遮罩时页面仍可操作。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const noMask = ref(false)
const locked = ref(false)
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="noMask = !noMask">
      {{ noMask ? '关闭' : '打开' }}无遮罩弹出层
    </am-button>
    <am-button block @click="locked = true">
      点击遮罩不关闭
    </am-button>
  </am-flex>
  <am-popup v-model:open="noMask" :mask="false" :lock-scroll="false" placement="top">
    <div class="content">
      没有遮罩，页面仍可操作
    </div>
  </am-popup>
  <am-popup v-model:open="locked" :mask-closable="false" round>
    <div class="content">
      <p>只能通过按钮关闭</p>
      <am-button type="primary" @click="locked = false">
        关闭
      </am-button>
    </div>
  </am-popup>
</template>

<style scoped>
.content {
  padding: 32px 16px;
  text-align: center;
}
</style>
