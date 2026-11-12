<docs lang="zh-CN">
任意元素都可以作为宿主。流光层通过 `position: absolute` 贴合容器边缘，因此宿主需要提供定位上下文（通常是 `position: relative`）；圆角通过 `border-radius: inherit` 自动跟随。
</docs>

<docs lang="en-US">
Any element can be the host. The beam layer hugs the container edge with `position: absolute`, so the host has to be a positioning context (usually `position: relative`); the radius follows through `border-radius: inherit`.
</docs>

<template>
  <am-border-beam>
    <div class="panel">
      Review task status, deployment health and recent automation activity in one custom container.
    </div>
  </am-border-beam>
</template>

<style scoped>
.panel {
  position: relative;
  min-height: 120px;
  padding: 20px;
  color: var(--am-color-text);
  font-size: var(--am-font-size);
  line-height: var(--am-line-height);
  background: var(--am-color-bg-container);
  border: 1px solid var(--am-color-border-secondary);
  border-radius: 20px;
}
</style>
