<docs lang="zh-CN">
提供大、中、小三种尺寸，默认为中。也可以通过 `ConfigProvider` 的 `componentSize` 统一设置。
</docs>

<template>
  <am-flex gap="small" align="center" wrap>
    <am-button type="primary" size="large">
      Large
    </am-button>
    <am-button type="primary">
      Middle
    </am-button>
    <am-button type="primary" size="small">
      Small
    </am-button>
  </am-flex>
</template>
