<docs lang="zh-CN">
带步骤的进度条，`strokeColor` 传入数组可以为每一步设置颜色。
</docs>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-progress :percent="50" :steps="3" />
    <am-progress :percent="30" :steps="5" />
    <am-progress :percent="100" :steps="5" size="small" stroke-color="#52c41a" />
    <am-progress :percent="60" :steps="5" :size="[28, 10]" :stroke-color="['#52c41a', '#52c41a', '#faad14']" />
    <am-progress :percent="75" :steps="{ count: 8, gap: 6 }" :size="[20, 20]" stroke-linecap="butt" :show-info="false" />
  </am-flex>
</template>
