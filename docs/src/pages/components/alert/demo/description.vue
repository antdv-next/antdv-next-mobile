<docs lang="zh-CN">
含有辅助性文字介绍的警告提示。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-alert
      type="success"
      show-icon
      title="支付成功"
      description="订单已提交，我们会尽快为你安排发货，可在「我的订单」中查看物流进度。"
    />
    <am-alert type="error" show-icon title="提交失败">
      <template #description>
        网络开小差了，请检查网络设置后重试。
      </template>
    </am-alert>
  </am-flex>
</template>
