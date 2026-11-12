<docs lang="zh-CN">
通过组件实例的 `scrollTo(index)` 方法滚动到指定锚点；`stickyOffsetTop` 为吸顶的锚点预留顶部空间（示例中为吸顶的操作栏高度）。
</docs>

<script setup lang="ts">
import type { IndexBarExpose } from 'antdv-next-mobile'
import { ref } from 'vue'

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const indexBarRef = ref<IndexBarExpose>()
</script>

<template>
  <div class="scroller">
    <div class="toolbar">
      <am-button size="small" @click="indexBarRef?.scrollTo('A')">
        回到 A
      </am-button>
      <am-button size="small" @click="indexBarRef?.scrollTo('D')">
        跳到 D
      </am-button>
      <am-button size="small" @click="indexBarRef?.scrollTo('G')">
        跳到 G
      </am-button>
    </div>
    <am-index-bar ref="indexBarRef" :sticky-offset-top="48">
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
.scroller {
  height: 400px;
  overflow-y: auto;
}

.toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  gap: 8px;
  align-items: center;
  box-sizing: border-box;
  height: 48px;
  padding: 0 16px;
  background: var(--am-color-bg-container);
}
</style>
