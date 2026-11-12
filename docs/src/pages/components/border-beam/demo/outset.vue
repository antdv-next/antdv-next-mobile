<docs lang="zh-CN">
`outset` 控制流光层相对容器内边缘（padding box）的外扩距离。缺省时取容器的边框宽度，使流光正好压在边框上；容器裁剪溢出内容（如 Card）时自动为 `0`。这里用它把流光向外推出 4px，形成一圈悬浮的光环；圆角不一致的容器同样适用。
</docs>

<docs lang="en-US">
`outset` is how far the beam layer sits outside the padding box of the container. By default it is the border width of the container, so the beam covers the border; it is `0` automatically when the container clips its overflow (e.g. Card). Here it pushes the beam 4px outwards as a floating ring; non-uniform radii work as well.
</docs>

<template>
  <am-flex vertical gap="large">
    <am-border-beam :outset="4" :line-width="2">
      <div class="panel">
        The beam floats 4px outside this panel.
      </div>
    </am-border-beam>
    <am-border-beam :outset="0">
      <div class="panel sheet">
        Outset 0 keeps the beam inside a clipped container with non-uniform corners.
      </div>
    </am-border-beam>
  </am-flex>
</template>

<style scoped>
.panel {
  position: relative;
  padding: 20px;
  color: var(--am-color-text);
  font-size: var(--am-font-size);
  line-height: var(--am-line-height);
  background: var(--am-color-bg-container);
  border: 1px solid var(--am-color-border-secondary);
  border-radius: 12px;
}

.sheet {
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}
</style>
