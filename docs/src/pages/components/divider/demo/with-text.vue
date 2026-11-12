<docs lang="zh-CN">
分割线中可以带有文字，通过 `titlePlacement` 设置文字位置；`plain` 为 `false` 时文字显示为标题样式。
</docs>

<docs lang="en-US">
A divider can contain text; set its position with `titlePlacement`. When `plain` is `false`, the text is displayed in heading style.
</docs>

<template>
  <am-divider>Center text</am-divider>
  <am-divider title-placement="start">
    Left text
  </am-divider>
  <am-divider title-placement="end">
    Right text
  </am-divider>
  <am-divider :plain="false">
    Heading style
  </am-divider>
</template>
