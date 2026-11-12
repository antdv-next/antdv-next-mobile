<docs lang="zh-CN">
`block` 让分段控制器撑满父元素宽度，选项等分宽度。这是移动端最常用的形态。
</docs>

<template>
  <am-flex vertical gap="middle">
    <am-segmented block :options="['全部', '未读', '已读']" />
    <am-segmented block :options="['推荐', '关注', '热榜', '同城']" default-value="热榜" />
  </am-flex>
</template>
