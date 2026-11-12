<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TagEmits, TagProps, TagSlots } from './interface'
import { CloseOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import { useLocale } from '../locale'
import { mergeAttrsStyle } from '../space/util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmTag', inheritAttrs: false })

const props = withDefaults(defineProps<TagProps>(), {
  bordered: true,
  closable: undefined,
  disabled: undefined,
  round: false,
})
const emit = defineEmits<TagEmits>()
const slots = defineSlots<TagSlots>()

const presetColors = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime']
const statusColors = ['success', 'processing', 'error', 'default', 'warning']

const size = useSize(() => props.size)
const disabled = useDisabled(() => props.disabled)
const commonLocale = useLocale('common')

const visible = ref(true)

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false
const isInternalColor = computed(() => !!props.color && (presetColors.includes(props.color) || statusColors.includes(props.color)))
const hasColor = computed(() => !!props.color && props.color !== 'default')
const variant = computed(() => props.variant ?? 'filled')
const hasIcon = computed(() => !!slots.icon || isNode(props.icon))

const closableConfig = computed(() => (typeof props.closable === 'object' && props.closable ? props.closable : undefined))
const mergedCloseIcon = computed(() => closableConfig.value?.closeIcon ?? props.closeIcon)
const mergedClosable = computed(() => {
  if (props.closable !== undefined)
    return !!props.closable
  return !!slots.closeIcon || (isNode(props.closeIcon) && props.closeIcon !== '')
})
const hasCustomCloseIcon = computed(() => isNode(mergedCloseIcon.value) && mergedCloseIcon.value !== true && mergedCloseIcon.value !== '')

const classNames = computed(() => [
  'am-tag',
  `am-tag-${variant.value}`,
  {
    [`am-tag-${props.color}`]: isInternalColor.value,
    'am-tag-has-color': hasColor.value,
    'am-tag-borderless': !props.bordered,
    'am-tag-sm': size.value === 'small',
    'am-tag-lg': size.value === 'large',
    'am-tag-round': props.round,
    'am-tag-disabled': disabled.value,
  },
  props.rootClass,
  props.classes?.root,
])

const mergedStyle = computed<CSSProperties>(() => {
  const style: Record<string, string> = {}
  if (hasColor.value && !isInternalColor.value)
    style['--am-tag-c'] = props.color as string
  return { ...style, ...props.styles?.root }
})

function handleClose(event: MouseEvent) {
  event.stopPropagation()
  if (disabled.value)
    return
  emit('close', event)
  if (!event.defaultPrevented)
    visible.value = false
}

function handleClick(event: MouseEvent) {
  if (disabled.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}
</script>

<template>
  <component
    :is="href !== undefined ? 'a' : 'span'"
    v-if="visible"
    v-bind="$attrs"
    :class="classNames"
    :style="mergeAttrsStyle(mergedStyle, $attrs.style)"
    :href="href !== undefined && !disabled ? href : undefined"
    :target="href !== undefined ? target : undefined"
    :aria-disabled="disabled || undefined"
    @click.capture="handleClick"
  >
    <span v-if="hasIcon" class="am-tag-icon" :class="classes?.icon" :style="styles?.icon">
      <slot name="icon"><RenderNode :node="icon" /></slot>
    </span>
    <span v-if="$slots.default" class="am-tag-content" :class="classes?.content" :style="styles?.content">
      <slot />
    </span>
    <span
      v-if="mergedClosable"
      class="am-tag-close-icon"
      :class="classes?.close"
      :style="styles?.close"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-label="closableConfig?.ariaLabel ?? commonLocale.close"
      @click="handleClose"
    >
      <slot name="closeIcon">
        <RenderNode v-if="hasCustomCloseIcon" :node="mergedCloseIcon" />
        <CloseOutlined v-else />
      </slot>
    </span>
  </component>
</template>
