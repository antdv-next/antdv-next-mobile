<docs lang="zh-CN">
可以在右侧自定义操作项。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-alert title="发现新版本" type="info" show-icon>
      <template #action>
        <am-button size="small" type="link">
          立即更新
        </am-button>
      </template>
    </am-alert>
    <am-alert
      title="网络连接失败"
      description="请检查你的网络设置，或稍后再试。"
      type="error"
      show-icon
      closable
    >
      <template #action>
        <am-button size="small" danger>
          重试
        </am-button>
      </template>
    </am-alert>
  </am-flex>
</template>
