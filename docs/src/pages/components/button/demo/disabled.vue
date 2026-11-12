<docs lang="zh-CN">
添加 `disabled` 属性即可让按钮处于不可用状态，同时按钮样式也会改变。
</docs>

<template>
  <am-flex gap="small" wrap>
    <am-button type="primary" disabled>
      Primary
    </am-button>
    <am-button disabled>
      Default
    </am-button>
    <am-button type="dashed" disabled>
      Dashed
    </am-button>
    <am-button type="text" disabled>
      Text
    </am-button>
    <am-button type="link" disabled>
      Link
    </am-button>
  </am-flex>
</template>
