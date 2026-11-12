<docs lang="zh-CN">
`success` 用于展示分段进度，例如「已完成 / 进行中 / 未开始」。
</docs>

<template>
  <am-flex vertical gap="middle">
    <am-progress :percent="60" :success="{ percent: 30 }" />
    <am-flex gap="middle" align="center">
      <am-progress type="circle" :percent="60" :success="{ percent: 30 }" :size="96" />
      <am-progress type="dashboard" :percent="60" :success="{ percent: 30 }" :size="96" />
    </am-flex>
  </am-flex>
</template>
