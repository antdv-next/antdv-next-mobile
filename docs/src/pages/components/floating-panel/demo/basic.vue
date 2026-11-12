<docs lang="zh-CN">
默认有两个锚点：`100px` 与可用高度的 60%。上下拖动面板，松手后吸附到最近的锚点；完全展开后内容区域可以滚动。
</docs>

<template>
  <div class="stage">
    <p class="stage-tip">
      背后的内容依然可以操作
    </p>
    <am-floating-panel :fixed="false">
      <ul class="list">
        <li v-for="i in 20" :key="i">
          列表项 {{ i }}
        </li>
      </ul>
    </am-floating-panel>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  height: 420px;
  overflow: hidden;
  background: linear-gradient(160deg, #bae0ff, #d9f7be);
  border-radius: 8px;
}

.stage-tip {
  margin: 0;
  padding: 16px;
  color: rgb(0 0 0 / 65%);
  font-size: 14px;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list li {
  padding: 12px 16px;
  border-bottom: 1px solid var(--am-color-split);
}
</style>
