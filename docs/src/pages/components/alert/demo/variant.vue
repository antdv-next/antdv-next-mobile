<docs lang="zh-CN">
`variant="outlined"` 去掉浅色背景，仅保留描边，适合放在有色背景的卡片上。
</docs>

<docs lang="en-US">
`variant="outlined"` removes the light background and keeps the border only, which suits cards with a colored background.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-alert variant="outlined" title="Success Text" type="success" show-icon />
    <am-alert variant="outlined" title="Info Text" type="info" show-icon />
    <am-alert
      variant="outlined"
      title="Warning Text"
      description="Further details about this warning."
      type="warning"
      show-icon
    />
  </am-flex>
</template>
