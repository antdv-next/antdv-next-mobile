<docs lang="zh-CN">
移动端特有的 `block` 属性让 `Space` 撑满父元素宽度，垂直排列时子元素也随之撑满，适合页面底部的操作区。
</docs>

<docs lang="en-US">
The mobile-only `block` prop makes `Space` fit the width of its parent; when arranged vertically the children stretch as well, which suits the action area at the bottom of a page.
</docs>

<template>
  <am-space vertical block size="middle">
    <am-button type="primary" block>
      Place order
    </am-button>
    <am-button block>
      Add to cart
    </am-button>
  </am-space>
</template>
