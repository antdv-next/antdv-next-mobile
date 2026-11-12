<docs lang="zh-CN">
通过 `placement` 设置引导卡片相对目标的位置，共十二个方向加 `center`。空间不足时自动翻转到对侧；手机上 `left` / `right` 放不下时会回退到上方或下方，卡片始终留在屏幕内，箭头保持指向目标。不设置 `target` 时卡片居中显示。
</docs>

<docs lang="en-US">
Use `placement` to set where the panel sits relative to the target: twelve directions plus `center`. It flips to the opposite side when there is not enough room; on a phone `left` / `right` fall back to above or below when the panel does not fit, the panel always stays within the screen and the arrow keeps pointing at the target. Without a `target` the panel is centered.
</docs>

<script setup lang="ts">
import type { TourPlacement, TourStepItem } from 'antdv-next-mobile'
import { computed, ref, shallowRef } from 'vue'

const placements: TourPlacement[] = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'right', 'center']

const target = shallowRef<HTMLElement>()
const open = ref(false)
const placement = ref<TourPlacement>('top')

const steps = computed<TourStepItem[]>(() => [
  { title: placement.value, description: 'The panel follows the placement.', target, placement: placement.value },
  { title: 'No target', description: 'Without a target the panel is centered.' },
])

function show(value: TourPlacement) {
  placement.value = value
  open.value = true
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button v-for="item in placements" :key="item" size="small" @click="show(item)">
      {{ item }}
    </am-button>
  </am-flex>
  <div class="stage">
    <div ref="target" class="target">
      Target
    </div>
  </div>
  <am-tour v-model:open="open" :steps="steps" />
</template>

<style scoped>
.stage {
  display: flex;
  justify-content: center;
  padding: 24px 0 8px;
}

.target {
  padding: 8px 20px;
  color: var(--am-color-primary);
  background: var(--am-color-primary-bg);
  border-radius: var(--am-border-radius);
}
</style>
