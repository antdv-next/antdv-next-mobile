<script setup lang="ts">
import type { Key } from '../_util/type'
import type { TabsEmits, TabsItem, TabsProps, TabsSlots } from './interface'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { addUnit, doubleRaf, preventDefault } from '../_util'
import { useControlled, useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useConfig, useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmTabs', inheritAttrs: false })

const props = withDefaults(defineProps<TabsProps>(), {
  items: () => [],
  type: 'line',
  centered: false,
  animated: undefined,
  destroyOnHidden: false,
  swipeable: false,
  sticky: false,
  offsetTop: 0,
  stretch: undefined,
})
const emit = defineEmits<TabsEmits>()
const slots = defineSlots<TabsSlots>()

const config = useConfig()
const size = useSize(() => props.size)
const isRtl = computed(() => config.direction.value === 'rtl')

const [activeKey, setActiveKey] = useControlled<TabsProps, 'activeKey', Key | undefined>(props, 'activeKey', {
  defaultValue: () => props.defaultActiveKey ?? props.items.find(item => !item.disabled)?.key,
  onChange: (key) => {
    emit('update:activeKey', key as Key)
    emit('change', key as Key)
  },
})

const activeIndex = computed(() => props.items.findIndex(item => item.key === activeKey.value))
const placement = computed(() => props.tabPlacement ?? props.tabPosition ?? 'top')
const stretch = computed(() => props.stretch ?? (!props.centered && props.items.length <= 4))

const animated = computed(() => {
  const { animated } = props
  if (typeof animated === 'object' && animated)
    return { inkBar: animated.inkBar ?? true, tabPane: animated.tabPane ?? false }
  return { inkBar: animated ?? true, tabPane: animated ?? false }
})
/** panes sit side by side on a sliding track */
const trackMode = computed(() => props.swipeable || animated.value.tabPane)

// ---------- lazy panes ----------
const visited = ref<Key[]>([])
watch(
  activeKey,
  (key) => {
    if (key !== undefined && !visited.value.includes(key))
      visited.value.push(key)
  },
  { immediate: true },
)

function shouldRender(item: TabsItem) {
  if (item.key === activeKey.value || item.forceRender)
    return true
  return visited.value.includes(item.key) && !(item.destroyOnHidden ?? props.destroyOnHidden)
}

const hasNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

// ---------- ink bar & auto centering ----------
const navRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()
const inkX = ref<number>()
const inkAnimated = ref(false)

function getActiveTab() {
  return activeIndex.value > -1 ? (listRef.value?.children[activeIndex.value] as HTMLElement | undefined) : undefined
}

function updateInk() {
  const tab = getActiveTab()
  inkX.value = tab ? tab.offsetLeft + tab.offsetWidth / 2 : undefined
}

function scrollIntoView(immediate?: boolean) {
  const nav = navRef.value
  const tab = getActiveTab()
  if (!nav || !tab)
    return
  const left = tab.offsetLeft - (nav.offsetWidth - tab.offsetWidth) / 2
  if (immediate || typeof nav.scrollTo !== 'function')
    nav.scrollLeft = left
  else
    nav.scrollTo({ left, behavior: 'smooth' })
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  updateInk()
  scrollIntoView(true)
  // enable the transition after the first paint so the bar does not slide in from the edge
  doubleRaf(() => {
    inkAnimated.value = true
  })
  if (typeof ResizeObserver !== 'undefined' && listRef.value) {
    resizeObserver = new ResizeObserver(() => updateInk())
    resizeObserver.observe(listRef.value)
  }
})
onBeforeUnmount(() => resizeObserver?.disconnect())

watch(activeKey, () => nextTick(() => {
  updateInk()
  scrollIntoView()
}), { flush: 'post' })

watch(
  () => [props.items, size.value, props.type, stretch.value, props.centered, isRtl.value],
  () => nextTick(updateInk),
  { flush: 'post' },
)

const inkStyle = computed(() => [
  inkX.value === undefined
    ? { display: 'none' }
    : { transform: `translate3d(${inkX.value}px, 0, 0) translateX(-50%)` },
  props.styles?.indicator,
])

// ---------- switching ----------
function handleTabClick(item: TabsItem, event: MouseEvent) {
  emit('tabClick', item.key, event)
  if (item.disabled || item.key === activeKey.value)
    return
  setActiveKey(item.key)
}

/** nearest enabled tab in the given direction */
function findSibling(step: 1 | -1) {
  let index = activeIndex.value + step
  while (index >= 0 && index < props.items.length) {
    if (!props.items[index].disabled)
      return props.items[index]
    index += step
  }
  return undefined
}

