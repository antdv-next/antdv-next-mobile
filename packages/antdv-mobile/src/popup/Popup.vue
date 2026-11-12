<script setup lang="ts">
import type { PopupEmits, PopupProps, PopupSlots } from './interface'
import { CloseOutlined } from '@antdv-next/icons'
import { computed, ref, watch } from 'vue'
import { Portal } from '../_base'
import { addUnit } from '../_util'
import { nextZIndex, useEventListener, useLockScroll } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import Mask from '../mask/Mask.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmPopup', inheritAttrs: false })

const props = withDefaults(defineProps<PopupProps>(), {
  open: false,
  placement: 'bottom',
  mask: true,
  maskClosable: true,
  closable: false,
  round: false,
  safeArea: true,
  lockScroll: true,
  destroyOnHidden: false,
  forceRender: false,
  keyboard: true,
  getContainer: undefined,
})
const emit = defineEmits<PopupEmits>()
defineSlots<PopupSlots>()

const commonLocale = useLocale('common')

const rootRef = ref<HTMLElement>()
const bodyRef = ref<HTMLElement>()
/** content has been mounted at least once */
const rendered = ref(props.open || props.forceRender)
/** root is displayed (stays true until the leave animation ends) */
const visible = ref(props.open)
const zIndex = ref<number | undefined>(props.open ? props.zIndex ?? nextZIndex() : props.zIndex)

watch(
  () => props.open,
  (open) => {
    if (open) {
      rendered.value = true
      visible.value = true
      zIndex.value = props.zIndex ?? nextZIndex()
    }
  },
)
watch(() => props.zIndex, (val) => {
  if (val !== undefined)
    zIndex.value = val
})

useLockScroll(rootRef, () => props.open && props.lockScroll)

const transitionName = computed(() => (props.placement === 'center' ? 'am-zoom' : `am-slide-${props.placement}`))

const bodyStyle = computed(() => [
  { width: addUnit(props.width), height: addUnit(props.height) },
  props.styles?.body,
])

function close(event?: Event) {
  emit('close', event)
  emit('update:open', false)
}

function onMaskClick(event: MouseEvent) {
  emit('maskClick', event)
  if (props.maskClosable)
    close(event)
}

function onAfterLeave() {
  visible.value = false
  if (props.destroyOnHidden)
    rendered.value = false
  emit('afterOpenChange', false)
}

useEventListener('keydown', (event: KeyboardEvent) => {
  if (props.open && props.keyboard && event.key === 'Escape')
    close(event)
})

defineExpose({
  /** the popup body element */
  nativeElement: bodyRef,
})
</script>

<template>
  <Portal v-slot="{ theme }" :get-container="getContainer">
    <div
      v-if="rendered"
      v-show="visible"
      ref="rootRef"
      v-bind="$attrs"
      class="am-popup-root"
      :class="[theme.class, rootClass, classes?.root]"
      :style="[theme.style, { zIndex }, styles?.root]"
      :dir="theme.dir"
    >
      <Mask
        v-if="mask"
        :open="open"
        :lock-scroll="false"
        root-class="am-popup-mask"
        :class="classes?.mask"
        :style="styles?.mask"
        @click="onMaskClick"
      />
      <Transition :name="transitionName" appear @after-enter="emit('afterOpenChange', true)" @after-leave="onAfterLeave">
        <div
          v-show="open"
          ref="bodyRef"
          class="am-popup"
          :class="[
            `am-popup-${placement}`,
            { 'am-popup-round': round, 'am-popup-safe-area': safeArea && placement === 'bottom' },
            classes?.body,
          ]"
          :style="bodyStyle"
          role="dialog"
          aria-modal="true"
        >
          <button
            v-if="closable"
            type="button"
            class="am-popup-close"
            :aria-label="commonLocale.close"
            @click="close"
          >
            <slot name="closeIcon">
              <RenderNode v-if="closeIcon" :node="closeIcon" />
              <CloseOutlined v-else />
            </slot>
          </button>
          <slot />
        </div>
      </Transition>
    </div>
  </Portal>
</template>
