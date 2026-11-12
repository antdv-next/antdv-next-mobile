<docs lang="zh-CN">
设置 `wrap` 后内容超出一行时自动换行。
</docs>

<template>
  <am-flex wrap gap="small">
    <am-button v-for="i in 9" :key="i" type="primary" variant="filled" color="primary">
      按钮 {{ i }}
    </am-button>
  </am-flex>
</template>
