<docs lang="zh-CN">
`block` 属性使按钮宽度撑满父元素，移动端最常见的主操作按钮形态。
</docs>

<docs lang="en-US">
The `block` prop makes the button fit the width of its parent, the most common form of a primary action button on mobile.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-button type="primary" block>
      Primary Block
    </am-button>
    <am-button block>
      Default Block
    </am-button>
    <am-button type="primary" danger block>
      Danger Block
    </am-button>
  </am-flex>
</template>
