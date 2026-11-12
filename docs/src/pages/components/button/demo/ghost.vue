<docs lang="zh-CN">
幽灵按钮将按钮的内容反色，背景变为透明，常用在有色背景上。
</docs>

<template>
  <div class="ghost-demo">
    <am-flex gap="small" wrap>
      <am-button type="primary" ghost>
        Primary
      </am-button>
      <am-button ghost>
        Default
      </am-button>
      <am-button type="primary" danger ghost>
        Danger
      </am-button>
    </am-flex>
  </div>
</template>

<style scoped>
.ghost-demo {
  padding: 16px;
  background: linear-gradient(135deg, #1f2937, #4b5563);
  border-radius: 8px;
}
</style>
