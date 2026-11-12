import type { AppContext, Component, VNode } from 'vue'
import type { VueNode } from '../_util/type'
import type { ModalAction, ModalFuncProps, ModalFuncReturn, ModalHookApi } from './interface'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, InfoCircleFilled } from '@antdv-next/icons'
import { defineComponent, Fragment, h, ref, shallowRef } from 'vue'
import { isPromise } from '../_util'
import { mountComponent } from '../_util/mount'
import ModalVue from './Modal.vue'

/** Where a dialog created by a function call is rendered: a detached app (static) or a `contextHolder` (hook). */
interface DialogHost {
  add: (render: () => VNode, appContext?: AppContext | null) => () => void
}

interface DialogHandle extends ModalFuncReturn {
  /** resolves `true` when closed by ok, `false` otherwise */
  result: Promise<boolean>
}

const staticHost: DialogHost = {
  add(render, appContext) {
    return mountComponent(render, appContext).unmount
  },
}

const destroyFns = new Set<() => void>()

const typeIcons: Record<string, Component> = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
}

function renderNode(node: VueNode) {
  return typeof node === 'function' ? (node as () => any)() : node
}

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

function createDialog(initial: ModalFuncProps, host: DialogHost): DialogHandle {
  const config = shallowRef<ModalFuncProps>({ ...initial })
  const open = ref(true)
  const okLoading = ref(false)
  const cancelLoading = ref(false)
  let remove: (() => void) | undefined
  let settled = false
  let resolveResult!: (value: boolean) => void
  const result = new Promise<boolean>((resolve) => {
    resolveResult = resolve
  })

  function close(value = false) {
    if (!settled) {
      settled = true
      resolveResult(value)
    }
    open.value = false
  }

  function destroy() {
    close(false)
  }
  destroyFns.add(destroy)

  function run(handler: ModalFuncProps['onOk'], loading: typeof okLoading, value: boolean) {
    if (loading.value)
      return
    if (!handler) {
      close(value)
      return
    }
    let returned: any
    if (handler.length > 0) {
      // the handler asked for `close`, it decides when to close
      returned = handler(() => close(value))
    }
    else {
      returned = (handler as () => any)()
      if (!isPromise(returned)) {
        close(value)
        return
      }
    }
    if (!isPromise(returned))
      return
    loading.value = true
    returned.then(
      () => {
        loading.value = false
        close(value)
      },
      () => {
        loading.value = false
      },
    )
  }

  function onAfterOpenChange(visible: boolean) {
    if (visible)
      return
    destroyFns.delete(destroy)
    config.value.afterClose?.()
    remove?.()
  }

  const render = () => {
    const c = config.value
    const type = c.type === 'warn' ? 'warning' : c.type
    const okCancel = c.okCancel ?? type === 'confirm'
    const DefaultIcon = type ? typeIcons[type] : undefined
    const iconNode = isNode(c.icon) ? renderNode(c.icon) : (c.icon === undefined && DefaultIcon ? h(DefaultIcon) : null)
    const slots: Record<string, () => any> = {}
    if (isNode(c.content))
      slots.default = () => renderNode(c.content)
    if (iconNode)
      slots.header = () => h('span', { class: ['am-modal-icon', type && `am-modal-icon-${type}`] }, [iconNode])

    return h(ModalVue, {
      'open': open.value,
      'title': c.title,
      'image': c.image,
      'footer': c.footer,
      'okText': c.okText,
      'cancelText': c.cancelText,
      'okType': c.okType,
      'okCancel': okCancel,
      'okButtonProps': c.okButtonProps,
      'cancelButtonProps': { ...c.cancelButtonProps, loading: cancelLoading.value || c.cancelButtonProps?.loading },
      'confirmLoading': okLoading.value,
      'actions': c.actions,
      'closable': c.closable ?? false,
      'closeIcon': c.closeIcon,
      'mask': c.mask ?? true,
      'maskClosable': c.maskClosable ?? false,
      'keyboard': c.keyboard ?? true,
      'getContainer': c.getContainer,
      'zIndex': c.zIndex,
      'width': c.width,
      'rootClass': c.rootClass,
      'classes': c.classes,
      'styles': c.styles,
      'class': ['am-modal-confirm', type && `am-modal-confirm-${type}`, c.class],
      'style': c.style,
      'destroyOnHidden': true,
      'onOk': () => run(c.onOk, okLoading, true),
      'onCancel': () => run(c.onCancel, cancelLoading, false),
      'onAction': (_action: ModalAction) => {
        if (c.closeOnAction ?? true)
          close(false)
      },
      onAfterOpenChange,
    }, slots)
  }

  remove = host.add(render, initial.appContext)

  return {
    destroy,
    update(next) {
      config.value = typeof next === 'function' ? next(config.value) : { ...config.value, ...next }
    },
    result,
  }
}

function createApi(host: DialogHost): ModalHookApi {
  const withType = (type: ModalFuncProps['type']) => (config: ModalFuncProps): ModalFuncReturn => {
    const { destroy, update } = createDialog({ ...config, type }, host)
    return { destroy, update }
  }
  return {
    info: withType('info'),
    success: withType('success'),
    error: withType('error'),
    warning: withType('warning'),
    confirm: withType('confirm'),
    show(config) {
      const { destroy, update } = createDialog(config, host)
      return { destroy, update }
    },
    alert(config) {
      return createDialog({ ...config, okCancel: false }, host).result.then(() => {})
    },
    confirmAsync(config) {
      return createDialog({ type: 'confirm', ...config }, host).result
    },
  }
}

export const staticApi = createApi(staticHost)

export function destroyAll() {
  Array.from(destroyFns).forEach(fn => fn())
}

let holderSeed = 0

/**
 * `const [modal, ContextHolder] = Modal.useModal()`: dialogs are rendered where `<ContextHolder />` is placed,
 * so they keep the ConfigProvider / provide context of the calling component.
 */
export function useModal(): [ModalHookApi, Component] {
  const items = shallowRef<Array<{ id: number, render: () => VNode }>>([])
  const host: DialogHost = {
    add(render) {
      const item = { id: ++holderSeed, render }
      items.value = [...items.value, item]
      return () => {
        items.value = items.value.filter(i => i !== item)
      }
    },
  }
  const ContextHolder = defineComponent({
    name: 'AmModalContextHolder',
    setup() {
      return () => items.value.map(item => h(Fragment, { key: item.id }, [item.render()]))
    },
  })
  return [createApi(host), ContextHolder]
}
