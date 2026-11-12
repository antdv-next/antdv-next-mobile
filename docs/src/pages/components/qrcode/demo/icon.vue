<docs lang="zh-CN">
带 Icon 的二维码。图标会遮挡一部分内容，建议同时使用较高的纠错等级。
</docs>

<docs lang="en-US">
QR code with an icon. The icon covers a part of the code, so use a higher error level with it.
</docs>

<template>
  <am-flex justify="center">
    <am-qrcode error-level="H" value="https://www.antdv-next.com" icon="/logo.svg" />
  </am-flex>
</template>
