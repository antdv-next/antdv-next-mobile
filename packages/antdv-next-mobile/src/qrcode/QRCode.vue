<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { QRCodeExcavation, QRCodeMatrix } from './encoder'
import type { QRCodeEmits, QRCodeProps, QRCodeSlots, QRCodeStatusRenderInfo } from './interface'
import { ReloadOutlined } from '@antdv-next/icons'
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { Spinner } from '../_base'
import { addUnit, isNumeric } from '../_util'
import RenderNode from '../_util/RenderNode'
import { mergeAttrsStyle } from '../_util/vnode'
import Button from '../button'
import { useConfig } from '../config-provider/context'
import { useLocale } from '../locale'
import { encodeQRCode, excavateModules, generatePath } from './encoder'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmQrcode', inheritAttrs: false })

const props = withDefaults(defineProps<QRCodeProps>(), {
  type: 'canvas',
  size: 160,
  iconSize: 40,
  marginSize: 0,
  bordered: true,
  errorLevel: 'M',
  boostLevel: true,
  status: 'active',
})
const emit = defineEmits<QRCodeEmits>()
defineSlots<QRCodeSlots>()

const DEFAULT_SIZE = 160
const TRANSPARENT_REGEX = /^(?:transparent|rgba\(\s*0,\s*0,\s*0,\s*0\s*\))$/

const instance = getCurrentInstance()
const config = useConfig()
const locale = useLocale('QRCode')

const rootRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
const svgRef = ref<SVGSVGElement>()
const imageRef = ref<HTMLImageElement>()
/** Rendered width of the QR code (css px), measured after mount */
const measuredSize = ref(0)
const loadedIcon = shallowRef<string>()

/* ----------------------------------- matrix ----------------------------------- */

const hasValue = computed(() => (Array.isArray(props.value) ? props.value.some(Boolean) : !!props.value))

const matrix = computed<QRCodeMatrix | null>(() => {
  if (!hasValue.value)
    return null
  try {
    return encodeQRCode(props.value!, { errorLevel: props.errorLevel, boostLevel: props.boostLevel })
  }
  catch (error) {
    console.error(error)
    return null
  }
})

const margin = computed(() => Math.max(Math.floor(Number(props.marginSize)) || 0, 0))
const numCells = computed(() => (matrix.value ? matrix.value.size + margin.value * 2 : 0))

/** Width the icon size (px) refers to */
const contentSize = computed(() => {
  if (measuredSize.value > 0)
    return measuredSize.value
  return isNumeric(props.size) && Number(props.size) > 0 ? Number(props.size) : DEFAULT_SIZE
})

interface IconBox {
  x: number
  y: number
  w: number
  h: number
  excavation: QRCodeExcavation
}

/** Icon position in module units, centered, with the modules below it removed */
const iconBox = computed<IconBox | null>(() => {
  const code = matrix.value
  if (!code || !props.icon)
    return null
  const { iconSize } = props
  const width = typeof iconSize === 'number' ? iconSize : (iconSize?.width ?? 40)
  const height = typeof iconSize === 'number' ? iconSize : (iconSize?.height ?? 40)
  const scale = numCells.value / contentSize.value
  const w = width * scale
  const h = height * scale
  const x = code.size / 2 - w / 2
  const y = code.size / 2 - h / 2
  const floorX = Math.floor(x)
  const floorY = Math.floor(y)
  return {
    x,
    y,
    w,
    h,
    excavation: { x: floorX, y: floorY, w: Math.ceil(w + x - floorX), h: Math.ceil(h + y - floorY) },
  }
})

const iconReady = computed(() => !!props.icon && loadedIcon.value === props.icon)

const cells = computed(() => {
  const code = matrix.value
  if (!code)
    return []
  // canvas: only excavate once the image is there, so a broken icon never leaves a hole
  const excavate = iconBox.value && (props.type === 'svg' || iconReady.value)
  return excavate ? excavateModules(code.modules, iconBox.value!.excavation) : code.modules
})

