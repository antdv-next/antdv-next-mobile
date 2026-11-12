<docs lang="zh-CN">
通过 `disabled` 禁用多选框，禁用后不响应点击。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-checkbox disabled>
      未选中禁用
    </am-checkbox>
    <am-checkbox default-checked disabled>
      选中禁用
    </am-checkbox>
    <am-checkbox indeterminate disabled>
      半选禁用
    </am-checkbox>
  </am-flex>
</template>
