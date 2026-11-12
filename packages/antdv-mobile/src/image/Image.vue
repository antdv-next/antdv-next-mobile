<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ImageEmits, ImagePreviewConfig, ImageProps, ImageSlots } from './interface'
import { PictureOutlined } from '@antdv-next/icons'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { addUnit } from '../_util'
import RenderNode from '../_util/RenderNode'
import ImagePreview from '../image-preview/ImagePreview.vue'
import { useLocale } from '../locale'
import { useImagePreviewGroup } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmImage', inheritAttrs: false })

const props = withDefaults(defineProps<ImageProps>(), {
  placeholder: undefined,
  preview: undefined,
  fit: 'fill',
  lazy: false,
  round: false,
})
const emit = defineEmits<ImageEmits>()
defineSlots<ImageSlots>()

const locale = useLocale('Image')
const group = useImagePreviewGroup()

const rootRef = ref<HTMLElement>()
const imgRef = ref<HTMLImageElement>()
const status = ref<'loading' | 'loaded' | 'error'>('loading')
const useFallback = ref(false)
/** false until a lazy image enters the viewport */
const shouldLoad = ref(!props.lazy)

const mergedFallback = computed(() => props.fallback ?? group?.fallback.value)
const mergedSrc = computed(() => (useFallback.value ? mergedFallback.value : props.src))

watch(() => props.src, () => {
  useFallback.value = false
  status.value = 'loading'
})

function onLoad(event: Event) {
  status.value = 'loaded'
  // loading the fallback image is not a successful load of `src`
  if (!useFallback.value)
    emit('load', event)
}

function onError(event: Event) {
  if (!useFallback.value) {
    emit('error', event)
    if (mergedFallback.value && mergedFallback.value !== props.src) {
      useFallback.value = true
      return
    }
  }
  status.value = 'error'
}

// ---------- lazy ----------
let observer: IntersectionObserver | undefined

function disconnect() {
  observer?.disconnect()
  observer = undefined
}

onMounted(() => {
  // the image may already be complete (cache / SSR hydration) before the listeners were attached
  const img = imgRef.value
  if (img?.complete && img.naturalWidth)
    status.value = 'loaded'

  if (!shouldLoad.value) {
    if (typeof IntersectionObserver === 'undefined' || !rootRef.value) {
      shouldLoad.value = true
      return
    }
    observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        shouldLoad.value = true
        disconnect()
      }
    })
    observer.observe(rootRef.value)
  }
})
onBeforeUnmount(disconnect)

// ---------- preview ----------
const id = Symbol('image')
const previewConfig = computed<ImagePreviewConfig>(() => (typeof props.preview === 'object' && props.preview ? props.preview : {}))
const previewEnabled = computed(() => {
  if (props.preview === undefined)
    return !!group && group.enabled.value
  return props.preview !== false
})
const inGroup = computed(() => !!group && group.enabled.value && previewEnabled.value)
const previewSrc = computed(() => previewConfig.value.src ?? props.src)
const innerOpen = ref(false)
const previewOpen = computed(() => previewConfig.value.open ?? innerOpen.value)

const previewProps = computed(() => {
  const { open: _open, src: _src, maxScale, minScale, ...rest } = previewConfig.value
  return {
    ...rest,
    ...(maxScale !== undefined ? { maxZoom: maxScale } : {}),
    ...(minScale !== undefined ? { minZoom: minScale } : {}),
  }
})

function setPreviewOpen(value: boolean) {
  if (value === previewOpen.value)
    return
  innerOpen.value = value
  emit('openChange', value)
}

let unregister: (() => void) | undefined
watch(
  inGroup,
  (value) => {
    unregister?.()
    unregister = undefined
    if (value && group)
      unregister = group.register(id, () => (previewSrc.value ? { src: previewSrc.value, alt: props.alt } : undefined))
  },
  { immediate: true },
)
onBeforeUnmount(() => unregister?.())

function onClick(event: MouseEvent) {
  emit('click', event)
  if (!previewEnabled.value || !previewSrc.value)
    return
  if (inGroup.value)
    group!.open(id)
  else
    setPreviewOpen(true)
}

// ---------- render ----------
const showPlaceholder = computed(() => status.value === 'loading' && props.placeholder !== false)

const rootStyle = computed<CSSProperties>(() => ({
  width: addUnit(props.width),
  height: addUnit(props.height),
  borderRadius: addUnit(props.radius),
}))

const imgStyle = computed<CSSProperties>(() => ({
  objectFit: props.fit,
  objectPosition: props.position,
}))

const classNames = computed(() => [
  'am-image',
  {
    'am-image-round': props.round,
    'am-image-previewable': previewEnabled.value,
    'am-image-error': status.value === 'error',
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" :class="classNames" :style="[rootStyle, styles?.root]" @click="onClick">
    <img
      v-if="shouldLoad && mergedSrc !== undefined && status !== 'error'"
      ref="imgRef"
      class="am-image-img"
      :class="classes?.image"
      :style="[imgStyle, styles?.image]"
      :src="mergedSrc"
      :alt="alt"
      :crossorigin="crossorigin"
      :referrerpolicy="referrerpolicy"
      draggable="false"
      @load="onLoad"
      @error="onError"
    >
    <div v-if="status === 'error'" class="am-image-placeholder am-image-fallback" :class="classes?.placeholder" :style="styles?.placeholder">
      <slot name="fallback">
        <PictureOutlined class="am-image-placeholder-icon" />
        <span class="am-image-placeholder-text">{{ locale.loadFailed }}</span>
      </slot>
    </div>
    <div v-else-if="showPlaceholder" class="am-image-placeholder" :class="classes?.placeholder" :style="styles?.placeholder">
      <slot name="placeholder">
        <RenderNode v-if="placeholder !== undefined && placeholder !== true" :node="placeholder" />
        <PictureOutlined v-else class="am-image-placeholder-icon" />
      </slot>
    </div>
    <ImagePreview
      v-if="previewEnabled && !inGroup"
      v-bind="previewProps"
      :open="previewOpen"
      :images="previewSrc ? [{ src: previewSrc, alt }] : []"
      :show-index="false"
      @update:open="setPreviewOpen"
      @click.stop
    />
  </div>
</template>
