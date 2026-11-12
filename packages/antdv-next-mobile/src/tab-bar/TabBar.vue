<script setup lang="ts">
import type { Key } from '../_util/type'
import type { TabBarEmits, TabBarItem, TabBarProps, TabBarSlots } from './interface'
import { computed } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmTabBar', inheritAttrs: false })

const props = withDefaults(defineProps<TabBarProps>(), {
  items: () => [],
  fixed: false,
  placeholder: false,
  safeArea: true,
  bordered: true,
})
const emit = defineEmits<TabBarEmits>()
const slots = defineSlots<TabBarSlots>()

const [activeKey, setActiveKey] = useControlled<TabBarProps, 'activeKey', Key | undefined>(props, 'activeKey', {
  defaultValue: () => props.defaultActiveKey ?? props.items[0]?.key,
  onChange: (key) => {
    emit('update:activeKey', key as Key)
    emit('change', key as Key)
  },
})

const classNames = computed(() => [
  'am-tab-bar',
  {
    'am-tab-bar-fixed': props.fixed,
    'am-tab-bar-placeholder': props.fixed && props.placeholder,
    'am-tab-bar-safe-area': props.safeArea,
    'am-tab-bar-bordered': props.bordered,
  },
  props.rootClass,
  props.classes?.root,
])

const hasNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''
const hasBadge = (badge: TabBarItem['badge']) => badge !== undefined && badge !== null && badge !== false && badge !== '' && badge !== 0
const hasIcon = (item: TabBarItem) => !!slots.icon || hasNode(item.icon)
const hasTitle = (item: TabBarItem) => !!slots.title || hasNode(item.title)

function handleClick(item: TabBarItem) {
  if (item.disabled || item.key === activeKey.value)
    return
  setActiveKey(item.key)
}
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div
      class="am-tab-bar-content"
      :class="classes?.content"
      :style="[zIndex !== undefined ? { zIndex } : undefined, styles?.content]"
      role="tablist"
    >
      <div
        v-for="(item, index) in items"
        :key="item.key"
        class="am-tab-bar-item"
        :class="[
          { 'am-tab-bar-item-active': item.key === activeKey, 'am-tab-bar-item-disabled': item.disabled },
          classes?.item,
          item.class,
        ]"
        :style="[styles?.item, item.style]"
        role="tab"
        :tabindex="item.disabled ? -1 : 0"
        :aria-selected="item.key === activeKey"
        :aria-disabled="item.disabled || undefined"
        @click="handleClick(item)"
        @keydown.enter="handleClick(item)"
      >
        <div v-if="hasIcon(item)" class="am-tab-bar-item-icon" :class="classes?.icon" :style="styles?.icon">
          <slot name="icon" :item="item" :index="index" :active="item.key === activeKey">
            <RenderNode :node="item.icon" :params="item.key === activeKey" />
          </slot>
          <sup
            v-if="hasBadge(item.badge)"
            class="am-tab-bar-badge"
            :class="[{ 'am-tab-bar-badge-dot': item.badge === true }, classes?.badge]"
            :style="styles?.badge"
          >
            <template v-if="item.badge !== true">{{ item.badge }}</template>
          </sup>
        </div>
        <div v-if="hasTitle(item)" class="am-tab-bar-item-title" :class="classes?.title" :style="styles?.title">
          <slot name="title" :item="item" :index="index" :active="item.key === activeKey">
            <RenderNode :node="item.title" />
          </slot>
          <sup
            v-if="!hasIcon(item) && hasBadge(item.badge)"
            class="am-tab-bar-badge"
            :class="[{ 'am-tab-bar-badge-dot': item.badge === true }, classes?.badge]"
            :style="styles?.badge"
          >
            <template v-if="item.badge !== true">{{ item.badge }}</template>
          </sup>
        </div>
      </div>
    </div>
  </div>
</template>
