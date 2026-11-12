<docs lang="zh-CN">
通过 `gutter` 设置列之间的间隔，使用数组 `[水平间距, 垂直间距]` 可以同时设置换行后的行间距。
</docs>

<template>
  <div class="label">
    水平间距 :gutter="12"
  </div>
  <am-row :gutter="12">
    <am-col v-for="i in 3" :key="i" :span="8">
      <div class="cell">
        8
      </div>
    </am-col>
  </am-row>
  <div class="label">
    水平与垂直间距 :gutter="[12, 12]"
  </div>
  <am-row :gutter="[12, 12]">
    <am-col v-for="i in 6" :key="i" :span="8">
      <div class="cell">
        8
      </div>
    </am-col>
  </am-row>
</template>

<style scoped>
.label {
  margin: 12px 0 8px;
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size-sm);
}

.label:first-child {
  margin-top: 0;
}

.cell {
  padding: 12px 0;
  color: var(--am-color-text-light-solid);
  font-size: var(--am-font-size);
  text-align: center;
  background: var(--am-color-primary);
  border-radius: var(--am-border-radius-sm);
}
</style>
