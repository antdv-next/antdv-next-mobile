import type { Component } from 'vue'
import type { Key } from '../_util/type'
import type {
  MessageApi,
  MessageArgsProps,
  MessageConfigOptions,
  MessageInstance,
  MessageJointContent,
  MessageNotice,
  MessageNoticeType,
  MessageType,
  MessageTypeOpen,
} from './interface'
import { defineComponent, h, isVNode, shallowReactive, shallowRef } from 'vue'
import { inBrowser } from '../_util'
import { nextZIndex } from '../_util/hooks'
import { mountComponent } from '../_util/mount'
import MessageVue from './Message.vue'

const DEFAULT_DURATION = 3

interface NoticeRecord {
  notice: MessageNotice
  onClose?: () => void
  resolvers: Array<(value: boolean) => void>
  timer?: ReturnType<typeof setTimeout>
}

interface Manager extends MessageInstance {
  /** props for the holder component */
  holderProps: () => Record<string, any>
}

let seed = 0

function isArgsProps(content: MessageJointContent): content is MessageArgsProps {
  return typeof content === 'object' && content !== null && !Array.isArray(content) && !isVNode(content) && 'content' in content
}

function createManager(config: MessageConfigOptions, ensureHolder: (holderProps: () => Record<string, any>) => void): Manager {
  const notices = shallowRef<MessageNotice[]>([])
  const zIndex = shallowRef<number>()
  const records = new Map<Key, NoticeRecord>()

  const holderProps = () => ({
    notices: notices.value,
    zIndex: zIndex.value,
    top: config.top,
    getContainer: config.getContainer,
  })

  function remove(key: Key, callClose: boolean) {
    const record = records.get(key)
    if (!record)
      return
    clearTimeout(record.timer)
    records.delete(key)
    notices.value = notices.value.filter(n => n !== record.notice)
    if (callClose)
      record.onClose?.()
    record.resolvers.forEach(resolve => resolve(true))
  }

  function open(args: MessageArgsProps): MessageType {
    const key = args.key ?? `am-message-${++seed}`
    let resolve!: (value: boolean) => void
    const promise = new Promise<boolean>((r) => {
      resolve = r
    })
    const close = () => remove(key, true)
    const result = close as MessageType
    result.then = (onFulfilled, onRejected) => promise.then(onFulfilled, onRejected)

    if (!inBrowser) {
      resolve(true)
      return result
    }
    ensureHolder(holderProps)

    const prev = records.get(key)
    clearTimeout(prev?.timer)
    const notice: MessageNotice = {
      id: prev?.notice.id ?? ++seed,
      key,
      content: args.content,
      type: args.type,
      icon: args.icon,
      class: args.class,
      style: args.style,
      onClick: args.onClick,
    }
    const record: NoticeRecord = {
      notice,
      onClose: args.onClose,
      resolvers: [...(prev?.resolvers ?? []), resolve],
    }
    records.set(key, record)

    if (prev) {
      notices.value = notices.value.map(n => (n === prev.notice ? notice : n))
    }
    else {
      zIndex.value = nextZIndex()
      notices.value = [...notices.value, notice]
      const { maxCount } = config
      if (typeof maxCount === 'number' && maxCount > 0) {
        while (notices.value.length > maxCount)
          remove(notices.value[0].key, true)
      }
    }

    const duration = args.duration ?? config.duration ?? DEFAULT_DURATION
    if (duration > 0)
      record.timer = setTimeout(close, duration * 1000)

    return result
  }

  function destroy(key?: Key) {
    if (key !== undefined) {
      remove(key, false)
      return
    }
    Array.from(records.keys()).forEach(k => remove(k, false))
  }

  const typeOpen = (type: MessageNoticeType): MessageTypeOpen => (content, duration, onClose) => {
    let args: MessageArgsProps = isArgsProps(content) ? content : { content }
    let mergedDuration: number | undefined
    let mergedOnClose = onClose
    if (typeof duration === 'function')
      mergedOnClose = duration
    else
      mergedDuration = duration
    args = { ...args, type }
    if (mergedDuration !== undefined && args.duration === undefined)
      args.duration = mergedDuration
    if (mergedOnClose && !args.onClose)
      args.onClose = mergedOnClose
    return open(args)
  }

  return {
    open,
    destroy,
    info: typeOpen('info'),
    success: typeOpen('success'),
    error: typeOpen('error'),
    warning: typeOpen('warning'),
    loading: typeOpen('loading'),
    holderProps,
  }
}

// ---------- static api ----------
const globalOptions = shallowReactive<MessageConfigOptions>({})
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
    () => h(MessageVue, {
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

function pickInstance(manager: Manager): MessageInstance {
  const { open, destroy, info, success, error, warning, loading } = manager
  return { open, destroy, info, success, error, warning, loading }
}

function useMessage(config: MessageConfigOptions = {}): [MessageInstance, Component] {
  const manager = createManager(config, () => {})
  const ContextHolder = defineComponent({
    name: 'AmMessageContextHolder',
    setup() {
      return () => h(MessageVue, manager.holderProps())
    },
  })
  return [pickInstance(manager), ContextHolder]
}

const message: MessageApi = {
  ...pickInstance(staticManager),
  config(options) {
    Object.assign(globalOptions, options)
  },
  useMessage,
}

export default message
