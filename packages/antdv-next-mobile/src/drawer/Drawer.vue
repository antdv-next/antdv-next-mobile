<script setup lang="ts">
import type { DrawerClosableConfig, DrawerEmits, DrawerProps, DrawerSlots } from './interface'
import { CloseOutlined, LoadingOutlined } from '@antdv-next/icons'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { addUnit, cls, preventDefault } from '../_util'
import { useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import Popup from '../popup/Popup.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmDrawer', inheritAttrs: false })

const props = withDefaults(defineProps<DrawerProps>(), {
  open: false,
  title: undefined,
  extra: undefined,
  footer: undefined,
  closeIcon: undefined,
  placement: 'bottom',
  closable: true,
  mask: true,
  maskClosable: true,
  keyboard: true,
  size: 'default',
  destroyOnHidden: false,
  forceRender: false,
  getContainer: undefined,
  loading: false,
  round: true,
  safeArea: true,
  lockScroll: true,
  swipeToClose: false,
})
const emit = defineEmits<DrawerEmits>()
const slots = defineSlots<DrawerSlots>()

const commonLocale = useLocale('common')
const popupRef = ref<InstanceType<typeof Popup>>()

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')

const closableConfig = computed<DrawerClosableConfig | null>(() => {
  if (!props.closable || props.closeIcon === null || props.closeIcon === false)
    return null
  return typeof props.closable === 'object' ? props.closable : {}
})
const mergedCloseIcon = computed(() => closableConfig.value?.closeIcon ?? props.closeIcon)
const closeAtStart = computed(() => closableConfig.value?.placement === 'start')

const hasTitle = computed(() => !!slots.title || isNode(props.title))
const hasExtra = computed(() => !!slots.extra || isNode(props.extra))
const hasFooter = computed(() => !!slots.footer || isNode(props.footer))
const hasHeader = computed(() => hasTitle.value || hasExtra.value || !!closableConfig.value)
const showHandle = computed(() => props.swipeToClose && props.placement === 'bottom')

/** `[width, height]` handed to Popup; `undefined` keeps the css default */
const sizeProps = computed(() => {
  const custom = isVertical.value ? props.height : props.width
  let value: string | undefined
  if (custom !== undefined && custom !== null && custom !== '')
    value = addUnit(custom)
  else if (props.size !== 'default' && props.size !== 'large')
    value = addUnit(props.size)
  return {
    sized: value !== undefined,
    width: isVertical.value ? undefined : value,
    height: isVertical.value ? value : undefined,
  }
})

const sectionClass = computed(() => cls(
  'am-drawer',
  `am-drawer-${props.placement}`,
  {
    'am-drawer-large': props.size === 'large' && !sizeProps.value.sized,
    'am-drawer-sized': sizeProps.value.sized,
    'am-drawer-with-handle': showHandle.value,
  },
  props.classes?.section,
))

function close(event?: Event) {
  emit('close', event)
  emit('update:open', false)
}

function onCloseClick(event: MouseEvent) {
  if (closableConfig.value?.disabled)
    return
  close(event)
}

// ---------- swipe down to close ----------
const touch = useTouch()
let dragging = false
let sectionHeight = 0

function getSection(): HTMLElement | undefined {
  return (popupRef.value as any)?.nativeElement ?? undefined
}

function resetSectionStyle() {
  const el = getSection()
  if (el) {
    el.style.transform = ''
    el.style.transition = ''
  }
}

function onTouchStart(event: TouchEvent) {
  if (!showHandle.value)
    return
  touch.start(event)
  dragging = true
  sectionHeight = getSection()?.offsetHeight ?? 0
}

function onTouchMove(event: TouchEvent) {
  if (!dragging)
    return
  touch.move(event)
  if (!touch.isVertical())
    return
  preventDefault(event)
  const el = getSection()
  if (el) {
    const offset = Math.max(touch.deltaY.value, 0)
    el.style.transition = 'none'
    el.style.transform = `translate3d(0, ${offset}px, 0)`
  }
}

