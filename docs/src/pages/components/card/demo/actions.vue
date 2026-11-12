<docs lang="zh-CN">
`actions` 插槽中的每个节点会成为底部操作栏中等分的一项；`footer` 则是一块自由排版的页脚。
</docs>

<script setup lang="ts">
import { EditOutlined, LikeOutlined, ShareAltOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-space vertical block size="middle">
    <am-card title="今日推荐">
      移动端的卡片操作通常放在底部，方便单手点击。
      <template #actions>
        <span><LikeOutlined /> 点赞</span>
        <span><EditOutlined /> 评论</span>
        <span><ShareAltOutlined /> 分享</span>
      </template>
    </am-card>
    <am-card title="订单 2024080800001" extra="待付款">
      antdv-next-mobile 定制周边 T 恤 × 1
      <template #footer>
        <am-flex justify="flex-end" gap="small">
          <am-button size="small" shape="round">
            取消订单
          </am-button>
          <am-button size="small" shape="round" type="primary">
            去支付
          </am-button>
        </am-flex>
      </template>
    </am-card>
  </am-space>
</template>
