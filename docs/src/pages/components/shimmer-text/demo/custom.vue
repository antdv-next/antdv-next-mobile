<docs lang="zh-CN">
`color` 与 `shimmer-color` 设置底色和高光颜色，`duration` 设置扫过一次的时间（数字单位为秒）。
</docs>

<docs lang="en-US">
`color` and `shimmer-color` set the base and highlight colors, `duration` sets the time of one sweep (numbers are seconds).
</docs>

<template>
  <am-flex vertical gap="middle">
    <am-shimmer-text color="#1677ff" shimmer-color="#bae0ff" content="Syncing 128 files" />
    <am-shimmer-text color="#d48806" shimmer-color="#ffe58f" :duration="1" content="Fast sweep, 1s" />
    <am-shimmer-text :duration="4" content="Slow sweep, 4s" />
  </am-flex>
</template>
