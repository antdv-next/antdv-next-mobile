<docs lang="zh-CN">
也可以把内容放进默认插槽，安全区以内边距的形式附加在内容之外，少写一层结构。
</docs>

<docs lang="en-US">
You can also put content into the default slot. The safe area is added as padding outside the content, saving one level of markup.
</docs>

<template>
  <am-safe-area position="bottom" class="footer">
    <div class="footer-inner">
      <am-button type="primary" block>
        OK
      </am-button>
    </div>
  </am-safe-area>
</template>

<style scoped>
.footer {
  background: var(--am-color-bg-container);
  border-top: 1px solid var(--am-color-split);
}

.footer-inner {
  padding: 12px 16px;
}
</style>
