<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { GetContainer, VueNode } from '../_util/type'
import { cls } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import Popup from '../popup/Popup.vue'
import '../style'
import './style/index.css'

/** Internal: bottom popup with a `cancel · title · confirm` header shared by every picker field. */
defineOptions({ name: 'AmPickerPopup', inheritAttrs: false })

withDefaults(defineProps<{
  open?: boolean
  title?: VueNode
  okText?: string
  cancelText?: string
  showConfirm?: boolean
  showCancel?: boolean
  confirmDisabled?: boolean
  getContainer?: GetContainer
  zIndex?: number
  maskClosable?: boolean
  destroyOnHidden?: boolean
  rootClass?: string
  popupClass?: string
  popupStyle?: CSSProperties
}>(), {
  open: false,
  showConfirm: true,
  showCancel: true,
  confirmDisabled: false,
  getContainer: undefined,
  maskClosable: true,
  destroyOnHidden: false,
})
const emit = defineEmits<{ confirm: [], cancel: [], afterOpenChange: [open: boolean] }>()
defineSlots<{ default?: () => any, title?: () => any }>()

const locale = useLocale('Picker')
</script>

<template>
  <Popup
    :open="open"
    placement="bottom"
    round
    :get-container="getContainer"
    :z-index="zIndex"
    :mask-closable="maskClosable"
    :destroy-on-hidden="destroyOnHidden"
    :root-class="cls('am-picker-popup-root', rootClass)"
    :classes="{ body: cls('am-picker-popup', popupClass) }"
    :styles="{ body: popupStyle }"
    @close="emit('cancel')"
    @after-open-change="emit('afterOpenChange', $event)"
  >
    <div class="am-picker-popup-header">
      <button v-if="showCancel" type="button" class="am-picker-popup-button am-picker-popup-cancel" @click="emit('cancel')">
        {{ cancelText ?? locale.cancelText }}
      </button>
      <div class="am-picker-popup-title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
      <button
        v-if="showConfirm"
        type="button"
        class="am-picker-popup-button am-picker-popup-confirm"
        :disabled="confirmDisabled"
        @click="emit('confirm')"
      >
        {{ okText ?? locale.okText }}
      </button>
    </div>
    <slot />
  </Popup>
</template>
