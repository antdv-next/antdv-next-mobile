<docs lang="zh-CN">
`image` 可以是图片地址，也可以通过同名插槽放置任意节点；图片区域的高度通过 `styles.image` 或 `--am-empty-image-height` 调整。
</docs>

<script setup lang="ts">
import { WifiOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-empty
    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
    description="自定义图片地址"
    :styles="{ image: { height: '60px' } }"
  />
  <am-divider />
  <am-empty description="网络不给力，请稍后重试" class="offline">
    <template #image>
      <WifiOutlined />
    </template>
    <am-button size="small">
      重新加载
    </am-button>
  </am-empty>
</template>

<style scoped>
.offline {
  --am-empty-image-height: 64px;
}

.offline :deep(.am-empty-image) {
  color: var(--am-color-text-quaternary);
  font-size: 56px;
}
</style>
