<docs lang="zh-CN">
`block` 让分段控制器撑满父元素宽度，选项等分宽度。这是移动端最常用的形态。
</docs>

<docs lang="en-US">
`block` makes the segmented control fit the width of its parent, with options sharing the width equally. This is the most common form on mobile.
</docs>

<template>
  <am-flex vertical gap="middle">
    <am-segmented block :options="['All', 'Unread', 'Read']" />
    <am-segmented block :options="['For you', 'Following', 'Hot', 'Nearby']" default-value="Hot" />
  </am-flex>
</template>
