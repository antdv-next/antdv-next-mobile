<docs lang="zh-CN">
包含标题、右上角操作和内容的基础卡片，`size="small"` 得到更紧凑的卡片。
</docs>

<template>
  <am-space vertical block size="middle">
    <am-card title="默认卡片">
      <template #extra>
        <a href="#">更多</a>
      </template>
      <p>卡片内容</p>
      <p>卡片内容</p>
    </am-card>
    <am-card title="小尺寸卡片" extra="2 条" size="small">
      <p>卡片内容</p>
      <p>卡片内容</p>
    </am-card>
    <am-card>
      只有内容的卡片
    </am-card>
  </am-space>
</template>

<style scoped>
p {
  margin: 0;
}

p + p {
  margin-top: 4px;
}

a {
  color: var(--am-color-link);
  text-decoration: none;
}
</style>
