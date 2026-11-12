<docs lang="zh-CN">
成功的结果，常用于支付、提交完成页。
</docs>

<template>
  <am-result
    status="success"
    title="支付成功"
    sub-title="订单号 2024080800001，预计 2 小时内发货"
  >
    <template #extra>
      <am-button type="primary" block>
        查看订单
      </am-button>
      <am-button block>
        返回首页
      </am-button>
    </template>
  </am-result>
</template>
