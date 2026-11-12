<docs lang="zh-CN">
`lineWidth` 调整流光线宽，默认 `1px`，数字按像素处理。通常与容器的边框宽度保持一致，流光会正好盖住边框。
</docs>

<docs lang="en-US">
`lineWidth` sets the width of the beam line, `1px` by default; numbers are pixels. It usually matches the border width of the container, so the beam covers the border exactly.
</docs>

<template>
  <am-border-beam :line-width="2">
    <div class="panel">
      Set lineWidth to match the 2px border of this panel.
    </div>
  </am-border-beam>
</template>

<style scoped>
.panel {
  position: relative;
  padding: 20px;
  color: var(--am-color-text);
  font-size: var(--am-font-size);
  line-height: var(--am-line-height);
  background: var(--am-color-bg-container);
  border: 2px solid var(--am-color-border-secondary);
  border-radius: 12px;
}
</style>
