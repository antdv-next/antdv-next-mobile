<docs lang="zh-CN">
使用 `Badge.Ribbon`（`<am-badge-ribbon>`）在卡片的角上展示缎带。
</docs>

<docs lang="en-US">
Use `Badge.Ribbon` (`<am-badge-ribbon>`) to show a ribbon at the corner of a card.
</docs>

<template>
  <am-space vertical block size="middle" class="ribbons">
    <am-badge-ribbon text="Pick">
      <div class="card">
        At the end by default, in the primary color
      </div>
    </am-badge-ribbon>
    <am-badge-ribbon text="Hot" color="red" placement="start">
      <div class="card">
        At the start, with the preset color red
      </div>
    </am-badge-ribbon>
    <am-badge-ribbon text="Sale" color="#722ed1">
      <div class="card">
        Custom color
      </div>
    </am-badge-ribbon>
  </am-space>
</template>

<style scoped>
.ribbons {
  padding-inline: 8px;
}

.card {
  padding: 40px 16px 16px;
  color: var(--am-color-text);
  font-size: var(--am-font-size);
  background: var(--am-color-bg-container);
  border: 1px solid var(--am-color-border-secondary);
  border-radius: var(--am-border-radius);
}
</style>