const svgPath = computed(() => (props.type === 'svg' ? generatePath(cells.value, margin.value) : ''))

/* ----------------------------------- canvas ----------------------------------- */

function resolveColors() {
  const root = rootRef.value
  const computedStyle = root && typeof getComputedStyle === 'function' ? getComputedStyle(root) : undefined
  const background = props.bgColor || computedStyle?.backgroundColor || ''
  return {
    // The defaults are css variables so that they follow the theme: read their resolved values.
    color: props.color || computedStyle?.color || '#000',
    background: TRANSPARENT_REGEX.test(background) ? '' : background,
  }
}

function measure() {
  const el = props.type === 'canvas' ? canvasRef.value : svgRef.value
  const width = el?.clientWidth ?? 0
  if (width > 0)
    measuredSize.value = width
}

function draw() {
  const canvas = canvasRef.value
  const count = numCells.value
  if (!canvas || !count || props.type !== 'canvas')
    return
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const ratio = window.devicePixelRatio || 1
  const pixels = Math.max(Math.round(contentSize.value * ratio), count)
  canvas.width = canvas.height = pixels

  const { color, background } = resolveColors()
  ctx.clearRect(0, 0, pixels, pixels)
  if (background) {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, pixels, pixels)
  }

  // Module edges are snapped to device pixels: crisp, and no seams between neighbours
  const scale = pixels / count
  const edge = (index: number) => Math.round(index * scale)
  const offset = margin.value
  ctx.fillStyle = color
  cells.value.forEach((row, y) => {
    const top = edge(y + offset)
    const height = edge(y + offset + 1) - top
    let start = -1
    for (let x = 0; x <= row.length; x++) {
      const dark = x < row.length && row[x]
      if (dark && start < 0) {
        start = x
      }
      else if (!dark && start >= 0) {
        const left = edge(start + offset)
        ctx.fillRect(left, top, edge(x + offset) - left, height)
        start = -1
      }
    }
  })

  const image = imageRef.value
  const box = iconBox.value
  if (box && image && iconReady.value && image.naturalWidth !== 0 && image.naturalHeight !== 0)
    ctx.drawImage(image, (box.x + offset) * scale, (box.y + offset) * scale, box.w * scale, box.h * scale)
}

async function render() {
  await nextTick()
  measure()
  draw()
}

function handleIconLoad() {
  loadedIcon.value = props.icon
}

let resizeObserver: ResizeObserver | undefined

function observe() {
  resizeObserver?.disconnect()
  if (typeof ResizeObserver === 'undefined' || !rootRef.value)
    return
  resizeObserver = new ResizeObserver(() => {
    const before = measuredSize.value
    measure()
    if (measuredSize.value !== before)
      draw()
  })
  resizeObserver.observe(rootRef.value)
}

onMounted(() => {
  observe()
  render()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = undefined
})

// The root is not rendered without a value
watch(hasValue, () => nextTick(observe), { flush: 'post' })

watch(
  () => [
    cells.value,
    numCells.value,
    iconBox.value,
    iconReady.value,
    props.type,
    props.size,
    props.color,
    props.bgColor,
    props.bordered,
    // re-draw with the new default colors when the theme changes
    config.theme.value,
  ],
  render,
  { flush: 'post' },
)

/* ----------------------------------- status ----------------------------------- */

function handleRefresh() {
  emit('refresh')
}

// Same as PC: the refresh action only shows up when somebody listens
function hasRefreshListener() {
  return !!instance?.vnode.props?.onRefresh
}

function getStatusInfo(): QRCodeStatusRenderInfo {
  return {
    status: props.status as QRCodeStatusRenderInfo['status'],
    locale: locale.value,
    onRefresh: hasRefreshListener() ? handleRefresh : undefined,
  }
}

/* ------------------------------------ root ------------------------------------ */

