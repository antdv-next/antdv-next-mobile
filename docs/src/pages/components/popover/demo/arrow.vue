<docs lang="zh-CN">
`arrow` 设为 `false` 隐藏箭头。靠近屏幕边缘时，气泡会沿边缘偏移以保持在屏幕内，箭头始终指向触发元素。
</docs>

<docs lang="en-US">
Set `arrow` to `false` to hide the arrow. Near the screen edge the popover shifts along the edge to stay within the screen, and the arrow always points at the trigger element.
</docs>

<template>
  <am-flex justify="space-between">
    <am-popover content="Near the left edge the popover shifts right so the content stays fully visible" placement="top">
      <am-button>Left</am-button>
    </am-popover>
    <am-popover content="No arrow here" :arrow="false">
      <am-button>No arrow</am-button>
    </am-popover>
    <am-popover content="Near the right edge the popover shifts left so the content stays fully visible" placement="top">
      <am-button>Right</am-button>
    </am-popover>
  </am-flex>
</template>
