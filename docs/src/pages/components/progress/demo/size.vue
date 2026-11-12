<docs lang="zh-CN">
`size` 调整粗细与宽度，`percentPosition` 调整数值的位置，`inner` 会把数值显示在进度条内。
</docs>

<docs lang="en-US">
`size` adjusts the thickness and width, `percentPosition` adjusts the position of the value, and `inner` shows the value inside the progress bar.
</docs>

<template>
  <am-flex vertical gap="middle">
    <am-progress :percent="50" size="small" />
    <am-progress :percent="50" :size="16" />
    <am-progress :percent="50" :size="['60%', 12]" stroke-linecap="butt" />
    <am-progress :percent="60" :percent-position="{ align: 'start', type: 'outer' }" />
    <am-progress :percent="60" :percent-position="{ align: 'center', type: 'outer' }" />
    <am-progress :percent="60" :percent-position="{ align: 'end', type: 'inner' }" />
    <am-progress :percent="100" :percent-position="{ align: 'center', type: 'inner' }" :size="[300, 24]" />
  </am-flex>
</template>
