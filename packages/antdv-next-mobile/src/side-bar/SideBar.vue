<script setup lang="ts">
import type { Key } from '../_util/type'
import type { SideBarEmits, SideBarItem, SideBarProps, SideBarSlots } from './interface'
import { computed } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSideBar', inheritAttrs: false })

const props = withDefaults(defineProps<SideBarProps>(), {
  items: () => [],
})
const emit = defineEmits<SideBarEmits>()
defineSlots<SideBarSlots>()

const [activeKey, setActiveKey] = useControlled<SideBarProps, 'activeKey', Key | undefined>(props, 'activeKey', {
  defaultValue: () => props.defaultActiveKey ?? props.items[0]?.key,
  onChange: (key) => {
    emit('update:activeKey', key as Key)
    emit('change', key as Key)
  },
})

const activeIndex = computed(() => props.items.findIndex(item => item.key === activeKey.value))

const hasBadge = (badge: SideBarItem['badge']) => badge !== undefined && badge !== null && badge !== false && badge !== '' && badge !== 0

function handleClick(item: SideBarItem) {
  if (item.disabled || item.key === activeKey.value)
    return
  setActiveKey(item.key)
}
</script>

<template>
  <div v-bind="$attrs" class="am-side-bar" :class="[rootClass, classes?.root]" :style="styles?.root" role="tablist" aria-orientation="vertical">
    <div
      v-for="(item, index) in items"
      :key="item.key"
      class="am-side-bar-item"
      :class="[
        {
          'am-side-bar-item-active': index === activeIndex,
          'am-side-bar-item-disabled': item.disabled,
          'am-side-bar-item-prev': activeIndex > -1 && index === activeIndex - 1,
          'am-side-bar-item-next': activeIndex > -1 && index === activeIndex + 1,
        },
        classes?.item,
        item.class,
      ]"
      :style="[styles?.item, item.style]"
      role="tab"
      :tabindex="item.disabled ? -1 : 0"
      :aria-selected="index === activeIndex"
      :aria-disabled="item.disabled || undefined"
      @click="handleClick(item)"
      @keydown.enter="handleClick(item)"
    >
      <span class="am-side-bar-item-title" :class="classes?.title" :style="styles?.title">
        <slot name="title" :item="item" :index="index" :active="index === activeIndex">
          <RenderNode :node="item.title" />
        </slot>
        <sup
          v-if="hasBadge(item.badge)"
          class="am-side-bar-badge"
          :class="[{ 'am-side-bar-badge-dot': item.badge === true }, classes?.badge]"
          :style="styles?.badge"
        >
          <template v-if="item.badge !== true">{{ item.badge }}</template>
        </sup>
      </span>
    </div>
    <div class="am-side-bar-rest" :class="{ 'am-side-bar-item-next': activeIndex > -1 && activeIndex === items.length - 1 }" />
  </div>
</template>
