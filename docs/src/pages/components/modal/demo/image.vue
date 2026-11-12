<docs lang="zh-CN">
通过 `image` 在顶部展示图片，或使用 `header` 插槽放置任意内容（图标、插画等）。
</docs>

<script setup lang="ts">
import { GiftFilled } from '@antdv-next/icons'
import { ref } from 'vue'

const image = ref(false)
const header = ref(false)
const src = 'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22120%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 x2=%221%22 y1=%220%22 y2=%221%22%3E%3Cstop offset=%220%22 stop-color=%22%236253e1%22/%3E%3Cstop offset=%221%22 stop-color=%22%2304befe%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22260%22 height=%22120%22 fill=%22url(%23g)%22/%3E%3C/svg%3E'
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="image = true">
      顶部图片
    </am-button>
    <am-button block @click="header = true">
      header 插槽
    </am-button>
  </am-flex>
  <am-modal v-model:open="image" title="新功能上线" :image="src" :ok-cancel="false" @ok="image = false">
    现在可以通过拖拽调整首页卡片的顺序了。
  </am-modal>
  <am-modal v-model:open="header" title="签到成功" ok-text="收下奖励" :ok-cancel="false" @ok="header = false">
    <template #header>
      <GiftFilled class="gift" />
    </template>
    已连续签到 7 天，获得 100 积分。
  </am-modal>
</template>

<style scoped>
.gift {
  color: var(--am-color-warning);
  font-size: 48px;
}
</style>
