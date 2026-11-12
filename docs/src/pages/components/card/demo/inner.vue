<docs lang="zh-CN">
`type="inner"` 的卡片用于嵌套在其他卡片中，标题栏带有浅色背景。
</docs>

<template>
  <am-card title="订单详情">
    <am-space vertical block size="middle">
      <am-card type="inner" title="包裹 1" extra="已签收">
        2 件商品，由顺丰速运配送
      </am-card>
      <am-card type="inner" title="包裹 2" extra="运输中">
        1 件商品，预计明天送达
      </am-card>
    </am-space>
  </am-card>
</template>
