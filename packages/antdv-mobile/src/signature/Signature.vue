<script setup lang="ts">
import type { SignatureConfirmResult, SignatureEmits, SignatureExpose, SignatureProps, SignatureSlots } from './interface'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { isRenderable } from '../_util'
import { useEventListener, useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import Button from '../button/Button.vue'
import { useDisabled } from '../config-provider/context'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSignature', inheritAttrs: false })

const props = withDefaults(defineProps<SignatureProps>(), {
  lineWidth: 3,
  type: 'png',
  quality: 0.92,
  disabled: undefined,
  placeholder: undefined,
  tips: undefined,
  clearText: undefined,
  confirmText: undefined,
  footer: undefined,
})
const emit = defineEmits<SignatureEmits>()
const slots = defineSlots<SignatureSlots>()

type Point = [x: number, y: number]

interface Stroke {
  color: string
  width: number
  points: Point[]
}

/** Only used when the theme color cannot be resolved (no layout engine). */
const FALLBACK_PEN_COLOR = '#000'
/** jpg has no alpha channel: without a background the image would be black. */
const JPG_BACKGROUND = '#fff'
/** Mouse events emulated by the browser after a touch are ignored for this long. */
const EMULATED_MOUSE_DELAY = 500

const locale = useLocale('Signature')
const disabled = useDisabled(() => props.disabled)
const touch = useTouch()

const canvasRef = ref<HTMLCanvasElement>()
const supported = ref(true)
const empty = ref(true)
const signing = ref(false)

let ctx: CanvasRenderingContext2D | null = null
let strokes: Stroke[] = []
let current: Stroke | undefined
let origin: Point = [0, 0]
let lastTouchTime = 0
let observer: ResizeObserver | undefined

// ---------- drawing ----------
function middle(a: Point, b: Point): Point {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}

function applyStyle(stroke: Stroke) {
  if (!ctx)
    return
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = stroke.width
  ctx.strokeStyle = stroke.color
  ctx.fillStyle = stroke.color
}

/** Draws the curve that ends half way between point `index - 1` and `index` (quadratic smoothing). */
function drawSegment(stroke: Stroke, index: number) {
  if (!ctx || index < 1)
    return
  const { points } = stroke
  const control = points[index - 1]
  const from = index === 1 ? control : middle(points[index - 2], control)
  const to = middle(control, points[index])
  ctx.beginPath()
  ctx.moveTo(from[0], from[1])
  ctx.quadraticCurveTo(control[0], control[1], to[0], to[1])
  ctx.stroke()
}

/** Closes a stroke: a dot for a tap, otherwise the remaining half segment. */
function drawEnd(stroke: Stroke) {
  if (!ctx)
    return
  const { points } = stroke
  const last = points[points.length - 1]
  ctx.beginPath()
  if (points.length === 1) {
    ctx.arc(last[0], last[1], stroke.width / 2, 0, Math.PI * 2)
    ctx.fill()
    return
  }
  const from = middle(points[points.length - 2], last)
  ctx.moveTo(from[0], from[1])
  ctx.lineTo(last[0], last[1])
  ctx.stroke()
}

function redraw() {
  strokes.forEach((stroke) => {
    applyStyle(stroke)
    for (let i = 1; i < stroke.points.length; i++)
      drawSegment(stroke, i)
    if (stroke !== current)
      drawEnd(stroke)
  })
}

function wipe() {
  const canvas = canvasRef.value
  if (!canvas || !ctx)
    return
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
}

// ---------- size ----------
/** Backing store = css size * devicePixelRatio. Resizing a canvas wipes it, so the strokes are replayed. */
function fit(force = false) {
  const canvas = canvasRef.value
  if (!canvas)
    return
  const rect = canvas.getBoundingClientRect()
  const ratio = window.devicePixelRatio || 1
  const width = Math.round(rect.width * ratio)
  const height = Math.round(rect.height * ratio)
  // hidden (display: none): keep the current bitmap until it is visible again
  if (!force && (!width || !height || (canvas.width === width && canvas.height === height)))
    return
  canvas.width = width
  canvas.height = height
  if (ctx) {
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    redraw()
  }
}

function resize() {
  fit(true)
}

function resolvePenColor() {
  if (props.penColor)
    return props.penColor
  const canvas = canvasRef.value
  // `color` of the canvas is the `--am-signature-pen-color` token: follows the theme (dark mode)
  const color = canvas ? getComputedStyle(canvas).color : ''
  return color && !color.includes('var(') ? color : FALLBACK_PEN_COLOR
}

// ---------- gesture ----------
function startStroke(x: number, y: number, event: TouchEvent | MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas || !ctx)
    return false
  fit()
  const rect = canvas.getBoundingClientRect()
  origin = [rect.left, rect.top]
  current = { color: resolvePenColor(), width: props.lineWidth, points: [[x - origin[0], y - origin[1]]] }
  strokes.push(current)
  applyStyle(current)
  signing.value = true
  empty.value = false
  emit('start', event)
  return true
}

function moveStroke(x: number, y: number, event: TouchEvent | MouseEvent) {
  if (!current)
    return
  const point: Point = [x - origin[0], y - origin[1]]
  const last = current.points[current.points.length - 1]
  if (last[0] === point[0] && last[1] === point[1])
    return
  current.points.push(point)
  drawSegment(current, current.points.length - 1)
  emit('signing', event)
}

function endStroke(event: TouchEvent | MouseEvent) {
  if (!current)
    return
  const stroke = current
  current = undefined
  drawEnd(stroke)
  signing.value = false
  emit('end', event)
}

