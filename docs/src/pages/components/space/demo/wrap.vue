<docs lang="zh-CN">
设置 `wrap` 后超出一行自动换行，配合 `[水平, 垂直]` 形式的 `size` 控制行间距。
</docs>

<template>
  <am-space wrap :size="[8, 12]">
    <am-button v-for="i in 10" :key="i">
      按钮 {{ i }}
    </am-button>
  </am-space>
</template>
