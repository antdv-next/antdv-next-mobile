<script setup lang="ts">
import type { ToastEmits, ToastProps } from './interface'
import { CheckOutlined, CloseOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { Portal, Spinner } from '../_base'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
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

const rootRef = ref<HTMLElement>()

const presetIcons = {
  success: CheckOutlined,
  fail: CloseOutlined,
  loading: Spinner,
}

const presetIcon = computed(() => (typeof props.icon === 'string' && props.icon in presetIcons
  ? props.icon as keyof typeof presetIcons
  : undefined))
const hasIcon = computed(() => isRenderable(props.icon))

defineExpose({
  nativeElement: rootRef,
})
</script>

<template>
  <Portal v-slot="{ theme }" :get-container="getContainer">
    <div
      ref="rootRef"
      v-bind="$attrs"
      class="am-toast-root"
      :class="[theme.class, rootClass, { 'am-toast-root-block': open && !maskClickable }]"
      :style="[theme.style, { zIndex }, rootStyle]"
      :dir="theme.dir"
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
            <component :is="presetIcons[presetIcon]" v-if="presetIcon" />
            <RenderNode v-else :node="icon" />
          </div>
          <div v-if="isRenderable(content)" class="am-toast-content">
            <RenderNode :node="content" />
          </div>
        </div>
      </Transition>
    </div>
  </Portal>
</template>
