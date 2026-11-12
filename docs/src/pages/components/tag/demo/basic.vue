<docs lang="zh-CN">
基础标签，可以通过 `href` 渲染为链接，或设置 `closable` 变为可关闭标签。
</docs>

<template>
  <am-space wrap>
    <am-tag>标签</am-tag>
    <am-tag href="https://github.com/antdv-next" target="_blank">
      链接
    </am-tag>
    <am-tag closable>
      可关闭
    </am-tag>
    <am-tag disabled>
      禁用
    </am-tag>
  </am-space>
</template>
