<script setup lang="ts">
import type { AlertEmits, AlertProps, AlertSlots } from './interface'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@antdv-next/icons'
import { computed, ref } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmAlert', inheritAttrs: false })

const props = withDefaults(defineProps<AlertProps>(), {
  variant: 'filled',
  showIcon: undefined,
  closable: undefined,
  role: 'alert',
})
const emit = defineEmits<AlertEmits>()
const slots = defineSlots<AlertSlots>()

const iconMap = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
}

const commonLocale = useLocale('common')
const closed = ref(false)

function isRenderable(node: unknown) {
  return node !== undefined && node !== null && node !== false && node !== ''
}

const mergedType = computed(() => props.type ?? (props.banner ? 'warning' : 'info'))
const mergedShowIcon = computed(() => props.showIcon ?? !!props.banner)
const mergedTitle = computed(() => (isRenderable(props.title) ? props.title : props.message))
const hasTitle = computed(() => !!slots.title || !!slots.message || !!slots.default || isRenderable(mergedTitle.value))
const hasDescription = computed(() => !!slots.description || isRenderable(props.description))
const hasAction = computed(() => !!slots.action || isRenderable(props.action))

const closableConfig = computed(() => (typeof props.closable === 'object' && props.closable ? props.closable : undefined))
const mergedCloseIcon = computed(() => (isRenderable(props.closeIcon) ? props.closeIcon : closableConfig.value?.closeIcon))
const mergedClosable = computed(() => {
  if (props.closable === false)
    return false
  return !!props.closable || !!slots.closeIcon || isRenderable(mergedCloseIcon.value)
})

const classNames = computed(() => [
  'am-alert',
  `am-alert-${mergedType.value}`,
  `am-alert-${props.variant}`,
  {
    'am-alert-with-description': hasDescription.value,
    'am-alert-no-icon': !mergedShowIcon.value,
    'am-alert-banner': props.banner,
  },
  props.rootClass,
  props.classes?.root,
])

function handleClose(event: MouseEvent) {
  if (closableConfig.value?.disabled)
    return
  closed.value = true
  emit('close', event)
}

// ---------- collapse motion ----------
function onBeforeLeave(el: Element) {
  const node = el as HTMLElement
  node.style.height = `${node.offsetHeight}px`
}

function onLeave(el: Element) {
  const node = el as HTMLElement
  // force reflow so the height transition starts from the measured value
  void node.offsetHeight
  node.style.height = '0px'
}
</script>

<template>
  <Transition
    name="am-alert-motion"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="emit('afterClose')"
  >
    <div
      v-if="!closed"
      v-bind="$attrs"
      :class="classNames"
      :style="styles?.root"
      :role="role"
      :data-show="!closed"
    >
      <span v-if="mergedShowIcon" class="am-alert-icon" :class="classes?.icon" :style="styles?.icon">
        <slot name="icon">
          <RenderNode v-if="isRenderable(icon)" :node="icon" />
          <component :is="iconMap[mergedType]" v-else />
        </slot>
      </span>
      <div class="am-alert-section" :class="classes?.section" :style="styles?.section">
        <div v-if="hasTitle" class="am-alert-title" :class="classes?.title" :style="styles?.title">
          <slot name="title">
            <slot name="message">
              <slot>
                <RenderNode :node="mergedTitle" />
              </slot>
            </slot>
          </slot>
        </div>
        <div v-if="hasDescription" class="am-alert-description" :class="classes?.description" :style="styles?.description">
          <slot name="description">
            <RenderNode :node="description" />
          </slot>
        </div>
      </div>
      <div v-if="hasAction" class="am-alert-actions" :class="classes?.actions" :style="styles?.actions">
        <slot name="action">
          <RenderNode :node="action" />
        </slot>
      </div>
      <button
        v-if="mergedClosable"
        type="button"
        class="am-alert-close"
        :class="classes?.close"
        :style="styles?.close"
        :disabled="closableConfig?.disabled || undefined"
        :aria-label="closableConfig?.['aria-label'] ?? commonLocale.close"
        @click="handleClose"
      >
        <slot name="closeIcon">
          <RenderNode v-if="isRenderable(mergedCloseIcon)" :node="mergedCloseIcon" />
          <CloseOutlined v-else />
        </slot>
      </button>
    </div>
  </Transition>
</template>
