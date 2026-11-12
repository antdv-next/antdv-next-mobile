<docs lang="zh-CN">
`size="small"` 表示小号开关，适合放在紧凑的列表或卡片中。
</docs>

<template>
  <am-flex align="center" gap="middle">
    <am-switch default-checked />
    <am-switch size="small" default-checked />
    <am-switch size="small" checked-children="开" un-checked-children="关" />
  </am-flex>
</template>
