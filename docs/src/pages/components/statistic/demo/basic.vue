<docs lang="zh-CN">
简单的展示，默认带千分位分隔符，`precision` 控制小数位数。
</docs>

<template>
  <am-flex gap="large">
    <am-statistic title="活跃用户" :value="112893" />
    <am-statistic title="账户余额 (元)" :value="112893.126" :precision="2" />
  </am-flex>
</template>
