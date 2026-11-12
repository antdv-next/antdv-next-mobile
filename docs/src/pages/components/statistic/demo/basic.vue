<docs lang="zh-CN">
简单的展示，默认带千分位分隔符，`precision` 控制小数位数。
</docs>

<docs lang="en-US">
Simple display, with a thousands separator by default. `precision` controls the number of decimal places.
</docs>

<template>
  <am-flex gap="large">
    <am-statistic title="Active Users" :value="112893" />
    <am-statistic title="Balance (CNY)" :value="112893.126" :precision="2" />
  </am-flex>
</template>
