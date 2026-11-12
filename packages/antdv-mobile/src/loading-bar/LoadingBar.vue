<script setup lang="ts">
import type { LoadingBarProps } from './interface'
import { computed, ref } from 'vue'
import { Portal } from '../_base'
import { addUnit } from '../_util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmLoadingBar', inheritAttrs: false })

const props = withDefaults(defineProps<LoadingBarProps>(), {
  open: false,
  percent: 0,
  status: 'loading',
  animated: true,
  leaving: false,
})

const rootRef = ref<HTMLElement>()

const rootStyle = computed(() => ({
  'zIndex': props.zIndex,
  '--am-loading-bar-color': props.color,
  '--am-loading-bar-error-color': props.errorColor,
  '--am-loading-bar-height': addUnit(props.height),
  '--am-loading-bar-top': addUnit(props.top),
}))

defineExpose({
  nativeElement: rootRef,
})
</script>

<template>
  <Portal v-slot="{ theme }" :get-container="getContainer">
    <div
      ref="rootRef"
      v-bind="$attrs"
      class="am-loading-bar"
      :class="[
        theme.class,
        `am-loading-bar-${status}`,
        {
          'am-loading-bar-open': open,
          'am-loading-bar-animated': animated,
          'am-loading-bar-leaving': leaving,
        },
      ]"
      :style="[theme.style, rootStyle]"
      :dir="theme.dir"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(percent)"
      :aria-hidden="!open"
    >
      <div class="am-loading-bar-inner" :style="{ width: `${percent}%` }" />
    </div>
  </Portal>
</template>
