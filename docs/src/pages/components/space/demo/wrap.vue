<docs lang="zh-CN">
设置 `wrap` 后超出一行自动换行，配合 `[水平, 垂直]` 形式的 `size` 控制行间距。
</docs>

<docs lang="en-US">
With `wrap`, content wraps automatically when it exceeds one line; use `size` in the `[horizontal, vertical]` form to control the row gap.
</docs>

<template>
  <am-space wrap :size="[8, 12]">
    <am-button v-for="i in 10" :key="i">
      Button {{ i }}
    </am-button>
  </am-space>
</template>