// ---------- swipe ----------
const bodyRef = ref<HTMLElement>()
const touch = useTouch()
const dragging = ref(false)
const dragOffset = ref(0)

function handleTouchStart(event: TouchEvent) {
  if (!props.swipeable)
    return
  touch.start(event)
}

function handleTouchMove(event: TouchEvent) {
  if (!props.swipeable)
    return
  touch.move(event)
  if (!touch.isHorizontal())
    return
  preventDefault(event)
  dragging.value = true
  const delta = touch.deltaX.value
  const step = (delta < 0 ? 1 : -1) * (isRtl.value ? -1 : 1)
  // rubber band at both ends
  dragOffset.value = findSibling(step as 1 | -1) ? delta : delta / 3
}

function handleTouchEnd() {
  if (!dragging.value)
    return
  const delta = touch.deltaX.value
  const width = bodyRef.value?.offsetWidth ?? 0
  const threshold = width ? width / 4 : 50
  const quick = Date.now() - touch.startTime.value < 300 && touch.offsetX.value > 30
  if (Math.abs(delta) > threshold || quick) {
    const step = (delta < 0 ? 1 : -1) * (isRtl.value ? -1 : 1)
    const target = findSibling(step as 1 | -1)
    if (target)
      setActiveKey(target.key)
  }
  dragging.value = false
  dragOffset.value = 0
}

const trackStyle = computed(() => {
  if (!trackMode.value)
    return undefined
  const index = Math.max(activeIndex.value, 0)
  const percent = index * 100 * (isRtl.value ? 1 : -1)
  return { transform: `translate3d(calc(${percent}% + ${dragOffset.value}px), 0, 0)` }
})

const classNames = computed(() => [
  'am-tabs',
  `am-tabs-${placement.value}`,
  `am-tabs-${props.type}`,
  {
    'am-tabs-sm': size.value === 'small',
    'am-tabs-lg': size.value === 'large',
    'am-tabs-centered': props.centered,
    'am-tabs-stretch': stretch.value,
    'am-tabs-sticky': props.sticky,
    'am-tabs-swipeable': props.swipeable,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div
      class="am-tabs-header"
      :class="classes?.header"
      :style="[sticky ? { top: addUnit(offsetTop) } : undefined, styles?.header]"
    >
      <div v-if="slots.leftExtra" class="am-tabs-extra">
        <slot name="leftExtra" />
      </div>
      <div ref="navRef" class="am-tabs-nav">
        <div ref="listRef" class="am-tabs-nav-list" role="tablist">
          <div
            v-for="(item, index) in items"
            :key="item.key"
            class="am-tabs-tab"
            :class="[
              { 'am-tabs-tab-active': item.key === activeKey, 'am-tabs-tab-disabled': item.disabled },
              classes?.item,
              item.class,
            ]"
            :style="[styles?.item, item.style]"
            role="tab"
            :tabindex="item.disabled ? -1 : 0"
            :aria-selected="item.key === activeKey"
            :aria-disabled="item.disabled || undefined"
            @click="handleTabClick(item, $event)"
            @keydown.enter="handleTabClick(item, $event as unknown as MouseEvent)"
          >
            <span v-if="hasNode(item.icon)" class="am-tabs-tab-icon">
              <RenderNode :node="item.icon" />
            </span>
            <span class="am-tabs-tab-label">
              <slot name="labelRender" :item="item" :index="index">
                <RenderNode :node="item.label" />
              </slot>
            </span>
          </div>
          <div
            v-if="type === 'line'"
            class="am-tabs-ink-bar"
            :class="[{ 'am-tabs-ink-bar-animated': inkAnimated && animated.inkBar }, classes?.indicator]"
            :style="inkStyle"
          />
        </div>
      </div>
      <div v-if="slots.rightExtra" class="am-tabs-extra">
        <slot name="rightExtra" />
      </div>
    </div>
    <div
      ref="bodyRef"
      class="am-tabs-body"
      :class="classes?.body"
      :style="styles?.body"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <div
        class="am-tabs-content"
        :class="{ 'am-tabs-content-track': trackMode, 'am-tabs-content-dragging': dragging }"
        :style="trackStyle"
      >
        <div
          v-for="(item, index) in items"
          :key="item.key"
          class="am-tabs-tabpane"
          :class="[{ 'am-tabs-tabpane-active': item.key === activeKey }, classes?.content]"
          :style="styles?.content"
          role="tabpanel"
          :aria-hidden="item.key !== activeKey"
        >
          <template v-if="shouldRender(item)">
            <slot name="contentRender" :item="item" :index="index">
              <RenderNode v-if="hasNode(item.content ?? item.children)" :node="item.content ?? item.children" />
              <slot v-else :item="item" :index="index" />
            </slot>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
