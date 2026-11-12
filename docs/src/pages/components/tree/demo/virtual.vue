<docs lang="zh-CN">
设置 `height` 后树在自己的容器内滚动，并默认开启虚拟滚动（`virtual`）：下面共有 10,000 多个节点，只渲染可视区域附近的十几行，勾选联动依然即时。`scrollTo({ key, align })` 滚动到指定节点（节点需要已展开可见）。
</docs>

<docs lang="en-US">
With `height` the tree scrolls inside its own container and virtual scrolling (`virtual`) is on by default: there are more than 10,000 nodes below and only a dozen or so rows near the visible area are rendered, while the check conduction stays instant. `scrollTo({ key, align })` scrolls to a node (it has to be visible, i.e. its parents expanded).
</docs>

<script setup lang="ts">
import type { TreeDataNode } from '@antdv-next/mobile'
import { nextTick, ref } from 'vue'

const treeData: TreeDataNode[] = Array.from({ length: 100 }, (_, i) => ({
  key: `g${i}`,
  title: `Group ${String(i + 1).padStart(3, '0')}`,
  children: Array.from({ length: 100 }, (_, j) => ({
    key: `g${i}-${j}`,
    title: `Member ${String(i + 1).padStart(3, '0')}-${String(j + 1).padStart(3, '0')}`,
  })),
}))

const treeRef = ref()
const expandedKeys = ref<(string | number)[]>(['g0', 'g49'])
const checkedKeys = ref<(string | number)[]>(['g0-1'])

async function scrollToGroup(key: string) {
  if (!expandedKeys.value.includes(key))
    expandedKeys.value = [...expandedKeys.value, key]
  // wait until the tree has rendered with the new expanded keys
  await nextTick()
  treeRef.value?.scrollTo({ key, align: 'top' })
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-flex gap="small" wrap>
      <am-button size="small" @click="scrollToGroup('g49')">
        Go to group 050
      </am-button>
      <am-button size="small" @click="scrollToGroup('g99')">
        Go to group 100
      </am-button>
      <am-button size="small" @click="treeRef?.scrollTo(0)">
        Top
      </am-button>
    </am-flex>
    <am-tree
      ref="treeRef"
      v-model:expanded-keys="expandedKeys"
      v-model:checked-keys="checkedKeys"
      :tree-data="treeData"
      :height="320"
      :selectable="false"
      checkable
    />
    <div class="demo-result">
      Checked: {{ checkedKeys.length }} of 10,100 nodes
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
