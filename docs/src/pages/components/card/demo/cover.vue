<docs lang="zh-CN">
通过 `cover` 插槽放置封面，配合 `Card.Meta`（`<am-card-meta>`）展示头像、标题和描述。
</docs>

<template>
  <am-card>
    <template #cover>
      <img alt="cover" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
    </template>
    <am-card-meta title="欧洲街拍" description="www.instagram.com">
      <template #avatar>
        <am-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      </template>
    </am-card-meta>
  </am-card>
</template>
