<docs lang="zh-CN">
独立使用并设置 `status` 或 `color` 时显示为状态点，配合 `text` 表示状态。
</docs>

<template>
  <am-space vertical>
    <am-badge status="success" text="已完成" />
    <am-badge status="processing" text="进行中" />
    <am-badge status="warning" text="待确认" />
    <am-badge status="error" text="已失败" />
    <am-badge status="default" text="未开始" />
    <am-badge color="purple" text="自定义颜色 purple" />
    <am-badge color="#f50" text="自定义颜色 #f50" />
  </am-space>
</template>