function handleTouchStart(event: TouchEvent) {
  lastTouchTime = Date.now()
  if (disabled.value || current)
    return
  touch.start(event)
  if (startStroke(touch.startX.value, touch.startY.value, event) && event.cancelable)
    event.preventDefault()
}

function handleTouchMove(event: TouchEvent) {
  if (!current)
    return
  if (event.cancelable)
    event.preventDefault()
  touch.move(event)
  moveStroke(touch.startX.value + touch.deltaX.value, touch.startY.value + touch.deltaY.value, event)
}

function handleTouchEnd(event: TouchEvent) {
  lastTouchTime = Date.now()
  endStroke(event)
}

// mouse support, so the signature also works in desktop browsers
function handleMouseMove(event: MouseEvent) {
  moveStroke(event.clientX, event.clientY, event)
}

function removeMouseListeners() {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

function handleMouseUp(event: MouseEvent) {
  removeMouseListeners()
  endStroke(event)
}

function handleMouseDown(event: MouseEvent) {
  if (disabled.value || current || event.button !== 0 || Date.now() - lastTouchTime < EMULATED_MOUSE_DELAY)
    return
  if (!startStroke(event.clientX, event.clientY, event))
    return
  event.preventDefault()
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// ---------- public api ----------
function isEmpty() {
  return empty.value
}

function reset() {
  strokes = []
  current = undefined
  signing.value = false
  empty.value = true
  removeMouseListeners()
  wipe()
}

function clear() {
  reset()
  emit('clear')
}

function toDataURL() {
  const canvas = canvasRef.value
  if (!canvas || !ctx || empty.value)
    return ''
  const isJpg = props.type === 'jpg'
  const background = props.backgroundColor || (isJpg ? JPG_BACKGROUND : '')
  let source = canvas
  if (background) {
    const copy = document.createElement('canvas')
    copy.width = canvas.width
    copy.height = canvas.height
    const copyCtx = copy.getContext('2d')
    if (copyCtx) {
      copyCtx.fillStyle = background
      copyCtx.fillRect(0, 0, copy.width, copy.height)
      copyCtx.drawImage(canvas, 0, 0)
      source = copy
    }
  }
  return (isJpg ? source.toDataURL('image/jpeg', props.quality) : source.toDataURL('image/png')) || ''
}

function confirm(): SignatureConfirmResult {
  const result: SignatureConfirmResult = { image: toDataURL(), canvas: canvasRef.value }
  emit('confirm', result)
  return result
}

function handleClear() {
  if (!disabled.value)
    clear()
}

function handleConfirm() {
  if (!disabled.value)
    confirm()
}

// ---------- lifecycle ----------
onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas)
    return
  try {
    ctx = canvas.getContext('2d')
  }
  catch {
    ctx = null
  }
  supported.value = !!ctx
  if (!ctx)
    return
  fit(true)
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => fit())
    observer.observe(canvas)
  }
})

useEventListener('resize', () => fit())

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = undefined
  removeMouseListeners()
})

const footerHidden = computed(() => !slots.footer && (props.footer === false || props.footer === null))
const showPlaceholder = computed(() => supported.value && empty.value && (!!slots.placeholder || isRenderable(props.placeholder)))
const footerContext = computed(() => ({ clear: handleClear, confirm: handleConfirm, empty: empty.value, disabled: disabled.value }))

defineExpose<SignatureExpose>({ clear, confirm, toDataURL, isEmpty, resize })
</script>

<template>
  <div
    v-bind="$attrs"
    class="am-signature"
    :class="[
      {
        'am-signature-disabled': disabled,
        'am-signature-empty': empty,
        'am-signature-signing': signing,
        'am-signature-unsupported': !supported,
      },
      rootClass,
      classes?.root,
    ]"
    :style="styles?.root"
  >
    <div class="am-signature-content" :class="classes?.content" :style="styles?.content">
      <canvas
        ref="canvasRef"
        class="am-signature-canvas"
        :class="classes?.canvas"
        :style="styles?.canvas"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
        @mousedown="handleMouseDown"
      />
      <div
        v-if="!supported"
        class="am-signature-placeholder am-signature-tips"
        :class="classes?.placeholder"
        :style="styles?.placeholder"
      >
        <slot name="tips">
          <RenderNode v-if="isRenderable(tips)" :node="tips" />
          <template v-else>
            {{ locale.tips }}
          </template>
        </slot>
      </div>
      <div
        v-else-if="showPlaceholder"
        class="am-signature-placeholder"
        :class="classes?.placeholder"
        :style="styles?.placeholder"
      >
        <slot name="placeholder">
          <RenderNode :node="placeholder" />
        </slot>
      </div>
    </div>
    <div v-if="!footerHidden" class="am-signature-footer" :class="classes?.footer" :style="styles?.footer">
      <slot name="footer" v-bind="footerContext">
        <RenderNode v-if="isRenderable(footer)" :node="footer" />
        <template v-else>
          <Button class="am-signature-clear" :disabled="disabled" @click="handleClear">
            <slot name="clearText">
              <RenderNode v-if="isRenderable(clearText)" :node="clearText" />
              <template v-else>
                {{ locale.clear }}
              </template>
            </slot>
          </Button>
          <Button class="am-signature-confirm" type="primary" :disabled="disabled" @click="handleConfirm">
            <slot name="confirmText">
              <RenderNode v-if="isRenderable(confirmText)" :node="confirmText" />
              <template v-else>
                {{ locale.confirm }}
              </template>
            </slot>
          </Button>
        </template>
      </slot>
    </div>
  </div>
</template>
