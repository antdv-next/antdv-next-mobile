<docs lang="zh-CN">
`mode="dark"` 使用深色背景，适合简短的提示文字；也可以通过 `color` 自定义背景色。
</docs>

<docs lang="en-US">
`mode="dark"` uses a dark background, which suits short hint texts; the background color can also be customized through `color`.
</docs>

<template>
  <am-flex gap="small" wrap>
    <am-popover content="Light popover" placement="topLeft">
      <am-button>Light</am-button>
    </am-popover>
    <am-popover content="Dark popover" mode="dark">
      <am-button>Dark</am-button>
    </am-popover>
    <am-popover
      content="Custom color"
      color="#722ed1"
      mode="dark"
      placement="topRight"
    >
      <am-button>Color</am-button>
    </am-popover>
  </am-flex>
</template>
