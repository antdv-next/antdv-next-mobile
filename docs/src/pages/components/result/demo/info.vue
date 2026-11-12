<docs lang="zh-CN">
展示处理结果的中间状态，`status` 默认为 `info`。
</docs>

<docs lang="en-US">
Shows an intermediate state of the processing result; `status` defaults to `info`.
</docs>

<template>
  <am-result title="Under review" sub-title="Your documents were submitted. You will be notified of the result within 1-3 working days">
    <template #extra>
      <am-button type="primary" shape="round">
        Got it
      </am-button>
    </template>
  </am-result>
</template>
