<docs lang="zh-CN">
一道高光从文字上扫过，用来表示「正在进行」。文字继承所在位置的字号与字重。
</docs>

<docs lang="en-US">
A highlight sweeps across the text to say "in progress". The text inherits the font size and weight of its context.
</docs>

<template>
  <am-flex vertical gap="middle">
    <am-shimmer-text content="Thinking..." />
    <am-shimmer-text style="font-size: 20px; font-weight: 600">
      Generating your answer
    </am-shimmer-text>
    <am-shimmer-text tag="p" style="margin: 0">
      Searching the web and reading 12 pages, this may take a few seconds
    </am-shimmer-text>
  </am-flex>
</template>
