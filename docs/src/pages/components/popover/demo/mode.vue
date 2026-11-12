<docs lang="zh-CN">
`mode="dark"` 使用深色背景，适合简短的提示文字；也可以通过 `color` 自定义背景色。
</docs>

<template>
  <am-flex gap="small" wrap>
    <am-popover content="浅色气泡" placement="topLeft">
      <am-button>Light</am-button>
    </am-popover>
    <am-popover content="深色气泡" mode="dark">
      <am-button>Dark</am-button>
    </am-popover>
    <am-popover
      content="自定义颜色"
      color="#722ed1"
      mode="dark"
      placement="topRight"
    >
      <am-button>Color</am-button>
    </am-popover>
  </am-flex>
</template>
