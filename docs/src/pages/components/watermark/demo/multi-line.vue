<docs lang="zh-CN">
`content` 传入字符串数组即可指定多行文字水印。
</docs>

<docs lang="en-US">
Pass an array of strings to `content` to specify a multi-line text watermark.
</docs>

<template>
  <am-watermark :content="['Antdv Next Mobile', 'Happy Working']" :gap="[60, 80]">
    <div style="height: 240px" />
  </am-watermark>
</template>