function onTouchEnd(event: TouchEvent) {
  if (!dragging)
    return
  dragging = false
  const el = getSection()
  const offset = Math.max(touch.deltaY.value, 0)
  const duration = Date.now() - touch.startTime.value
  const fast = duration < 300 && offset > 40
  const far = offset > Math.max(sectionHeight / 3, 60)
  if (touch.isVertical() && (fast || far)) {
    if (el) {
      // finish the gesture from the current offset; the styles are cleared once the popup is hidden
      el.style.transition = 'transform var(--am-motion-duration-mid) var(--am-motion-ease-out)'
      el.style.transform = 'translate3d(0, 100%, 0)'
    }
    close(event)
  }
  else if (el) {
    el.style.transition = 'transform var(--am-motion-duration-mid) var(--am-motion-ease-out)'
    el.style.transform = ''
  }
}

// mouse fallback so the handle also works in desktop browsers
function toTouchEvent(event: MouseEvent) {
  return {
    touches: [{ clientX: event.clientX, clientY: event.clientY }],
    cancelable: event.cancelable,
    preventDefault: () => event.preventDefault(),
  } as unknown as TouchEvent
}

function onMouseMove(event: MouseEvent) {
  onTouchMove(toTouchEvent(event))
}

function onMouseUp(event: MouseEvent) {
  removeMouseListeners()
  onTouchEnd(event as unknown as TouchEvent)
}

function removeMouseListeners() {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

function onMouseDown(event: MouseEvent) {
  if (event.button !== 0 || dragging || !showHandle.value)
    return
  onTouchStart(toTouchEvent(event))
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

onBeforeUnmount(removeMouseListeners)

function onAfterOpenChange(open: boolean) {
  if (!open)
    resetSectionStyle()
  emit('afterOpenChange', open)
}

watch(() => props.open, (open) => {
  if (open)
    resetSectionStyle()
})

defineExpose({
  /** the drawer panel element */
  nativeElement: computed(() => getSection()),
})
</script>

<template>
  <Popup
    ref="popupRef"
    v-bind="$attrs"
    :open="open"
    :placement="placement"
    :mask="mask"
    :mask-closable="maskClosable"
    :keyboard="keyboard"
    :round="round"
    :safe-area="safeArea"
    :lock-scroll="lockScroll"
    :destroy-on-hidden="destroyOnHidden"
    :force-render="forceRender"
    :get-container="getContainer"
    :z-index="zIndex"
    :width="sizeProps.width"
    :height="sizeProps.height"
    :root-class="cls('am-drawer-root', rootClass)"
    :classes="{ root: classes?.root, mask: classes?.mask, body: sectionClass }"
    :styles="{ root: { ...rootStyle, ...styles?.root }, mask: styles?.mask, body: styles?.section }"
    @close="close"
    @after-open-change="onAfterOpenChange"
  >
    <div
      v-if="showHandle"
      class="am-drawer-handle"
      :class="classes?.handle"
      :style="styles?.handle"
      @mousedown="onMouseDown"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <span class="am-drawer-handle-bar" />
    </div>
    <div
      v-if="hasHeader"
      class="am-drawer-header"
      :class="[classes?.header, { 'am-drawer-header-close-start': closeAtStart }]"
      :style="styles?.header"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <div v-if="hasTitle" class="am-drawer-title" :class="classes?.title" :style="styles?.title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
      <div v-if="hasExtra" class="am-drawer-extra" :class="classes?.extra" :style="styles?.extra">
        <slot name="extra">
          <RenderNode :node="extra" />
        </slot>
      </div>
      <button
        v-if="closableConfig"
        type="button"
        class="am-drawer-close"
        :class="[classes?.close, { 'am-drawer-close-disabled': closableConfig.disabled }]"
        :style="styles?.close"
        :disabled="closableConfig.disabled || undefined"
        :aria-label="commonLocale.close"
        @click="onCloseClick"
      >
        <slot name="closeIcon">
          <RenderNode v-if="isNode(mergedCloseIcon)" :node="mergedCloseIcon" />
          <CloseOutlined v-else />
        </slot>
      </button>
    </div>
    <div class="am-drawer-body" :class="classes?.body" :style="styles?.body">
      <div v-if="loading" class="am-drawer-loading" role="status" :aria-label="commonLocale.loading">
        <LoadingOutlined class="am-spin-icon" />
      </div>
      <slot v-else />
    </div>
    <div v-if="hasFooter" class="am-drawer-footer" :class="classes?.footer" :style="styles?.footer">
      <slot name="footer">
        <RenderNode :node="footer" />
      </slot>
    </div>
  </Popup>
</template>
