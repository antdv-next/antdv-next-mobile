import type { Component } from 'vue'
import type { Key } from '../_util/type'
import type {
  NotificationApi,
  NotificationArgsProps,
  NotificationConfig,
  NotificationEdge,
  NotificationGlobalConfig,
  NotificationIconType,
  NotificationInstance,
  NotificationNotice,
  NotificationPlacement,
} from './interface'
import { defineComponent, h, shallowReactive, shallowRef } from 'vue'
import { inBrowser } from '../_util'
import { nextZIndex } from '../_util/hooks'
import { mountComponent } from '../_util/mount'
import NotificationHolder from './NotificationHolder.vue'

const DEFAULT_DURATION = 4.5

interface NoticeRecord {
  notice: NotificationNotice
  onClose?: () => void
  onClosableClose?: () => void
}

interface Manager extends NotificationInstance {
  /** props for the holder component */
  holderProps: () => Record<string, any>
}

let seed = 0

/** PC corner placements collapse to the edge they belong to */
function toEdge(placement: NotificationPlacement | undefined): NotificationEdge {
  return placement?.startsWith('bottom') ? 'bottom' : 'top'
}

function createManager(config: NotificationConfig, ensureHolder: (holderProps: () => Record<string, any>) => void): Manager {
  const notices = shallowRef<NotificationNotice[]>([])
  const zIndex = shallowRef<number>()
  const records = new Map<Key, NoticeRecord>()

  function remove(key: Key, callClose: boolean) {
    const record = records.get(key)
    if (!record)
      return
    records.delete(key)
    notices.value = notices.value.filter(n => n !== record.notice)
    if (callClose) {
      record.onClosableClose?.()
      record.onClose?.()
    }
  }

  const holderProps = () => ({
    notices: notices.value,
    zIndex: zIndex.value,
    top: config.top,
    bottom: config.bottom,
    stack: config.stack,
    getContainer: config.getContainer,
    onClose: (key: Key) => remove(key, true),
  })

  function open(args: NotificationArgsProps) {
    if (!inBrowser)
      return
    ensureHolder(holderProps)

    const key = args.key ?? `am-notification-${++seed}`
    const prev = records.get(key)

    const closableArg = args.closable ?? config.closable
    const closable = typeof closableArg === 'object' && closableArg !== null ? closableArg : undefined
    const closeIcon = closable?.closeIcon !== undefined
      ? closable.closeIcon
      : (args.closeIcon !== undefined ? args.closeIcon : config.closeIcon)
    const duration = args.duration ?? config.duration ?? DEFAULT_DURATION

    const notice: NotificationNotice = {
      id: prev?.notice.id ?? ++seed,
      key,
      // an updated notification stays on its edge unless a new placement is given
      placement: args.placement || !prev ? toEdge(args.placement ?? config.placement) : prev.notice.placement,
      times: (prev?.notice.times ?? -1) + 1,
      duration: typeof duration === 'number' && duration > 0 ? duration : 0,
      title: args.title,
      description: args.description,
      actions: args.actions,
      icon: args.icon,
      type: args.type,
      showProgress: args.showProgress ?? config.showProgress,
      pauseOnHover: args.pauseOnHover ?? config.pauseOnHover,
      closable: closableArg !== false,
      closeIcon,
      closeDisabled: closable?.disabled,
      role: args.role,
      class: args.class,
      style: args.style,
      classes: { ...config.classes, ...args.classes },
      styles: { ...config.styles, ...args.styles },
      props: args.props,
      onClick: args.onClick,
    }
    records.set(key, { notice, onClose: args.onClose, onClosableClose: closable?.onClose })

    if (prev) {
      notices.value = notices.value.map(n => (n === prev.notice ? notice : n))
      return
    }
    zIndex.value = nextZIndex()
    notices.value = [...notices.value, notice]
    const { maxCount } = config
    if (typeof maxCount === 'number' && maxCount > 0) {
      while (notices.value.length > maxCount)
        remove(notices.value[0].key, true)
    }
  }

  function destroy(key?: Key) {
    if (key !== undefined) {
      remove(key, false)
      return
    }
    Array.from(records.keys()).forEach(k => remove(k, false))
  }

  const typeOpen = (type: NotificationIconType) => (args: NotificationArgsProps) => open({ ...args, type })

  return {
    open,
    destroy,
    success: typeOpen('success'),
    error: typeOpen('error'),
    info: typeOpen('info'),
    warning: typeOpen('warning'),
    holderProps,
  }
}

// ---------- static api ----------
const globalOptions = shallowReactive<NotificationGlobalConfig>({})
let holder: { unmount: () => void, instance: any } | undefined

function ensureStaticHolder(holderProps: () => Record<string, any>) {
  if (holder) {
    const el: HTMLElement | undefined = holder.instance?.nativeElement
    // the holder is still attached (or not rendered yet): reuse it
    if (!el || el.isConnected)
      return
    holder.unmount()
    holder = undefined
  }
  const current: { unmount: () => void, instance: any } = { unmount: () => {}, instance: undefined }
  holder = current
  const mounted = mountComponent(
    () => h(NotificationHolder, {
      ...holderProps(),
      ref: (instance: any) => {
        if (instance)
          current.instance = instance
      },
    }),
    globalOptions.appContext,
  )
  current.unmount = mounted.unmount
}

const staticManager: Manager = createManager(globalOptions, ensureStaticHolder)

function pickInstance(manager: Manager): NotificationInstance {
  const { open, destroy, success, error, info, warning } = manager
  return { open, destroy, success, error, info, warning }
}

function useNotification(config: NotificationConfig = {}): [NotificationInstance, Component] {
  const manager = createManager(config, () => {})
  const ContextHolder = defineComponent({
    name: 'AmNotificationContextHolder',
    setup() {
      return () => h(NotificationHolder, manager.holderProps())
    },
  })
  return [pickInstance(manager), ContextHolder]
}

const notification: NotificationApi = {
  ...pickInstance(staticManager),
  config(options) {
    Object.assign(globalOptions, options)
  },
  useNotification,
}

export default notification
