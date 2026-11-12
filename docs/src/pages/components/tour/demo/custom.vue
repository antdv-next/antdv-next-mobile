<docs lang="zh-CN">
通过 `indicatorsRender` 自定义指示器，通过 `actionsRender` 在默认按钮（`originNode`）旁增加操作，两者都支持同名插槽。`nextButtonProps` / `prevButtonProps` 可修改某一步的按钮文字，`closeIcon` 设为 `false` 隐藏关闭按钮。
</docs>

<docs lang="en-US">
Customize the indicators with `indicatorsRender` and add actions next to the default buttons (`originNode`) with `actionsRender`; both also exist as same-named slots. `nextButtonProps` / `prevButtonProps` change the button texts of a step, and `closeIcon` set to `false` hides the close button.
</docs>

<script setup lang="ts">
import type { TourStepItem } from '@antdv-next/mobile'
import { ref, shallowRef } from 'vue'

const ref1 = shallowRef()
const ref2 = shallowRef()
const ref3 = shallowRef()
const open = ref(false)

const steps: TourStepItem[] = [
  { title: 'Upload File', description: 'Put your files here.', target: ref1 },
  { title: 'Save', description: 'Save your changes.', target: ref2 },
  {
    title: 'Share',
    description: 'Send it to your friends.',
    target: ref3,
    prevButtonProps: { children: 'Back' },
    nextButtonProps: { children: 'Got it' },
  },
]

function indicatorsRender(current: number, total: number) {
  return `${current + 1} / ${total}`
}
</script>

<template>
  <am-button type="primary" @click="open = true">
    Begin Tour
  </am-button>
  <am-divider />
  <am-flex gap="small">
    <am-button ref="ref1">
      Upload
    </am-button>
    <am-button ref="ref2" type="primary">
      Save
    </am-button>
    <am-button ref="ref3">
      Share
    </am-button>
  </am-flex>
  <am-tour v-model:open="open" :steps="steps" :indicators-render="indicatorsRender" :close-icon="false">
    <template #actionsRender="{ originNode, current, total }">
      <am-button v-if="current !== total - 1" size="small" type="text" @click="open = false">
        Skip
      </am-button>
      <component :is="originNode" />
    </template>
  </am-tour>
</template>
