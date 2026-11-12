<docs lang="zh-CN">
失败的结果。复杂的错误说明放在默认插槽中，会显示在带底色的内容区内。
</docs>

<docs lang="en-US">
A failed result. Put complex error details in the default slot; they are shown in a content area with a background.
</docs>

<script setup lang="ts">
import { CloseCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-result status="error" title="Submission failed" sub-title="Please check and modify the following information before resubmitting">
    <div class="reason-title">
      The content you submitted has the following errors:
    </div>
    <div class="reason">
      <CloseCircleOutlined class="reason-icon" /> Your account has been frozen
    </div>
    <div class="reason">
      <CloseCircleOutlined class="reason-icon" /> Your bank card information is incorrect
    </div>
    <template #extra>
      <am-button type="primary" block>
        Resubmit
      </am-button>
    </template>
  </am-result>
</template>

<style scoped>
.reason-title {
  margin-bottom: 8px;
  color: var(--am-color-text);
  font-weight: 600;
}

.reason {
  color: var(--am-color-text-secondary);
  line-height: 1.8;
}

.reason-icon {
  color: var(--am-color-error);
}
</style>
