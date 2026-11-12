<docs lang="zh-CN">
`footer` 设为 `null` 可以隐藏底部，配合 `closable` 使用；也可以通过 `footer` 插槽完全自定义，插槽参数提供 `ok` 与 `cancel` 方法。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const noFooter = ref(false)
const custom = ref(false)
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="noFooter = true">
      无底部 + 关闭按钮
    </am-button>
    <am-button block @click="custom = true">
      自定义底部
    </am-button>
  </am-flex>
  <am-modal v-model:open="noFooter" title="公告" :footer="null" closable>
    没有底部按钮，点击右上角或遮罩关闭。
  </am-modal>
  <am-modal v-model:open="custom" title="领取优惠券" @ok="custom = false">
    恭喜获得一张 20 元优惠券。
    <template #footer="{ ok, cancel }">
      <am-flex vertical gap="small">
        <am-button type="primary" block shape="round" @click="ok">
          立即领取
        </am-button>
        <am-button type="text" block @click="cancel">
          残忍拒绝
        </am-button>
      </am-flex>
    </template>
  </am-modal>
</template>
