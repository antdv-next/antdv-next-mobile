<docs lang="zh-CN">
`type="primary"` 使用主色背景，适合更醒目的提示。可以对整个引导设置，也可以只对某一步设置 `type`。`gap` 控制高亮区域与目标的间距和圆角，`arrow` 设为 `false` 隐藏箭头。
</docs>

<docs lang="en-US">
`type="primary"` uses the primary color as background for a more prominent hint. Set it for the whole tour or through `type` of a single step. `gap` controls the space and the corner radius of the highlighted area, and `arrow` set to `false` hides the arrow.
</docs>

<script setup lang="ts">
import type { TourStepItem } from '@antdv-next/mobile'
import { ref, shallowRef } from 'vue'

const ref1 = shallowRef()
const ref2 = shallowRef()
const open = ref(false)

const steps: TourStepItem[] = [
  { title: 'New feature', description: 'Scan a code to pay in seconds.', target: ref1 },
  { title: 'Default style', description: 'This step uses the default type, without arrow.', target: ref2, type: 'default', arrow: false },
]
</script>

<template>
  <am-button type="primary" @click="open = true">
    Begin Tour
  </am-button>
  <am-divider />
  <am-flex justify="space-between">
    <am-button ref="ref1" shape="round">
      Scan
    </am-button>
    <am-button ref="ref2" shape="round">
      Wallet
    </am-button>
  </am-flex>
  <am-tour v-model:open="open" :steps="steps" type="primary" :gap="{ offset: 8, radius: 24 }" />
</template>
