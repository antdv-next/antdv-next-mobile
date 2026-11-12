<docs lang="zh-CN">
`round` 开启圆角，`closable` 显示关闭图标，也可以通过 `closeIcon` 属性或插槽自定义图标。
</docs>

<script setup lang="ts">
import { CloseCircleFilled } from '@antdv-next/icons'
import { ref } from 'vue'

const round = ref(false)
const custom = ref(false)
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="round = true">
      圆角 + 关闭图标
    </am-button>
    <am-button block @click="custom = true">
      自定义关闭图标
    </am-button>
  </am-flex>
  <am-popup v-model:open="round" round closable height="40%">
    <div class="content">
      圆角弹出层
    </div>
  </am-popup>
  <am-popup v-model:open="custom" round closable height="40%">
    <template #closeIcon>
      <CloseCircleFilled />
    </template>
    <div class="content">
      自定义关闭图标
    </div>
  </am-popup>
</template>

<style scoped>
.content {
  padding: 48px 16px;
  text-align: center;
}
</style>