const classNames = computed(() => [
  'am-qrcode',
  {
    'am-qrcode-borderless': !props.bordered,
    [`am-qrcode-status-${props.status}`]: props.status !== 'active',
  },
  props.rootClass,
  props.classes?.root,
])

const rootStyle = computed<CSSProperties>(() => {
  return {
    // the square comes from `aspect-ratio`, so css lengths such as `100%` work too
    width: addUnit(props.size),
    backgroundColor: props.bgColor,
    color: props.color,
    ...props.styles?.root,
  }
})

/* ----------------------------------- expose ----------------------------------- */

function toDataURL(type?: string, quality?: number): string | undefined {
  if (props.type === 'canvas')
    return canvasRef.value?.toDataURL(type, quality)
  const svg = svgRef.value
  if (!svg)
    return undefined
  // A standalone image has no theme: write the resolved colors and a size into the copy
  const clone = svg.cloneNode(true) as SVGSVGElement
  const { color, background } = resolveColors()
  const size = String(contentSize.value)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', size)
  clone.setAttribute('height', size)
  clone.querySelector('.am-qrcode-svg-bg')?.setAttribute('fill', background || 'none')
  clone.querySelector('.am-qrcode-svg-fg')?.setAttribute('fill', color)
  const markup = new XMLSerializer().serializeToString(clone)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
}

defineExpose({
  /** The root element */
  nativeElement: rootRef,
  toDataURL,
})
</script>

<template>
  <div
    v-if="matrix"
    v-bind="$attrs"
    ref="rootRef"
    :class="classNames"
    :style="mergeAttrsStyle(rootStyle, $attrs.style)"
  >
    <div
      v-if="status !== 'active'"
      class="am-qrcode-cover"
      :class="classes?.cover"
      :style="styles?.cover"
    >
      <slot name="statusRender" v-bind="getStatusInfo()">
        <RenderNode v-if="statusRender" :node="statusRender" :params="getStatusInfo()" />
        <Spinner v-else-if="status === 'loading'" class="am-qrcode-loading" />
        <template v-else-if="status === 'expired'">
          <p class="am-qrcode-expired">
            {{ locale.expired }}
          </p>
          <Button v-if="hasRefreshListener()" class="am-qrcode-refresh" type="link" size="small" @click="handleRefresh">
            <template #icon>
              <ReloadOutlined />
            </template>
            {{ locale.refresh }}
          </Button>
        </template>
        <p v-else class="am-qrcode-scanned">
          {{ locale.scanned }}
        </p>
      </slot>
    </div>
    <template v-if="type === 'canvas'">
      <canvas ref="canvasRef" class="am-qrcode-canvas" role="img" :title="title" :aria-label="title" />
      <img
        v-if="icon"
        ref="imageRef"
        :key="icon"
        class="am-qrcode-icon"
        :src="icon"
        crossorigin="anonymous"
        alt=""
        aria-hidden="true"
        @load="handleIconLoad"
      >
    </template>
    <svg
      v-else
      ref="svgRef"
      class="am-qrcode-svg"
      :viewBox="`0 0 ${numCells} ${numCells}`"
      role="img"
      :aria-label="title"
    >
      <title v-if="title">{{ title }}</title>
      <path
        class="am-qrcode-svg-bg"
        :fill="bgColor || 'none'"
        :d="`M0,0h${numCells}v${numCells}H0z`"
        shape-rendering="crispEdges"
      />
      <path class="am-qrcode-svg-fg" :fill="color || 'currentColor'" :d="svgPath" shape-rendering="crispEdges" />
      <image
        v-if="icon && iconBox"
        :href="icon"
        :x="iconBox.x + margin"
        :y="iconBox.y + margin"
        :width="iconBox.w"
        :height="iconBox.h"
        preserveAspectRatio="none"
        crossorigin="anonymous"
      />
    </svg>
  </div>
</template>
