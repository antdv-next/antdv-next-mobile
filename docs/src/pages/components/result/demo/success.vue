<docs lang="zh-CN">
成功的结果，常用于支付、提交完成页。
</docs>

<docs lang="en-US">
A successful result, commonly used on payment or submission completion pages.
</docs>

<template>
  <am-result
    status="success"
    title="Payment successful"
    sub-title="Order No. 2024080800001, ships within 2 hours"
  >
    <template #extra>
      <am-button type="primary" block>
        View order
      </am-button>
      <am-button block>
        Back home
      </am-button>
    </template>
  </am-result>
</template>
