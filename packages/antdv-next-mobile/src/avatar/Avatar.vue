<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { AvatarEmits, AvatarProps, AvatarSlots } from './interface'
import { computed, inject, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useConfig } from '../config-provider/context'
import { mergeAttrsStyle } from '../space/util'
import { avatarGroupContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmAvatar', inheritAttrs: false })

const props = withDefaults(defineProps<AvatarProps>(), {
  gap: 4,
  draggable: undefined,
})
const emit = defineEmits<AvatarEmits>()
const slots = defineSlots<AvatarSlots>()

const config = useConfig()
const group = inject(avatarGroupContextKey, undefined)

const size = computed(() => props.size ?? group?.size.value ?? config.componentSize.value)
const shape = computed(() => props.shape ?? group?.shape.value ?? 'circle')

// ---------- image ----------
const imageFailed = ref(false)
watch(() => props.src, () => {
  imageFailed.value = false
})

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''
const isImageUrl = computed(() => typeof props.src === 'string' && props.src !== '')
const hasImage = computed(() => (isImageUrl.value && !imageFailed.value) || !!slots.src || (isNode(props.src) && !isImageUrl.value))
const hasIcon = computed(() => !!slots.icon || isNode(props.icon))

function handleImageError(event: Event) {
  imageFailed.value = true
  emit('error', event)
}

// ---------- text auto scale ----------
const rootRef = ref<HTMLElement>()
const textRef = ref<HTMLElement>()
const scale = ref(1)
let observer: ResizeObserver | undefined

function updateScale() {
  const root = rootRef.value
  const text = textRef.value
  if (!root || !text) {
    scale.value = 1
    return
  }
  const textWidth = text.offsetWidth
  const rootWidth = root.offsetWidth
  if (!textWidth || !rootWidth)
    return
  const available = rootWidth - props.gap * 2
  scale.value = available > 0 && available < textWidth ? available / textWidth : 1
}

onMounted(() => {
  updateScale()
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    observer = new ResizeObserver(updateScale)
    observer.observe(rootRef.value)
  }
})
onUpdated(updateScale)
watch(() => [props.gap, size.value], () => nextTick(updateScale))
onBeforeUnmount(() => observer?.disconnect())

// ---------- class / style ----------
const classNames = computed(() => [
  'am-avatar',
  `am-avatar-${shape.value}`,
  {
    'am-avatar-sm': size.value === 'small',
    'am-avatar-lg': size.value === 'large',
    'am-avatar-image': hasImage.value,
    'am-avatar-icon': !hasImage.value && hasIcon.value,
  },
  props.rootClass,
  props.classes?.root,
])

const mergedStyle = computed<CSSProperties>(() => {
  const style: Record<string, string> = {}
  if (typeof size.value === 'number') {
    style['--am-avatar-size'] = `${size.value}px`
    style['--am-avatar-font-size'] = `${Math.round(size.value * 0.45)}px`
    style['--am-avatar-icon-size'] = `${Math.round(size.value / 2)}px`
  }
  return { ...style, ...props.styles?.root }
})

const textStyle = computed<CSSProperties | undefined>(() => (scale.value !== 1 ? { transform: `scale(${scale.value})` } : undefined))
</script>

<template>
  <span ref="rootRef" v-bind="$attrs" :class="classNames" :style="mergeAttrsStyle(mergedStyle, $attrs.style)">
    <template v-if="hasImage">
      <slot name="src">
        <img
          v-if="isImageUrl"
          class="am-avatar-img"
          :src="(src as string)"
          :srcset="srcSet"
          :alt="alt"
          :draggable="draggable"
          :crossorigin="crossOrigin"
          :style="fit ? { objectFit: fit } : undefined"
          @error="handleImageError"
        >
        <RenderNode v-else :node="src" />
      </slot>
    </template>
    <slot v-else-if="hasIcon" name="icon">
      <RenderNode :node="icon" />
    </slot>
    <span v-else ref="textRef" class="am-avatar-string" :style="textStyle">
      <slot />
    </span>
  </span>
</template>
