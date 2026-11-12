<docs lang="zh-CN">
`fixed` 将导航栏固定在视口顶部，配合 `placeholder` 保留等高占位，避免内容被遮挡；全面屏下可开启 `safeArea` 适配状态栏。示例中用带 `transform` 的容器模拟视口。
</docs>

<docs lang="en-US">
`fixed` fixes the nav bar at the top of the viewport; use it with `placeholder` to keep a placeholder of the same height so the content is not covered. On full-screen devices, enable `safeArea` to adapt to the status bar. The example uses a container with `transform` to simulate the viewport.
</docs>

<template>
  <div class="viewport">
    <div class="scroller">
      <am-nav-bar title="Fixed nav bar" fixed placeholder />
      <p v-for="i in 12" :key="i" class="row">
        Content {{ i }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* transform makes the fixed elements inside position relative to this container */
.viewport {
  height: 240px;
  overflow: hidden;
  transform: translateZ(0);
}

.scroller {
  height: 100%;
  overflow-y: auto;
}

.row {
  margin: 0;
  padding: 12px 16px;
  color: var(--am-color-text-secondary);
}
</style>
