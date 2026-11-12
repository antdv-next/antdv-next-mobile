<docs lang="zh-CN">
分割线中可以带有文字，通过 `titlePlacement` 设置文字位置；`plain` 为 `false` 时文字显示为标题样式。
</docs>

<template>
  <am-divider>居中文字</am-divider>
  <am-divider title-placement="start">
    左侧文字
  </am-divider>
  <am-divider title-placement="end">
    右侧文字
  </am-divider>
  <am-divider :plain="false">
    标题样式
  </am-divider>
</template>
