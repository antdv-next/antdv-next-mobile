import type { LoadingBarApi, LoadingBarConfigOptions, LoadingBarStatus } from './interface'
import { h, reactive, shallowReactive } from 'vue'
import { inBrowser } from '../_util'
import { nextZIndex } from '../_util/hooks'
import { mountComponent } from '../_util/mount'
import LoadingBarVue from './LoadingBar.vue'

/** the bar creeps towards this value while waiting */
const WAITING_PERCENT = 90
const TRICKLE_INTERVAL = 200
/** time the bar stays full before it fades (matches the width transition) */
const FILL_DURATION = 200
/** matches the opacity transition */
const FADE_DURATION = 300

const globalOptions = shallowReactive<LoadingBarConfigOptions>({})

const state = reactive({
  open: false,
  percent: 0,
  status: 'loading' as LoadingBarStatus,
  animated: false,
  leaving: false,
  zIndex: undefined as number | undefined,
})

let timer: ReturnType<typeof setTimeout> | undefined
let trickleTimer: ReturnType<typeof setInterval> | undefined
let holder: { unmount: () => void, instance?: any } | undefined

function clearTimers() {
  clearTimeout(timer)
  clearInterval(trickleTimer)
  timer = undefined
  trickleTimer = undefined
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
  const mounted = mountComponent(() => h(LoadingBarVue, {
    open: state.open,
    percent: state.percent,
    status: state.status,
    animated: state.animated,
    leaving: state.leaving,
    zIndex: globalOptions.zIndex ?? state.zIndex,
    color: globalOptions.color,
    errorColor: globalOptions.errorColor,
    height: globalOptions.height,
    top: globalOptions.top,
    getContainer: globalOptions.getContainer,
    ref: (instance: any) => {
      if (instance)
        created.instance = instance
    },
  }), globalOptions.appContext)
  created.unmount = mounted.unmount
}

function show(status: LoadingBarStatus, percent: number) {
  clearTimers()
  ensureHolder()
  state.status = status
  state.leaving = false
  state.animated = false
  state.percent = percent
  state.zIndex = nextZIndex()
  state.open = true
}

function start() {
  if (!inBrowser)
    return
  show('loading', 0)
  // let the empty bar render first so the first step is animated
  timer = setTimeout(() => {
    state.animated = true
    state.percent = 20
    trickleTimer = setInterval(() => {
      state.percent = Math.round((state.percent + (WAITING_PERCENT - state.percent) * 0.1) * 100) / 100
    }, TRICKLE_INTERVAL)
  }, 16)
}

function complete(status: LoadingBarStatus) {
  if (!inBrowser)
    return
  // an error is reported even when the bar was never started
  if (!state.open || state.leaving) {
    if (status !== 'error')
      return
    show('error', 0)
  }
  clearTimers()
  state.status = status
  timer = setTimeout(() => {
    state.animated = true
    state.percent = 100
    timer = setTimeout(() => {
      state.leaving = true
      timer = setTimeout(() => {
        state.open = false
        state.leaving = false
        state.animated = false
        state.percent = 0
        state.status = 'loading'
      }, FADE_DURATION)
    }, FILL_DURATION)
  }, 16)
}

const LoadingBar: LoadingBarApi = {
  start,
  finish: () => complete('loading'),
  error: () => complete('error'),
  config(options) {
    Object.assign(globalOptions, options)
  },
}

export default LoadingBar
