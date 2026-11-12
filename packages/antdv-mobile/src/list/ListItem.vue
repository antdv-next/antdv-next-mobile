<script setup lang="ts">
import type { ListItemEmits, ListItemProps, ListItemSlots } from './interface'
import { RightOutlined } from '@antdv-next/icons'
import { computed, getCurrentInstance } from 'vue'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmListItem', inheritAttrs: false })

const props = withDefaults(defineProps<ListItemProps>(), {
  title: undefined,
  description: undefined,
  prefix: undefined,
  extra: undefined,
  arrow: undefined,
  clickable: undefined,
  disabled: false,
  align: 'center',
})
const emit = defineEmits<ListItemEmits>()
const slots = defineSlots<ListItemSlots>()

const instance = getCurrentInstance()

/** Not reactive on purpose: listeners live on the vnode, so this is read on every render. */
function isClickable() {
  return props.clickable ?? (props.href !== undefined || !!instance?.vnode.props?.onClick)
}

function showArrow() {
  if (slots.arrow)
    return true
  return props.arrow === undefined ? isClickable() : isRenderable(props.arrow)
}

const isLink = computed(() => props.href !== undefined)

const classNames = computed(() => [
  {
    'am-list-item-disabled': props.disabled,
    'am-list-item-align-start': props.align === 'start',
  },
  props.rootClass,
  props.classes?.root,
])

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

function handleKeydown(event: KeyboardEvent) {
  if (!isLink.value && isClickable() && !props.disabled)
    (event.currentTarget as HTMLElement).click()
}
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    v-bind="$attrs"
    class="am-list-item"
    :class="[classNames, { 'am-list-item-clickable': isClickable() && !disabled }]"
    :style="styles?.root"
    :href="isLink && !disabled ? href : undefined"
    :target="isLink ? target : undefined"
    :role="!isLink && isClickable() ? 'button' : undefined"
    :tabindex="!isLink && isClickable() && !disabled ? 0 : undefined"
    :aria-disabled="disabled || undefined"
    @click="handleClick"
    @keydown.enter="handleKeydown"
  >
    <div v-if="slots.prefix || isRenderable(prefix)" class="am-list-item-prefix" :class="classes?.prefix" :style="styles?.prefix">
      <slot name="prefix">
        <RenderNode :node="prefix" />
      </slot>
    </div>
    <div class="am-list-item-main">
      <div class="am-list-item-content" :class="classes?.content" :style="styles?.content">
        <div
          v-if="slots.default || slots.title || isRenderable(title)"
          class="am-list-item-title"
          :class="classes?.title"
          :style="styles?.title"
        >
          <slot>
            <slot name="title">
              <RenderNode :node="title" />
            </slot>
          </slot>
        </div>
        <div
          v-if="slots.description || isRenderable(description)"
          class="am-list-item-description"
          :class="classes?.description"
          :style="styles?.description"
        >
          <slot name="description">
            <RenderNode :node="description" />
          </slot>
        </div>
      </div>
      <div v-if="slots.extra || isRenderable(extra)" class="am-list-item-extra" :class="classes?.extra" :style="styles?.extra">
        <slot name="extra">
          <RenderNode :node="extra" />
        </slot>
      </div>
      <div v-if="showArrow()" class="am-list-item-arrow" :class="classes?.arrow" :style="styles?.arrow">
        <slot name="arrow">
          <RightOutlined v-if="arrow === undefined || arrow === true" />
          <RenderNode v-else :node="arrow" />
        </slot>
      </div>
    </div>
  </component>
</template>
