<docs lang="zh-CN">
通过 `subTitle` 在标题下方展示辅助信息，标题过长时自动省略。
</docs>

<docs lang="en-US">
Show auxiliary information below the title through `subTitle`. The title is truncated automatically when it is too long.
</docs>

<template>
  <div class="stack">
    <am-nav-bar title="Weekly Report" sub-title="3 people viewing" />
    <am-nav-bar title="This is a very very very very very long page title" sub-title="The subtitle is also truncated when the width is not enough" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
