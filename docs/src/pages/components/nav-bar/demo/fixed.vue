<docs lang="zh-CN">
`fixed` 将导航栏固定在视口顶部，配合 `placeholder` 保留等高占位，避免内容被遮挡；全面屏下可开启 `safeArea` 适配状态栏。示例中用带 `transform` 的容器模拟视口。
</docs>

<template>
  <div class="viewport">
    <div class="scroller">
      <am-nav-bar title="固定导航栏" fixed placeholder />
      <p v-for="i in 12" :key="i" class="row">
        内容 {{ i }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* transform 让内部的 fixed 元素相对该容器定位 */
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
