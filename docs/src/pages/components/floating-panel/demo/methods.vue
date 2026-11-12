<docs lang="zh-CN">
通过 ref 调用 `setHeight` 设置高度，`immediate` 跳过动画。`heightChange` 事件的 `animating` 可以区分拖动过程与吸附动画。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const panelRef = ref()
const anchors = [80, 320]
const info = ref('拖动或点击按钮')

function onHeightChange(height: number, { animating }: { animating: boolean }) {
  info.value = `${Math.round(height)}px，${animating ? '吸附动画' : '拖动中'}`
}
</script>

<template>
  <div class="stage">
    <p class="stage-tip">
      {{ info }}
    </p>
    <am-flex gap="small" style="padding: 0 16px">
      <am-button size="small" @click="panelRef?.setHeight(anchors[1])">
        展开
      </am-button>
      <am-button size="small" @click="panelRef?.setHeight(anchors[0])">
        收起
      </am-button>
      <am-button size="small" @click="panelRef?.setHeight(anchors[1], { immediate: true })">
        无动画展开
      </am-button>
    </am-flex>
    <am-floating-panel ref="panelRef" :anchors="anchors" :fixed="false" @height-change="onHeightChange">
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
