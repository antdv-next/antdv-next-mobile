<docs lang="zh-CN">
`size` 提供三种尺寸，`disabled` 禁用分页。
</docs>

<docs lang="en-US">
`size` provides three sizes, and `disabled` disables the pagination.
</docs>

<template>
  <am-flex vertical gap="large">
    <am-pagination size="small" :total="50" :default-current="2" />
    <am-pagination size="large" :total="50" :default-current="2" />
    <am-pagination disabled :total="50" :default-current="2" />
    <am-pagination disabled simple :total="50" :default-current="2" />
  </am-flex>
</template>
