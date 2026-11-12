<docs lang="zh-CN">
`contentDraggable` 设为 `false` 后只能通过头部拖动面板，内容区域始终用于滚动。`header` 插槽可以自定义头部。
</docs>

<template>
  <div class="stage">
    <p class="stage-tip">
      拖动面板的标题栏
    </p>
    <am-floating-panel :anchors="[96, 300]" :content-draggable="false" :fixed="false">
      <template #header>
        <div class="header">
          <span class="header-bar" />
          <span>附近的 20 个地点</span>
        </div>
      </template>
      <ul class="list">
        <li v-for="i in 20" :key="i">
          地点 {{ i }}
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

.header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 8px 0 12px;
  font-weight: 600;
  font-size: 15px;
}

.header-bar {
  width: 32px;
  height: 4px;
  background: var(--am-color-fill);
  border-radius: 4px;
}
</style>
