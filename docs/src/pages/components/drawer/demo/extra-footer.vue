<docs lang="zh-CN">
通过 `extra` 在头部放置额外操作，通过 `footer` 设置页脚。两者都同时支持属性与同名插槽。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button block @click="open = true">
    带操作与页脚
  </am-button>
  <am-drawer v-model:open="open" title="筛选条件" :closable="false">
    <template #extra>
      <am-button type="link" @click="open = false">
        重置
      </am-button>
    </template>
    <p>价格区间</p>
    <p>品牌</p>
    <p>发货地</p>
    <template #footer>
      <am-flex gap="small">
        <am-button block @click="open = false">
          取消
        </am-button>
        <am-button type="primary" block @click="open = false">
          确定
        </am-button>
      </am-flex>
    </template>
  </am-drawer>
</template>
