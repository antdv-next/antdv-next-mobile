<script setup lang="ts">
import type { PopoverAction, PopoverEmits, PopoverExpose, PopoverPlacement, PopoverProps, PopoverSlots } from './interface'
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { Portal } from '../_base'
import { isRenderable } from '../_util'
import { nextZIndex, useClickAway, useControlled, useEventListener } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { computePosition, parsePlacement } from './position'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmPopover', inheritAttrs: false })

const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  content: undefined,
  placement: 'top',
  trigger: 'click',
  arrow: true,
  mode: 'light',
  autoAdjustOverflow: true,
  closeOnClickAway: true,
  destroyOnHidden: false,
  closeOnAction: true,
})
const emit = defineEmits<PopoverEmits>()
const slots = defineSlots<PopoverSlots>()

const triggerRef = ref<HTMLElement>()
const popupRef = ref<HTMLElement>()
const innerRef = ref<HTMLElement>()

const [open, setOpen] = useControlled(props, 'open', {
  defaultValue: () => props.defaultOpen,
  onChange: (value, prev) => {
    if (value === prev)
      return
    emit('update:open', value)
    emit('openChange', value)
  },
})

const hasTitle = computed(() => !!slots.title || isRenderable(props.title))
const hasContent = computed(() => !!slots.content || isRenderable(props.content))
const hasActions = computed(() => Array.isArray(props.actions) && props.actions.length > 0)

/** the popup is only teleported on the client, once it has been opened */
const mounted = ref(false)
const rendered = ref(false)
/** node returned by `getPopupContainer(trigger)`; `undefined` lets Portal use the ConfigProvider default */
const container = shallowRef<HTMLElement>()
const zIndex = ref<number | undefined>(props.zIndex)
const position = ref<{ left: number, top: number, placement: PopoverPlacement, arrowOffset: number }>({
  left: 0,
  top: 0,
  placement: props.placement,
  arrowOffset: 0,
})

const side = computed(() => parsePlacement(position.value.placement).side)

/** viewport position of the origin that `left / top` of the popup are measured from */
function getOrigin(el: HTMLElement) {
  const parent = el.offsetParent as HTMLElement | null
  const isStaticBody = parent === document.body && window.getComputedStyle(parent).position === 'static'
  if (!parent || isStaticBody)
    return { left: -window.scrollX, top: -window.scrollY }
  const rect = parent.getBoundingClientRect()
  return {
    left: rect.left + parent.clientLeft - parent.scrollLeft,
    top: rect.top + parent.clientTop - parent.scrollTop,
  }
}

function updatePosition() {
  const trigger = triggerRef.value
  const popup = popupRef.value
  const inner = innerRef.value
  if (!trigger || !popup || !inner || !open.value)
    return
  const rect = trigger.getBoundingClientRect()
  const next = computePosition(
    rect,
    { width: inner.offsetWidth, height: inner.offsetHeight },
    {
      placement: props.placement,
      gap: props.arrow ? 10 : 6,
      autoAdjust: props.autoAdjustOverflow,
      viewport: {
        width: document.documentElement.clientWidth || window.innerWidth,
        height: document.documentElement.clientHeight || window.innerHeight,
      },
    },
  )
  const origin = getOrigin(popup)
  position.value = { ...next, left: next.left - origin.left, top: next.top - origin.top }
}

async function prepare() {
  const trigger = triggerRef.value
  container.value = (trigger && props.getPopupContainer?.(trigger)) || undefined
  zIndex.value = props.zIndex ?? nextZIndex()
  rendered.value = true
  await nextTick()
  updatePosition()
}

onMounted(() => {
  mounted.value = true
  if (open.value)
    prepare()
})

watch(open, (value) => {
  if (value && mounted.value)
    prepare()
})
watch(() => [props.placement, props.arrow, props.actions, props.title, props.content], () => {
  if (open.value)
    nextTick(updatePosition)
})
watch(() => props.zIndex, (value) => {
  if (value !== undefined)
    zIndex.value = value
})

function show() {
  setOpen(true)
}

function hide() {
  setOpen(false)
}

function onTriggerClick() {
  if (props.trigger === 'click')
    setOpen(!open.value)
}

const clickAwayEnabled = () => !!open.value && props.closeOnClickAway
useClickAway([triggerRef, popupRef], hide, { eventName: 'touchstart', enabled: clickAwayEnabled })
useClickAway([triggerRef, popupRef], hide, { eventName: 'mousedown', enabled: clickAwayEnabled })
useEventListener('resize', updatePosition, { passive: true })
useEventListener('scroll', updatePosition, { passive: true, capture: true })

function onAction(action: PopoverAction, index: number) {
  if (action.disabled)
    return
  action.onClick?.(action, index)
  emit('action', action, index)
  if (props.closeOnAction)
    hide()
}

function onAfterLeave() {
  if (props.destroyOnHidden)
    rendered.value = false
}

const popupStyle = computed(() => [
  {
    left: `${position.value.left}px`,
    top: `${position.value.top}px`,
    zIndex: zIndex.value,
    '--am-popover-arrow-offset': `${position.value.arrowOffset}px`,
  },
  props.color ? { '--am-popover-bg': props.color } : undefined,
  props.styles?.root,
])

defineExpose<PopoverExpose>({ show, hide, updatePosition })
</script>

<template>
  <span
    ref="triggerRef"
    v-bind="$attrs"
    class="am-popover-trigger"
    :class="{ 'am-popover-trigger-open': open }"
    @click="onTriggerClick"
  >
    <slot />
  </span>
  <Portal v-if="mounted && rendered" v-slot="{ theme }" :get-container="container">
    <div
      ref="popupRef"
      class="am-popover"
      :class="[
        theme.class,
        `am-popover-${mode}`,
        `am-popover-placement-${position.placement}`,
        `am-popover-side-${side}`,
        { 'am-popover-menu-mode': hasActions },
        rootClass,
        classes?.root,
      ]"
      :style="[theme.style, popupStyle]"
      :dir="theme.dir"
    >
      <Transition name="am-popover-zoom" appear @after-leave="onAfterLeave">
        <div
          v-show="open"
          ref="innerRef"
          class="am-popover-inner"
          :class="classes?.container"
          :style="styles?.container"
          role="tooltip"
        >
          <span v-if="arrow" class="am-popover-arrow" :class="classes?.arrow" :style="styles?.arrow" />
          <div v-if="hasActions" class="am-popover-menu" role="menu">
            <button
              v-for="(action, index) in actions"
              :key="action.key"
              type="button"
              role="menuitem"
              class="am-popover-menu-item"
              :class="{
                'am-popover-menu-item-disabled': action.disabled,
                'am-popover-menu-item-danger': action.danger,
              }"
              :disabled="action.disabled || undefined"
              @click="onAction(action, index)"
            >
              <span v-if="isRenderable(action.icon)" class="am-popover-menu-item-icon">
                <RenderNode :node="action.icon" />
              </span>
              <span class="am-popover-menu-item-text"><RenderNode :node="action.text" /></span>
            </button>
          </div>
          <template v-else>
            <div v-if="hasTitle" class="am-popover-title" :class="classes?.title" :style="styles?.title">
              <slot name="title">
                <RenderNode :node="title" />
              </slot>
            </div>
            <div v-if="hasContent" class="am-popover-content" :class="classes?.content" :style="styles?.content">
              <slot name="content">
                <RenderNode :node="content" />
              </slot>
            </div>
          </template>
        </div>
      </Transition>
    </div>
  </Portal>
</template>
