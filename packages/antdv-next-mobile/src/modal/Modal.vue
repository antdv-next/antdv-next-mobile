<script setup lang="ts">
import type { ButtonColorType } from '../button/interface'
import type { ModalAction, ModalEmits, ModalProps, ModalSlots } from './interface'
import { CloseOutlined } from '@antdv-next/icons'
import { computed, reactive } from 'vue'
import { cls, isPromise } from '../_util'
import RenderNode from '../_util/RenderNode'
import Button from '../button/Button.vue'
import { useLocale } from '../locale'
import Popup from '../popup/Popup.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmModal', inheritAttrs: false })

const props = withDefaults(defineProps<ModalProps>(), {
  open: false,
  title: undefined,
  content: undefined,
  footer: undefined,
  okText: undefined,
  cancelText: undefined,
  closeIcon: undefined,
  okType: 'primary',
  confirmLoading: false,
  okCancel: true,
  closable: false,
  mask: true,
  maskClosable: true,
  centered: true,
  keyboard: true,
  destroyOnHidden: false,
  forceRender: false,
  getContainer: undefined,
  scrollLock: true,
  closeOnAction: false,
})
const emit = defineEmits<ModalEmits>()
const slots = defineSlots<ModalSlots>()

const locale = useLocale('Modal')
const commonLocale = useLocale('common')

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

const hasTitle = computed(() => !!slots.title || isNode(props.title))
const hasBody = computed(() => !!slots.default || isNode(props.content))
const hasHeader = computed(() => !!slots.header || !!props.image)
const showClose = computed(() => props.closable && props.closeIcon !== null && props.closeIcon !== false)
const hasActions = computed(() => Array.isArray(props.actions) && props.actions.length > 0)
/** `footer: null | false` removes the footer; `undefined` renders the default buttons */
const footerMode = computed<'none' | 'custom' | 'actions' | 'default'>(() => {
  if (slots.footer)
    return 'custom'
  if (props.footer === null || props.footer === false)
    return 'none'
  if (props.footer !== undefined)
    return 'custom'
  return hasActions.value ? 'actions' : 'default'
})
const verticalActions = computed(() => (props.actions?.length ?? 0) > 2)

const okColor = computed<ButtonColorType>(() => {
  if (props.okType === 'danger')
    return 'danger'
  return props.okType === 'primary' || props.okType === 'link' ? 'primary' : 'default'
})

function handleCancel(event?: Event) {
  emit('cancel', event)
  emit('update:open', false)
}

function handleOk(event: MouseEvent) {
  emit('ok', event)
}

// ---------- actions ----------
const actionLoading = reactive<Record<string, boolean>>({})

function handleAction(action: ModalAction, index: number) {
  if (action.disabled || actionLoading[String(action.key)])
    return
  const finish = () => {
    emit('action', action, index)
    if (props.closeOnAction)
      emit('update:open', false)
  }
  const result = action.onClick?.(action)
  if (isPromise(result)) {
    const key = String(action.key)
    actionLoading[key] = true
    result.then(
      () => {
        actionLoading[key] = false
        finish()
      },
      () => {
        actionLoading[key] = false
      },
    )
  }
  else {
    finish()
  }
}

function getActionColor(action: ModalAction): ButtonColorType {
  if (action.danger)
    return 'danger'
  return action.bold ? 'primary' : 'default'
}

function onAfterOpenChange(open: boolean) {
  emit('afterOpenChange', open)
  if (!open)
    emit('afterClose')
}
</script>

<template>
  <Popup
    v-bind="$attrs"
    :open="open"
    placement="center"
    :mask="mask"
    :mask-closable="maskClosable"
    :keyboard="keyboard"
    :lock-scroll="scrollLock"
    :destroy-on-hidden="destroyOnHidden"
    :force-render="forceRender"
    :get-container="getContainer"
    :z-index="zIndex"
    :width="width"
    :root-class="cls('am-modal-root', rootClass)"
    :classes="{ root: classes?.root, mask: classes?.mask, body: cls('am-modal', classes?.container) }"
    :styles="{ root: { ...rootStyle, ...styles?.root }, mask: styles?.mask, body: styles?.container }"
    @close="handleCancel"
    @after-open-change="onAfterOpenChange"
  >
    <button
      v-if="showClose"
      type="button"
      class="am-modal-close"
      :class="classes?.close"
      :style="styles?.close"
      :aria-label="commonLocale.close"
      @click="handleCancel"
    >
      <slot name="closeIcon">
        <RenderNode v-if="isNode(closeIcon)" :node="closeIcon" />
        <CloseOutlined v-else />
      </slot>
    </button>
    <div class="am-modal-content">
      <div v-if="hasHeader" class="am-modal-header" :class="classes?.header" :style="styles?.header">
        <slot name="header">
          <img class="am-modal-image" :src="image" alt="">
        </slot>
      </div>
      <div v-if="hasTitle" class="am-modal-title" :class="classes?.title" :style="styles?.title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
      <div v-if="hasBody" class="am-modal-body" :class="classes?.body" :style="styles?.body">
        <slot>
          <RenderNode :node="content" />
        </slot>
      </div>
    </div>
    <div
      v-if="footerMode !== 'none'"
      class="am-modal-footer"
      :class="[
        classes?.footer,
        {
          'am-modal-footer-custom': footerMode === 'custom',
          'am-modal-footer-vertical': footerMode === 'actions' && verticalActions,
        },
      ]"
      :style="styles?.footer"
    >
      <slot
        v-if="footerMode === 'custom'"
        name="footer"
        :ok="handleOk"
        :cancel="handleCancel"
        :confirm-loading="confirmLoading"
      >
        <RenderNode :node="footer" />
      </slot>
      <template v-else-if="footerMode === 'actions'">
        <Button
          v-for="(action, index) in actions"
          :key="action.key"
          class="am-modal-action"
          :class="{ 'am-modal-action-bold': action.bold }"
          variant="text"
          :color="getActionColor(action)"
          :disabled="action.disabled"
          :loading="!!actionLoading[String(action.key)]"
          @click="handleAction(action, index)"
        >
          <RenderNode :node="action.text" />
        </Button>
      </template>
      <template v-else>
        <Button
          v-if="okCancel"
          class="am-modal-action am-modal-action-cancel"
          variant="text"
          color="default"
          v-bind="cancelButtonProps"
          @click="handleCancel"
        >
          <slot name="cancelText">
            <RenderNode v-if="isNode(cancelText)" :node="cancelText" />
            <template v-else>
              {{ locale.cancelText }}
            </template>
          </slot>
        </Button>
        <Button
          class="am-modal-action am-modal-action-ok am-modal-action-bold"
          variant="text"
          :color="okColor"
          v-bind="okButtonProps"
          :loading="confirmLoading || okButtonProps?.loading"
          @click="handleOk"
        >
          <slot name="okText">
            <RenderNode v-if="isNode(okText)" :node="okText" />
            <template v-else>
              {{ okCancel ? locale.okText : locale.justOkText }}
            </template>
          </slot>
        </Button>
      </template>
    </div>
  </Popup>
</template>
