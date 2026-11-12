<docs lang="zh-CN">
移动端特有的 `block` 属性让 `Space` 撑满父元素宽度，垂直排列时子元素也随之撑满，适合页面底部的操作区。
</docs>

<template>
  <am-space vertical block size="middle">
    <am-button type="primary" block>
      提交订单
    </am-button>
    <am-button block>
      加入购物车
    </am-button>
  </am-space>
</template>
