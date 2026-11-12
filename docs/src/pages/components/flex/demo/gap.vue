<docs lang="zh-CN">
`gap` 支持预设的 `small`、`middle`、`large`，也可以传入数字（px）或任意 CSS 长度。
</docs>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="small">
      <am-button>small</am-button>
      <am-button>8px</am-button>
    </am-flex>
    <am-flex gap="middle">
      <am-button>middle</am-button>
      <am-button>16px</am-button>
    </am-flex>
    <am-flex gap="large">
      <am-button>large</am-button>
      <am-button>24px</am-button>
    </am-flex>
    <am-flex :gap="4">
      <am-button>数字</am-button>
      <am-button>4</am-button>
    </am-flex>
    <am-flex gap="2em">
      <am-button>字符串</am-button>
      <am-button>2em</am-button>
    </am-flex>
  </am-flex>
</template>
