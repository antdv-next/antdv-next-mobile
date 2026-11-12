<docs lang="zh-CN">
通过 `theme.components` 只调整某一类组件，对应每个组件文档中的「主题变量」。
</docs>

<template>
  <am-config-provider
    :theme="{
      components: {
        Button: { height: 52, borderRadius: 26, fontSize: 18, fontWeight: 600 },
      },
    }"
  >
    <am-button type="primary" block>
      更高更圆的按钮
    </am-button>
  </am-config-provider>
</template>
