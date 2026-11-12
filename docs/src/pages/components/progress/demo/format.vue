<docs lang="zh-CN">
`format` 属性或默认插槽指定进度信息的内容。
</docs>

<template>
  <am-flex vertical gap="middle">
    <am-progress :percent="60" :format="(percent?: number) => `${percent} / 100`" />
    <am-flex gap="middle" align="center">
      <am-progress type="circle" :percent="75" :size="96" :format="(percent?: number) => `${percent} 天`" />
      <am-progress type="circle" :percent="100" :size="96">
        完成
      </am-progress>
      <am-progress type="dashboard" :percent="86" :size="96">
        <template #default="{ percent }">
          <div class="score">
            <b>{{ percent }}</b>
            <span>健康分</span>
          </div>
        </template>
      </am-progress>
    </am-flex>
  </am-flex>
</template>

<style scoped>
.score {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.score span {
  color: var(--am-color-text-secondary);
  font-size: 12px;
}
</style>
