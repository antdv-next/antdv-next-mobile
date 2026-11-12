<docs lang="zh-CN">
`arrow` 设为 `false` 隐藏箭头。靠近屏幕边缘时，气泡会沿边缘偏移以保持在屏幕内，箭头始终指向触发元素。
</docs>

<template>
  <am-flex justify="space-between">
    <am-popover content="靠近左边缘时气泡会自动向右偏移，保证内容完整可见" placement="top">
      <am-button>左边缘</am-button>
    </am-popover>
    <am-popover content="没有箭头" :arrow="false">
      <am-button>无箭头</am-button>
    </am-popover>
    <am-popover content="靠近右边缘时气泡会自动向左偏移，保证内容完整可见" placement="top">
      <am-button>右边缘</am-button>
    </am-popover>
  </am-flex>
</template>
