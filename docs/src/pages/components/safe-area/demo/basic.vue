<docs lang="zh-CN">
在内容的顶部和底部分别放置安全区占位。在全面屏设备上打开可以看到上下留白，普通设备上高度为 0。
</docs>

<docs lang="en-US">
Place a safe area placeholder at the top and at the bottom of the content. Open it on a full-screen device to see the space at the top and bottom; the height is 0 on ordinary devices.
</docs>

<template>
  <div class="page">
    <am-safe-area position="top" class="area" />
    <div class="content">
      Content area
    </div>
    <am-safe-area position="bottom" class="area" />
  </div>
</template>

<style scoped>
.page {
  background: var(--am-color-bg-container);
}

.area {
  background: var(--am-color-primary-bg);
}

.content {
  padding: 32px 16px;
  color: var(--am-color-text);
  font-size: var(--am-font-size);
  text-align: center;
}
</style>
