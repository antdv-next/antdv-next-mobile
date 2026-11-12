import type { ToastApi, ToastConfigOptions, ToastHandler, ToastIconType, ToastShowConfig } from './interface'
import { h, ref, shallowReactive, shallowRef } from 'vue'
import { inBrowser } from '../_util'
import { nextZIndex } from '../_util/hooks'
import { mountComponent } from '../_util/mount'
import ToastVue from './Toast.vue'

const DEFAULT_DURATION = 2000

const globalOptions = shallowReactive<ToastConfigOptions>({})

interface ToastState {
  id: number
  config: ToastShowConfig
}

let seed = 0
/** the toast being displayed; only one at a time */
const current = shallowRef<ToastState>()
/** the last displayed config: kept while the leave animation runs */
const displayed = shallowRef<ToastShowConfig>({})
const open = ref(false)
const zIndex = ref<number>()
let timer: ReturnType<typeof setTimeout> | undefined
let holder: { unmount: () => void, instance?: any } | undefined
/** `afterClose` callbacks waiting for the leave animation */
let pendingAfterClose: Array<() => void> = []

function flushAfterClose() {
  const list = pendingAfterClose
  pendingAfterClose = []
  list.forEach(fn => fn())
}

function ensureHolder() {
  if (holder) {
    const el: HTMLElement | undefined = holder.instance?.nativeElement
    // still attached (or not rendered yet): reuse it
    if (!el || el.isConnected)
      return
    holder.unmount()
    holder = undefined
  }
  const created: { unmount: () => void, instance?: any } = { unmount: () => {} }
  holder = created
  const mounted = mountComponent(() => {
    const config = displayed.value
    return h(ToastVue, {
      open: open.value,
      content: config.content,
      icon: config.icon,
      position: config.position ?? globalOptions.position ?? 'center',
      maskClickable: config.maskClickable ?? globalOptions.maskClickable ?? true,
      zIndex: zIndex.value,
      getContainer: globalOptions.getContainer,
      rootClass: config.class,
      rootStyle: config.style,
      onAfterClose: flushAfterClose,
      ref: (instance: any) => {
        if (instance)
          created.instance = instance
      },
    })
  }, globalOptions.appContext)
  created.unmount = mounted.unmount
}

function closeCurrent() {
  clearTimeout(timer)
  timer = undefined
  const state = current.value
  if (!state)
    return
  current.value = undefined
  if (state.config.afterClose)
    pendingAfterClose.push(state.config.afterClose)
}

function clear() {
  closeCurrent()
  if (open.value)
    open.value = false
  else
    flushAfterClose()
}

function normalize(config: ToastShowConfig | string | undefined): ToastShowConfig {
  if (config === undefined)
    return {}
  return typeof config === 'string' ? { content: config } : config
}

function show(input: ToastShowConfig | string): ToastHandler {
  const config = normalize(input)
  if (!inBrowser)
    return { close() {} }

  // a new toast replaces the current one without a leave / enter flicker
  const replaced = !!current.value
  closeCurrent()

  const state: ToastState = { id: ++seed, config }
  current.value = state
  displayed.value = config
  zIndex.value = nextZIndex()
  ensureHolder()
  open.value = true

  const close = () => {
    if (current.value === state)
      clear()
  }
  const duration = config.duration ?? globalOptions.duration ?? DEFAULT_DURATION
  if (duration > 0)
    timer = setTimeout(close, duration)

  // the replaced toast never plays a leave animation: report it as closed right away
  if (replaced)
    flushAfterClose()

  return { close }
}

function withIcon(icon: ToastIconType, defaults?: ToastShowConfig) {
  return (input?: ToastShowConfig | string): ToastHandler =>
    show({ icon, ...defaults, ...normalize(input) })
}

const Toast: ToastApi = {
  show,
  success: withIcon('success'),
  fail: withIcon('fail'),
  loading: withIcon('loading', { duration: 0, maskClickable: false }),
  clear,
  config(options) {
    Object.assign(globalOptions, options)
  },
}

export default Toast
