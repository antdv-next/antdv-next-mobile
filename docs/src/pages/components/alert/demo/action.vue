<docs lang="zh-CN">
可以在右侧自定义操作项。
</docs>

<docs lang="en-US">
Custom actions can be placed on the right side.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-alert title="New version available" type="info" show-icon>
      <template #action>
        <am-button size="small" type="link">
          Update
        </am-button>
      </template>
    </am-alert>
    <am-alert
      title="Network error"
      description="Please check your network settings or try again later."
      type="error"
      show-icon
      closable
    >
      <template #action>
        <am-button size="small" danger>
          Retry
        </am-button>
      </template>
    </am-alert>
  </am-flex>
</template>
