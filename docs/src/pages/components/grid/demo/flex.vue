<docs lang="zh-CN">
`Col` 的 `flex` 属性可以实现固定宽度加自适应的布局：数字表示比例，`'80px'` 表示固定宽度，`'auto'` 填充剩余空间。
</docs>

<template>
  <am-row>
    <am-col :flex="2">
      <div class="cell">
        2 / 5
      </div>
    </am-col>
    <am-col :flex="3">
      <div class="cell alt">
        3 / 5
      </div>
    </am-col>
  </am-row>
  <am-row :wrap="false">
    <am-col flex="80px">
      <div class="cell">
        80px
      </div>
    </am-col>
    <am-col flex="auto">
      <div class="cell alt">
        auto
      </div>
    </am-col>
  </am-row>
  <am-row :wrap="false" :gutter="8">
    <am-col flex="none">
      <div class="cell pad">
        none
      </div>
    </am-col>
    <am-col flex="auto">
      <div class="cell alt">
        auto
      </div>
    </am-col>
    <am-col flex="60px">
      <div class="cell">
        60px
      </div>
    </am-col>
  </am-row>
</template>

<style scoped>
.am-row + .am-row {
  margin-top: 8px;
}

.cell {
  padding: 12px 0;
  color: var(--am-color-text-light-solid);
  font-size: var(--am-font-size-sm);
  text-align: center;
  background: var(--am-color-primary);
}

.cell.alt {
  background: var(--am-color-primary-hover);
}

.cell.pad {
  padding-inline: 12px;
}
</style>
