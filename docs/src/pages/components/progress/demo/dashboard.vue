<docs lang="zh-CN">
通过 `type="dashboard"` 切换为仪表盘样式，`gapDegree` 与 `gapPlacement` 调整缺口。
</docs>

<docs lang="en-US">
Switch to the dashboard style with `type="dashboard"`, and adjust the gap with `gapDegree` and `gapPlacement`.
</docs>

<template>
  <am-flex gap="middle" align="center" wrap>
    <am-progress type="dashboard" :percent="75" :size="96" />
    <am-progress type="dashboard" :percent="75" :gap-degree="30" :size="96" />
    <am-progress type="dashboard" :percent="75" :gap-degree="180" gap-placement="bottom" :size="96" />
  </am-flex>
</template>
