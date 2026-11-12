<docs lang="zh-CN">
失败的结果。复杂的错误说明放在默认插槽中，会显示在带底色的内容区内。
</docs>

<script setup lang="ts">
import { CloseCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-result status="error" title="提交失败" sub-title="请核对并修改以下信息后，再重新提交">
    <div class="reason-title">
      您提交的内容有如下错误：
    </div>
    <div class="reason">
      <CloseCircleOutlined class="reason-icon" /> 账户已被冻结
    </div>
    <div class="reason">
      <CloseCircleOutlined class="reason-icon" /> 银行卡信息有误
    </div>
    <template #extra>
      <am-button type="primary" block>
        重新提交
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
