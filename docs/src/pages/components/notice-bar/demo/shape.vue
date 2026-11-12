<docs lang="zh-CN">
`shape` 控制圆角形状，`bordered` 控制边框。非通栏使用时推荐 `neutral` 或 `rounded`。
</docs>

<docs lang="en-US">
`shape` controls the corner shape, and `bordered` controls the border. `neutral` or `rounded` is recommended when it is not used full-width.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-notice-bar shape="rectangular" content="rectangular: square corners, top and bottom borders only" />
    <am-notice-bar shape="neutral" color="info" content="neutral: rounded corners" />
    <am-notice-bar shape="rounded" color="success" content="rounded: pill" />
    <am-notice-bar shape="neutral" color="error" :bordered="false" content="bordered=false: no border" />
  </am-flex>
</template>
