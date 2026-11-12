<docs lang="zh-CN">
`size="small"` 表示小号开关，适合放在紧凑的列表或卡片中。
</docs>

<docs lang="en-US">
`size="small"` is a small switch, suitable for compact lists or cards.
</docs>

<template>
  <am-flex align="center" gap="middle">
    <am-switch default-checked />
    <am-switch size="small" default-checked />
    <am-switch size="small" checked-children="On" un-checked-children="Off" />
  </am-flex>
</template>
