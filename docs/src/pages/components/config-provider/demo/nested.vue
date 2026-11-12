<docs lang="zh-CN">
`ConfigProvider` 可以嵌套，内层继承外层主题并只覆盖差异部分。
</docs>

<template>
  <am-config-provider :theme="{ token: { colorPrimary: '#00b96b' } }">
    <am-flex vertical gap="small">
      <am-button type="primary" block>
        外层：绿色主题
      </am-button>
      <am-config-provider :theme="{ token: { colorPrimary: '#722ed1' } }">
        <am-button type="primary" block>
          内层：紫色主题
        </am-button>
      </am-config-provider>
      <am-config-provider :theme="{ token: { borderRadius: 20 } }">
        <am-button type="primary" block>
          内层：继承绿色，仅修改圆角
        </am-button>
      </am-config-provider>
    </am-flex>
  </am-config-provider>
</template>
