<docs lang="zh-CN">
通过 `subTitle` 在标题下方展示辅助信息，标题过长时自动省略。
</docs>

<template>
  <div class="stack">
    <am-nav-bar title="项目周报" sub-title="3 人正在查看" />
    <am-nav-bar title="这是一个非常非常非常非常非常非常长的页面标题" sub-title="副标题同样会在宽度不足时省略显示" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
