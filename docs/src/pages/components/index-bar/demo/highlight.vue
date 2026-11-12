<docs lang="zh-CN">
通过 `--am-index-bar-highlight-color` 变量修改高亮颜色；`select` 在点击或拖动索引时触发，`change` 在滚动导致激活锚点变化时触发。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const letters = ['A', 'B', 'C', 'D', 'E', 'F']
const log = ref('滚动列表或点击右侧索引')

function handleSelect(index: string | number) {
  log.value = `select: ${index}`
}

function handleChange(index: string | number) {
  log.value = `change: ${index}`
}
</script>

<template>
  <div class="log">
    {{ log }}
  </div>
  <div class="scroller">
    <am-index-bar class="custom-index-bar" @select="handleSelect" @change="handleChange">
      <template v-for="letter in letters" :key="letter">
        <am-index-bar-anchor :index="letter" />
        <am-list :bordered="false">
          <am-list-item v-for="i in 4" :key="i" :title="`${letter} 列表项 ${i}`" />
        </am-list>
      </template>
    </am-index-bar>
  </div>
</template>

<style scoped>
.log {
  padding: 12px 16px;
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}

.scroller {
  height: 340px;
  overflow-y: auto;
}

.custom-index-bar {
  --am-index-bar-highlight-color: #fa541c;
  --am-index-bar-index-size: 18px;
  --am-index-bar-index-font-size: 11px;
}
</style>
