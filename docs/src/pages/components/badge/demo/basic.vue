<docs lang="zh-CN">
最简单的用法：把内容放进 `Badge`，通过 `count` 设置数字。`count` 为 0 时默认隐藏，可用 `showZero` 显示。
</docs>

<template>
  <am-space size="large">
    <am-badge :count="5">
      <div class="box" />
    </am-badge>
    <am-badge :count="0" show-zero>
      <div class="box" />
    </am-badge>
    <am-badge count="新">
      <div class="box" />
    </am-badge>
    <am-badge :count="5" size="small">
      <div class="box" />
    </am-badge>
  </am-space>
</template>

<style scoped>
.box {
  width: 44px;
  height: 44px;
  background: var(--am-color-fill-secondary);
  border-radius: var(--am-border-radius);
}
</style>
