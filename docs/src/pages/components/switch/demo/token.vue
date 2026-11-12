<docs lang="zh-CN">
通过覆盖组件 CSS 变量（或 `ConfigProvider` 的 `theme.components.Switch`）定制颜色与尺寸。
</docs>

<docs lang="en-US">
Customize the colors and size by overriding the component CSS variables (or `theme.components.Switch` of `ConfigProvider`).
</docs>

<template>
  <am-flex align="center" gap="middle">
    <am-switch default-checked style="--am-switch-color: var(--am-color-success)" />
    <am-switch default-checked style="--am-switch-color: var(--am-color-error)" />
    <am-switch
      default-checked
      style="--am-switch-height: 36px; --am-switch-handle-size: 32px; --am-switch-min-width: 64px"
    />
  </am-flex>
</template>
