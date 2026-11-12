<script setup lang="ts">
import type { WatermarkEmits, WatermarkProps, WatermarkSlots } from './interface'
import type { ResolvedFont } from './utils'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cancelRaf, raf } from '../_util'
import { useConfig } from '../config-provider/context'
import { getCanvasContext, getClips, getLayerStyle, getMarkSize } from './utils'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmWatermark', inheritAttrs: false })

const props = withDefaults(defineProps<WatermarkProps>(), {
  zIndex: 9,
  rotate: -22,
  gap: () => [100, 100],
})
const emit = defineEmits<WatermarkEmits>()
defineSlots<WatermarkSlots>()

const FALLBACK_COLOR = 'rgba(0, 0, 0, 0.15)'

const config = useConfig()
const rootRef = ref<HTMLElement>()

let layer: HTMLElement | undefined
let observer: MutationObserver | undefined
let rafId = -1
let renderId = 0

function resolveFont(): ResolvedFont {
  const font = props.font ?? {}
  // The default color is a css variable so that it follows the theme (dark mode): read its resolved value.
  let color = font.color
  if (!color && layer)
    color = getComputedStyle(layer).color
  return {
    color: color || FALLBACK_COLOR,
    fontSize: font.fontSize ?? 16,
    fontWeight: font.fontWeight ?? 'normal',
    fontStyle: font.fontStyle ?? 'normal',
    fontFamily: font.fontFamily ?? 'sans-serif',
    textAlign: font.textAlign ?? 'center',
  }
}

function withoutObserver(fn: () => void) {
  observer?.disconnect()
  fn()
  if (observer && rootRef.value) {
    observer.observe(rootRef.value, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] })
  }
}

function ensureLayer() {
  const root = rootRef.value
  if (!root)
    return undefined
  if (!layer) {
    layer = document.createElement('div')
    layer.setAttribute('aria-hidden', 'true')
  }
  if (layer.parentElement !== root)
    root.append(layer)
  return layer
}

function applyLayer(base64Url: string, markWidth: number) {
  const el = ensureLayer()
  if (!el)
    return
  const style: Record<string, string> = {
    'z-index': String(props.zIndex),
    'position': props.fullPage ? 'fixed' : 'absolute',
    'left': '0',
    'top': '0',
    'width': '100%',
    'height': '100%',
    'pointer-events': 'none',
    'background-repeat': 'repeat',
    ...getLayerStyle(props.gap, props.offset),
    'background-image': `url('${base64Url}')`,
    'background-size': `${Math.floor(markWidth)}px`,
    // keep the layer visible whatever a user style sheet says
    'visibility': 'visible',
    'opacity': '1',
  }
  el.className = 'am-watermark-layer'
  el.setAttribute('style', Object.keys(style).map(key => `${key}: ${style[key]} !important;`).join(' '))
}

function removeLayer() {
  withoutObserver(() => {
    layer?.remove()
    layer = undefined
  })
}

function render() {
  if (!rootRef.value)
    return
  const id = ++renderId
  const ctx = getCanvasContext()
  if (!ctx)
    return

  withoutObserver(() => {
    ensureLayer()
    if (layer)
      layer.className = 'am-watermark-layer'
  })

  const font = resolveFont()
  const ratio = window.devicePixelRatio || 1
  const [gapX, gapY] = props.gap
  const [markWidth, markHeight] = getMarkSize(ctx, {
    width: props.width,
    height: props.height,
    image: props.image,
    content: props.content,
    font,
  })

  const draw = (content: string | string[] | HTMLImageElement) => {
    if (id !== renderId)
      return
    const clips = getClips(content, props.rotate, ratio, markWidth, markHeight, font, gapX, gapY)
    if (!clips)
      return
    withoutObserver(() => applyLayer(clips[0], clips[1]))
  }

  if (props.image) {
    const img = new Image()
    img.onload = () => draw(img)
    // fall back to the text when the image fails to load
    img.onerror = () => draw(props.content ?? '')
    img.crossOrigin = 'anonymous'
    img.referrerPolicy = 'no-referrer'
    img.src = props.image
  }
  else if (props.content !== undefined && props.content !== '') {
    draw(props.content)
  }
  else {
    removeLayer()
  }
}

function scheduleRender() {
  cancelRaf(rafId)
  rafId = raf(render)
}

function onMutate(mutations: MutationRecord[]) {
  const tampered = mutations.some((mutation) => {
    if (mutation.type === 'childList')
      return Array.from(mutation.removedNodes).includes(layer as Node)
    return mutation.type === 'attributes' && mutation.target === layer
  })
  if (tampered) {
    emit('remove')
    render()
  }
}

onMounted(() => {
  if (typeof MutationObserver !== 'undefined')
    observer = new MutationObserver(onMutate)
  render()
})

onBeforeUnmount(() => {
  cancelRaf(rafId)
  renderId++
  observer?.disconnect()
  observer = undefined
  layer?.remove()
  layer = undefined
})

watch(
  () => [
    props.zIndex,
    props.rotate,
    props.width,
    props.height,
    props.image,
    props.content,
    props.font,
    props.gap,
    props.offset,
    props.fullPage,
    // re-draw with the new default color when the theme changes
    config.theme.value,
  ],
  scheduleRender,
  { deep: true, flush: 'post' },
)

defineExpose({
  /** Re-draws the watermark, e.g. after switching the theme with a class on `<html>`. */
  render,
})
</script>

<template>
  <div
    v-bind="$attrs"
    ref="rootRef"
    class="am-watermark"
    :class="[{ 'am-watermark-full-page': fullPage }, rootClass]"
  >
    <slot />
  </div>
</template>
