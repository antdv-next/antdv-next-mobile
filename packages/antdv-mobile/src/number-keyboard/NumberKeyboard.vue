<script setup lang="ts">
import type { NumberKeyboardEmits, NumberKeyboardKeyType, NumberKeyboardProps, NumberKeyboardSlots } from './interface'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Portal } from '../_base'
import { preventDefault, toArray } from '../_util'
import { nextZIndex, useClickAway, useControlled, useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmNumberKeyboard', inheritAttrs: false })

const props = withDefaults(defineProps<NumberKeyboardProps>(), {
  open: undefined,
  defaultOpen: undefined,
  title: undefined,
  theme: 'default',
  randomKeyOrder: false,
  showDeleteKey: true,
  hideOnClickOutside: true,
  safeArea: true,
  poppable: true,
  getContainer: undefined,
})
const emit = defineEmits<NumberKeyboardEmits>()
const slots = defineSlots<NumberKeyboardSlots>()

interface KeyConfig {
  text: string
  type: NumberKeyboardKeyType
  /** columns taken by the key (custom theme bottom row) */
  span?: number
}

const LONG_PRESS_DELAY = 500
const REPEAT_INTERVAL = 100

const locale = useLocale('NumberKeyboard')
const touch = useTouch()
const rootRef = ref<HTMLElement>()

// ---------- state ----------
const [open, setOpenState] = useControlled<NumberKeyboardProps, 'open', boolean>(props, 'open', {
  // an inline keyboard is visible unless it is explicitly closed
  defaultValue: () => props.defaultOpen ?? !props.poppable,
  onChange: (value) => {
    emit('update:open', value)
    emit('openChange', value)
  },
})
const [value, setValue] = useControlled<NumberKeyboardProps, 'value', string>(props, 'value', {
  defaultValue: () => props.defaultValue ?? '',
  onChange: val => emit('update:value', val),
})

const rendered = ref(open.value)
const zIndex = ref<number | undefined>(props.zIndex)

function hide() {
  if (open.value)
    setOpenState(false)
}

// ---------- keys ----------
function shuffle<T>(list: T[]) {
  const result = list.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const ordered = Array.from({ length: 9 }, (_, index) => String(index + 1))
const digits = ref(props.randomKeyOrder ? shuffle(ordered) : ordered)

watch(
  open,
  (val) => {
    if (!val)
      return
    rendered.value = true
    if (props.poppable)
      zIndex.value = props.zIndex ?? nextZIndex()
    if (props.randomKeyOrder)
      digits.value = shuffle(ordered)
  },
  { immediate: true },
)
watch(() => props.randomKeyOrder, (random) => {
  digits.value = random ? shuffle(ordered) : ordered
})
watch(() => props.zIndex, (val) => {
  if (val !== undefined)
    zIndex.value = val
})

const extraKeys = computed(() => toArray(props.extraKey).map(String))

const keys = computed<KeyConfig[]>(() => {
  const list: KeyConfig[] = digits.value.map(text => ({ text, type: 'digit' }))
  const extras = extraKeys.value
  if (props.theme === 'custom') {
    if (extras.length === 0)
      list.push({ text: '0', type: 'digit', span: 3 })
    else if (extras.length === 1)
      list.push({ text: '0', type: 'digit', span: 2 }, { text: extras[0], type: 'extra' })
    else
      list.push({ text: extras[0], type: 'extra' }, { text: '0', type: 'digit' }, { text: extras[1], type: 'extra' })
    return list
  }
  const extra = extras[0] ?? ''
  list.push(
    { text: extra, type: extra || slots.extraKey ? 'extra' : 'blank' },
    { text: '0', type: 'digit' },
    { text: '', type: props.showDeleteKey ? 'delete' : 'blank' },
  )
  return list
})

const sideKeys = computed<KeyConfig[]>(() => {
  const list: KeyConfig[] = []
  if (props.showDeleteKey)
    list.push({ text: '', type: 'delete' })
  list.push({ text: props.confirmText ?? locale.value.done, type: 'confirm' })
  return list
})

const showHeader = computed(() =>
  props.title !== undefined || !!slots.title || (props.theme === 'default' && !!props.closeButtonText))

// ---------- pressing ----------
function press(key: KeyConfig) {
  switch (key.type) {
    case 'blank':
      break
    case 'delete':
      emit('delete')
      if (value.value)
        setValue(value.value.slice(0, -1))
      break
    case 'confirm':
      emit('confirm')
      onClose()
      break
    default:
      if (!key.text || (props.maxlength !== undefined && value.value.length >= props.maxlength))
        break
      emit('input', key.text)
      setValue(value.value + key.text)
  }
}

function onClose() {
  emit('close')
  hide()
}

/** key under the finger, for press feedback */
const activeKey = shallowRef<KeyConfig>()
let repeatTimer: ReturnType<typeof setTimeout> | undefined
let repeated = false
/** time of the last touchend, to drop the click a browser still fires after it */
let lastTouchEnd = 0
const GHOST_CLICK_DELAY = 500

function stopRepeat() {
  clearTimeout(repeatTimer)
  repeatTimer = undefined
}

function onTouchStart(key: KeyConfig, event: TouchEvent) {
  touch.start(event)
  activeKey.value = key
  repeated = false
  stopRepeat()
  if (key.type === 'delete') {
    // hold to keep deleting
    const repeat = () => {
      repeated = true
      press(key)
      repeatTimer = setTimeout(repeat, REPEAT_INTERVAL)
    }
    repeatTimer = setTimeout(repeat, LONG_PRESS_DELAY)
  }
}

function onTouchMove(event: TouchEvent) {
  touch.move(event)
  if (!touch.isTap.value) {
    activeKey.value = undefined
    stopRepeat()
  }
}

function onTouchEnd(key: KeyConfig, event: TouchEvent) {
  stopRepeat()
  lastTouchEnd = Date.now()
  if (activeKey.value !== key)
    return
  activeKey.value = undefined
  // handled here: no delayed click, and the focused element keeps its focus
  preventDefault(event)
  if (!repeated)
    press(key)
}

function onClick(key: KeyConfig) {
  // the touch already pressed the key: `preventDefault` on touchend does not stop the click
  // everywhere (desktop touch emulation, synthetic touch events)
  if (Date.now() - lastTouchEnd < GHOST_CLICK_DELAY)
    return
  press(key)
}

function onTouchCancel() {
  activeKey.value = undefined
  stopRepeat()
}

onBeforeUnmount(stopRepeat)

// ---------- outside ----------
let lastTouch = 0
function onOutside(event: Event) {
  if (event.type === 'touchstart')
    lastTouch = Date.now()
  // ignore the mouse event emulated after a touch
  else if (Date.now() - lastTouch < 500)
    return
  emit('blur')
  hide()
}
const hideOnOutside = () => !!open.value && props.poppable && props.hideOnClickOutside
useClickAway(rootRef, onOutside, { eventName: 'touchstart', enabled: hideOnOutside })
useClickAway(rootRef, onOutside, { eventName: 'mousedown', enabled: hideOnOutside })

// ---------- structure ----------

const classNames = computed(() => [
  'am-number-keyboard',
  `am-number-keyboard-${props.theme}`,
  {
    'am-number-keyboard-fixed': props.poppable,
    'am-number-keyboard-safe-area': props.safeArea && props.poppable,
    'am-number-keyboard-with-header': showHeader.value,
  },
  props.rootClass,
  props.classes?.root,
])

function keyClass(key: KeyConfig) {
  return [
    `am-number-keyboard-key-${key.type}`,
    { 'am-number-keyboard-key-active': activeKey.value === key },
    props.classes?.key,
  ]
}
</script>

<template>
  <Portal v-slot="{ theme: scope }" :get-container="poppable ? getContainer : false">
    <Transition :name="poppable ? 'am-slide-bottom' : undefined" :css="poppable" appear>
      <div
        v-if="rendered"
        v-show="open"
        ref="rootRef"
        v-bind="$attrs"
        :class="[classNames, scope.class]"
        :style="[scope.style, { zIndex: poppable ? zIndex : undefined }, styles?.root]"
        :dir="scope.dir"
        @mousedown.prevent
      >
        <div v-if="showHeader" class="am-number-keyboard-header" :class="classes?.header" :style="styles?.header">
          <div class="am-number-keyboard-title">
            <slot name="title">
              <RenderNode :node="title" />
            </slot>
          </div>
          <button v-if="theme === 'default' && closeButtonText" type="button" class="am-number-keyboard-close" @click="onClose">
            {{ closeButtonText }}
          </button>
        </div>
        <div class="am-number-keyboard-body" :class="classes?.body" :style="styles?.body">
          <div class="am-number-keyboard-keys">
            <div
              v-for="(key, index) in keys"
              :key="index"
              class="am-number-keyboard-key-wrapper"
              :style="key.span ? { gridColumn: `span ${key.span}` } : undefined"
            >
              <div
                class="am-number-keyboard-key"
                :class="keyClass(key)"
                :style="styles?.key"
                :role="key.type === 'blank' ? undefined : 'button'"
                :aria-label="key.type === 'delete' ? locale.delete : undefined"
                @touchstart.passive="onTouchStart(key, $event)"
                @touchmove.passive="onTouchMove"
                @touchend="onTouchEnd(key, $event)"
                @touchcancel="onTouchCancel"
                @click="onClick(key)"
              >
                <template v-if="key.type === 'delete'">
                  <slot name="delete">
                    <svg
                      class="am-number-keyboard-delete-icon"
                      viewBox="0 0 32 22"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M11 1h17a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H11a3 3 0 0 1-2.2-1l-7.3-7.7a2 2 0 0 1 0-2.6L8.8 2A3 3 0 0 1 11 1z" />
                      <path d="M16 7l8 8M24 7l-8 8" />
                    </svg>
                  </slot>
                </template>
                <slot v-else-if="key.type === 'extra' && $slots.extraKey && theme === 'default'" name="extraKey">
                  {{ key.text }}
                </slot>
                <template v-else>
                  {{ key.text }}
                </template>
              </div>
            </div>
          </div>
          <div v-if="theme === 'custom'" class="am-number-keyboard-sidebar">
            <div v-for="key in sideKeys" :key="key.type" class="am-number-keyboard-key-wrapper">
              <div
                class="am-number-keyboard-key am-number-keyboard-key-large"
                :class="keyClass(key)"
                :style="styles?.key"
                role="button"
                :aria-label="key.type === 'delete' ? locale.delete : undefined"
                @touchstart.passive="onTouchStart(key, $event)"
                @touchmove.passive="onTouchMove"
                @touchend="onTouchEnd(key, $event)"
                @touchcancel="onTouchCancel"
                @click="onClick(key)"
              >
                <template v-if="key.type === 'delete'">
                  <slot name="delete">
                    {{ locale.delete }}
                  </slot>
                </template>
                <template v-else>
                  {{ key.text }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Portal>
</template>
