<docs lang="zh-CN">
覆盖 `--am-notice-bar-*` 组件变量即可自定义颜色与尺寸。
</docs>

<template>
  <am-notice-bar
    class="custom-notice"
    shape="rounded"
    :bordered="false"
    content="自定义主题色的通告栏"
    :styles="{ content: { fontWeight: 600 } }"
  />
</template>

<style scoped>
.custom-notice {
  --am-notice-bar-color: var(--am-color-white);
  --am-notice-bar-bg: linear-gradient(90deg, #7a5cff, #1677ff);
  --am-notice-bar-height: 36px;
  --am-notice-bar-padding-inline: 16px;
}
</style>
