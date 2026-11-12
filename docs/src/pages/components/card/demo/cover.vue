<docs lang="zh-CN">
通过 `cover` 插槽放置封面，配合 `Card.Meta`（`<am-card-meta>`）展示头像、标题和描述。
</docs>

<docs lang="en-US">
Place a cover through the `cover` slot, and use `Card.Meta` (`<am-card-meta>`) to show an avatar, a title and a description.
</docs>

<template>
  <am-card>
    <template #cover>
      <img alt="cover" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
    </template>
    <am-card-meta title="Europe Street beat" description="www.instagram.com">
      <template #avatar>
        <am-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      </template>
    </am-card-meta>
  </am-card>
</template>
