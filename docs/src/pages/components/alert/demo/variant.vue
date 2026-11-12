<docs lang="zh-CN">
`variant="outlined"` 去掉浅色背景，仅保留描边，适合放在有色背景的卡片上。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-alert variant="outlined" title="成功提示的文案" type="success" show-icon />
    <am-alert variant="outlined" title="消息提示的文案" type="info" show-icon />
    <am-alert
      variant="outlined"
      title="警告提示的文案"
      description="这里是关于警告内容的进一步描述。"
      type="warning"
      show-icon
    />
  </am-flex>
</template>
