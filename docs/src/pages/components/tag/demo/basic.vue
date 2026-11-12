<docs lang="zh-CN">
基础标签，可以通过 `href` 渲染为链接，或设置 `closable` 变为可关闭标签。
</docs>

<docs lang="en-US">
Basic tags. A tag can be rendered as a link with `href`, or made closable with `closable`.
</docs>

<template>
  <am-space wrap>
    <am-tag>Tag</am-tag>
    <am-tag href="https://github.com/antdv-next" target="_blank">
      Link
    </am-tag>
    <am-tag closable>
      Closable
    </am-tag>
    <am-tag disabled>
      Disabled
    </am-tag>
  </am-space>
</template>
