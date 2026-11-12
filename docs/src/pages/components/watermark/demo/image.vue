<docs lang="zh-CN">
通过 `image` 指定图片地址。为保证图片高清且不被拉伸，请设置 `width` 和 `height`，并上传至少两倍尺寸的图片。
</docs>

<template>
  <am-watermark
    :height="30"
    :width="130"
    :gap="[60, 60]"
    image="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original"
  >
    <div style="height: 240px" />
  </am-watermark>
</template>
