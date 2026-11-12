<docs lang="zh-CN">
使用 `Badge.Ribbon`（`<am-badge-ribbon>`）在卡片的角上展示缎带。
</docs>

<template>
  <am-space vertical block size="middle" class="ribbons">
    <am-badge-ribbon text="推荐">
      <div class="card">
        默认位于末端，使用主题色
      </div>
    </am-badge-ribbon>
    <am-badge-ribbon text="热卖" color="red" placement="start">
      <div class="card">
        位于起始端，使用预设色 red
      </div>
    </am-badge-ribbon>
    <am-badge-ribbon text="限时" color="#722ed1">
      <div class="card">
        自定义颜色
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
