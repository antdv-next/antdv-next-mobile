<docs lang="zh-CN">
`content` 传入字符串数组即可指定多行文字水印。
</docs>

<template>
  <am-watermark :content="['Antdv Next Mobile', '周毛毛 0000']" :gap="[60, 80]">
    <div style="height: 240px" />
  </am-watermark>
</template>
