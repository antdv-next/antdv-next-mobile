<docs lang="zh-CN">
标准的进度条，包含进行中、活动、异常、完成等状态。
</docs>

<template>
  <am-flex vertical gap="middle">
    <am-progress :percent="30" />
    <am-progress :percent="50" status="active" />
    <am-progress :percent="70" status="exception" />
    <am-progress :percent="100" />
    <am-progress :percent="50" :show-info="false" />
  </am-flex>
</template>
