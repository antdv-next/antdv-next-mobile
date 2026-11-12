<script setup lang="ts">
import type { ToastEmits, ToastProps } from './interface'
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { resolveContainer } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useConfig, usePopupTheme } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmToast', inheritAttrs: false })

const props = withDefaults(defineProps<ToastProps>(), {
  open: false,
  content: undefined,
  icon: undefined,
  position: 'center',
  maskClickable: true,
})
const emit = defineEmits<ToastEmits>()

const config = useConfig()
const popupTheme = usePopupTheme()
const rootRef = ref<HTMLElement>()

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

const presetIcons = {
  success: CheckOutlined,
  fail: CloseOutlined,
  loading: LoadingOutlined,
}

const presetIcon = computed(() => (typeof props.icon === 'string' && props.icon in presetIcons
  ? props.icon as keyof typeof presetIcons
  : undefined))
const hasIcon = computed(() => isNode(props.icon))
const container = computed(() => props.getContainer?.() ?? config.getPopupContainer.value?.() ?? resolveContainer())

defineExpose({
  nativeElement: rootRef,
})
</script>

<template>
  <Teleport :to="container ?? 'body'" :disabled="!container">
    <div
      ref="rootRef"
      v-bind="$attrs"
      class="am-toast-root"
      :class="[popupTheme.class, rootClass, { 'am-toast-root-block': open && !maskClickable }]"
      :style="[popupTheme.style, { zIndex }, rootStyle]"
      :dir="popupTheme.dir"
    >
      <Transition name="am-toast-fade" appear @after-leave="emit('afterClose')">
        <div
          v-if="open"
          class="am-toast"
          :class="[`am-toast-${position}`, { 'am-toast-with-icon': hasIcon }]"
          role="status"
          aria-live="polite"
        >
          <div v-if="hasIcon" class="am-toast-icon">
            <component :is="presetIcons[presetIcon]" v-if="presetIcon" :class="{ 'am-spin-icon': presetIcon === 'loading' }" />
            <RenderNode v-else :node="icon" />
          </div>
          <div v-if="isNode(content)" class="am-toast-content">
            <RenderNode :node="content" />
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
