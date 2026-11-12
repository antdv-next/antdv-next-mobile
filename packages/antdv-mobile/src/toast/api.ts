import type { Component } from 'vue'
import type { ToastApi, ToastConfigOptions, ToastHandler, ToastIconType, ToastInstance, ToastShowConfig } from './interface'
import { defineComponent, h, ref, shallowReactive, shallowRef } from 'vue'
import { inBrowser } from '../_util'
import { nextZIndex } from '../_util/hooks'
import { mountComponent } from '../_util/mount'
import ToastVue from './Toast.vue'

const DEFAULT_DURATION = 2000

interface ToastState {
  id: number
  config: ToastShowConfig
}

interface Manager extends ToastInstance {
  /** props for the toast component */
  holderProps: () => Record<string, any>
}

let seed = 0

function normalize(config: ToastShowConfig | string | undefined): ToastShowConfig {
  if (config === undefined)
    return {}
  return typeof config === 'string' ? { content: config } : config
}

/** One toast slot (only one toast at a time): the static api owns one, every `useToast()` call another. */
function createManager(options: ToastConfigOptions, ensureHolder: (holderProps: () => Record<string, any>) => void): Manager {
  /** the toast being displayed */
  const current = shallowRef<ToastState>()
  /** the last displayed config: kept while the leave animation runs */
  const displayed = shallowRef<ToastShowConfig>({})
  const open = ref(false)
  const zIndex = ref<number>()
  let timer: ReturnType<typeof setTimeout> | undefined
  /** `afterClose` callbacks waiting for the leave animation */
  let pendingAfterClose: Array<() => void> = []

  function flushAfterClose() {
    const list = pendingAfterClose
    pendingAfterClose = []
    list.forEach(fn => fn())
  }

  const holderProps = () => {
    const config = displayed.value
    return {
      open: open.value,
      content: config.content,
      icon: config.icon,
      position: config.position ?? options.position ?? 'center',
      maskClickable: config.maskClickable ?? options.maskClickable ?? true,
      zIndex: zIndex.value,
      getContainer: options.getContainer,
      rootClass: config.class,
      rootStyle: config.style,
      onAfterClose: flushAfterClose,
    }
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
    ensureHolder(holderProps)
    open.value = true

    const close = () => {
      if (current.value === state)
        clear()
    }
    const duration = config.duration ?? options.duration ?? DEFAULT_DURATION
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

  return {
    show,
    success: withIcon('success'),
    fail: withIcon('fail'),
    loading: withIcon('loading', { duration: 0, maskClickable: false }),
    clear,
    holderProps,
  }
}

// ---------- static api ----------
const globalOptions = shallowReactive<ToastConfigOptions>({})
let holder: { unmount: () => void, instance?: any } | undefined

function ensureStaticHolder(holderProps: () => Record<string, any>) {
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
  const mounted = mountComponent(() => h(ToastVue, {
    ...holderProps(),
    ref: (instance: any) => {
      if (instance)
        created.instance = instance
    },
  }), globalOptions.appContext)
  created.unmount = mounted.unmount
}

const staticManager = createManager(globalOptions, ensureStaticHolder)

function pickInstance(manager: Manager): ToastInstance {
  const { show, success, fail, loading, clear } = manager
  return { show, success, fail, loading, clear }
}

/**
 * `const [toast, ContextHolder] = Toast.useToast()`: the toast is rendered where `<ContextHolder />` is placed,
 * so it keeps the ConfigProvider / provide context of the calling component.
 */
function useToast(config: ToastConfigOptions = {}): [ToastInstance, Component] {
  const manager = createManager(config, () => {})
  const ContextHolder = defineComponent({
    name: 'AmToastContextHolder',
    setup() {
      return () => h(ToastVue, manager.holderProps())
    },
  })
  return [pickInstance(manager), ContextHolder]
}

const Toast: ToastApi = {
  ...pickInstance(staticManager),
  config(options) {
    Object.assign(globalOptions, options)
  },
  useToast,
}

export default Toast
