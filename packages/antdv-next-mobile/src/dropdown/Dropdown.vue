<script setup lang="ts">
import type { Key } from '../_util/type'
import type { DropdownContext, DropdownItemRegistration } from './context'
import type { DropdownEmits, DropdownExpose, DropdownProps, DropdownSlots } from './interface'
import { CaretDownOutlined } from '@antdv-next/icons'
import { computed, onMounted, provide, ref, shallowRef, watch } from 'vue'
import { nextZIndex, useControlled, useEventListener } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { dropdownContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmDropdown', inheritAttrs: false })

const props = withDefaults(defineProps<DropdownProps>(), {
  activeKey: undefined,
  defaultActiveKey: null,
  closeOnMaskClick: true,
  closeOnClickAway: true,
  arrowIcon: undefined,
  getContainer: undefined,
})
const emit = defineEmits<DropdownEmits>()
defineSlots<DropdownSlots>()

const rootRef = ref<HTMLElement>()
const navRef = ref<HTMLElement>()
const items = shallowRef<DropdownItemRegistration[]>([])
const rect = ref({ top: 0, left: 0, width: 0 })
const zIndex = ref<number | undefined>(props.zIndex)

const [activeKey, setActiveKey] = useControlled<typeof props, 'activeKey', Key | null>(props, 'activeKey', {
  defaultValue: () => props.defaultActiveKey ?? null,
  onChange: (key, prev) => {
    if (key === prev)
      return
    emit('update:activeKey', key)
    emit('change', key)
  },
})

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

function updateRect() {
  const nav = navRef.value
  if (!nav)
    return
  const { bottom, left, width } = nav.getBoundingClientRect()
  rect.value = { top: bottom, left, width }
}

function sort() {
  const list = items.value
  if (list.length < 2 || list.some(item => !item.el))
    return
  const sorted = [...list].sort((a, b) => (a.el!.compareDocumentPosition(b.el!) & 2 ? 1 : -1))
  if (sorted.some((item, index) => item !== list[index]))
    items.value = sorted
}

function register(item: DropdownItemRegistration) {
  items.value = [...items.value, item]
  return () => {
    items.value = items.value.filter(i => i !== item)
  }
}

function close() {
  if (activeKey.value !== null)
    setActiveKey(null)
}

function toggle(item: DropdownItemRegistration) {
  if (item.disabled())
    return
  if (activeKey.value === item.key) {
    setActiveKey(null)
  }
  else {
    prepare()
    setActiveKey(item.key)
  }
}

function prepare() {
  updateRect()
  zIndex.value = props.zIndex ?? nextZIndex()
}

watch(activeKey, (key, prev) => {
  // opened from the outside (v-model) while collapsed
  if (key !== null && prev === null)
    prepare()
})
watch(() => props.zIndex, (value) => {
  if (value !== undefined)
    zIndex.value = value
})
onMounted(() => {
  sort()
  if (activeKey.value !== null)
    prepare()
})

function onClickAway(event: Event) {
  if (activeKey.value === null || !props.closeOnClickAway)
    return
  const target = event.target as Node | null
  if (!target || rootRef.value?.contains(target))
    return
  if (items.value.some(item => item.layerEl?.()?.contains(target)))
    return
  close()
}

useEventListener('touchstart', onClickAway, { passive: true, capture: true })
useEventListener('mousedown', onClickAway, { capture: true })
useEventListener('resize', () => activeKey.value !== null && updateRect(), { passive: true })
useEventListener('scroll', () => activeKey.value !== null && updateRect(), { passive: true, capture: true })

const context: DropdownContext = {
  activeKey,
  rect,
  zIndex,
  getContainer: computed(() => props.getContainer),
  closeOnMaskClick: computed(() => props.closeOnMaskClick),
  register,
  sort,
  close,
}
provide(dropdownContextKey, context)

defineExpose<DropdownExpose>({ close })
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    class="am-dropdown"
    :class="[{ 'am-dropdown-open': activeKey !== null }, rootClass, classes?.root]"
    :style="styles?.root"
  >
    <div ref="navRef" class="am-dropdown-nav" :class="classes?.nav" :style="styles?.nav">
      <div
        v-for="item in items"
        :key="item.key"
        class="am-dropdown-nav-item"
        :class="[
          classes?.item,
          {
            'am-dropdown-nav-item-active': activeKey === item.key,
            'am-dropdown-nav-item-highlight': item.highlight(),
            'am-dropdown-nav-item-disabled': item.disabled(),
          },
        ]"
        :style="styles?.item"
        role="button"
        :tabindex="item.disabled() ? -1 : 0"
        :aria-expanded="activeKey === item.key"
        :aria-disabled="item.disabled() || undefined"
        @click="toggle(item)"
      >
        <span class="am-dropdown-nav-title" :class="classes?.title" :style="styles?.title">
          <RenderNode :node="item.renderTitle" />
        </span>
        <span class="am-dropdown-nav-arrow" :class="classes?.arrow" :style="styles?.arrow">
          <RenderNode v-if="item.renderArrow" :node="item.renderArrow" />
          <slot v-else name="arrowIcon">
            <RenderNode v-if="isNode(arrowIcon)" :node="arrowIcon" />
            <CaretDownOutlined v-else />
          </slot>
        </span>
      </div>
    </div>
    <slot />
  </div>
</template>
