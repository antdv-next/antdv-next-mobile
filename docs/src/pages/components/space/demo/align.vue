<docs lang="zh-CN">
通过 `align` 设置交叉轴的对齐方式。
</docs>

<docs lang="en-US">
Set the cross-axis alignment with `align`.
</docs>

<template>
  <am-space vertical block size="middle">
    <am-space v-for="align in ['start', 'center', 'end', 'baseline']" :key="align" :align="align" class="box">
      <span>{{ align }}</span>
      <am-button type="primary" size="small">
        Button
      </am-button>
      <span class="tall">Block</span>
    </am-space>
  </am-space>
</template>

<style scoped>
.box {
  padding: 8px;
  color: var(--am-color-text);
  font-size: var(--am-font-size);
  border: 1px dashed var(--am-color-border);
  border-radius: var(--am-border-radius);
}

.tall {
  display: inline-block;
  padding: 24px 8px 8px;
  background: var(--am-color-fill-secondary);
  border-radius: var(--am-border-radius-sm);
}
</style>
