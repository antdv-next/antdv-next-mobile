<docs lang="zh-CN">
通过 `disabled` 禁用多选框，禁用后不响应点击。
</docs>

<docs lang="en-US">
Disable the checkbox with `disabled`. A disabled checkbox does not respond to clicks.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-checkbox disabled>
      Unchecked disabled
    </am-checkbox>
    <am-checkbox default-checked disabled>
      Checked disabled
    </am-checkbox>
    <am-checkbox indeterminate disabled>
      Indeterminate disabled
    </am-checkbox>
  </am-flex>
</template>
