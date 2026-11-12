<script setup lang="ts">
import type { ActionSheetAction, ActionSheetEmits, ActionSheetProps, ActionSheetSlots } from './interface'
import { computed } from 'vue'
import { cls, isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import Popup from '../popup/Popup.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmActionSheet', inheritAttrs: false })

const props = withDefaults(defineProps<ActionSheetProps>(), {
  open: false,
  actions: () => [],
  title: undefined,
  extra: undefined,
  cancelText: undefined,
  showCancel: true,
  closeOnAction: true,
  maskClosable: true,
  keyboard: true,
  round: true,
  safeArea: true,
  destroyOnHidden: false,
  forceRender: false,
  getContainer: undefined,
})
const emit = defineEmits<ActionSheetEmits>()
const slots = defineSlots<ActionSheetSlots>()

const locale = useLocale('ActionSheet')

const hasTitle = computed(() => !!slots.title || isRenderable(props.title))
const hasExtra = computed(() => !!slots.extra || isRenderable(props.extra))
const hasCancel = computed(() => props.showCancel && props.cancelText !== null && props.cancelText !== false)

function close() {
  emit('close')
  emit('update:open', false)
}

function onAction(action: ActionSheetAction, index: number) {
  if (action.disabled)
    return
  action.onClick?.(action, index)
  emit('action', action, index)
  if (props.closeOnAction)
    close()
}

function onCancel(event: MouseEvent) {
  emit('cancel', event)
  close()
}
</script>

<template>
  <Popup
    v-bind="$attrs"
    :open="open"
    placement="bottom"
    :mask-closable="maskClosable"
    :keyboard="keyboard"
    :round="round"
    :safe-area="safeArea"
    :destroy-on-hidden="destroyOnHidden"
    :force-render="forceRender"
    :get-container="getContainer"
    :z-index="zIndex"
    :root-class="cls('am-action-sheet-root', rootClass)"
    :classes="{ root: classes?.root, mask: classes?.mask, body: cls('am-action-sheet', classes?.body) }"
    :styles="{ root: styles?.root, mask: styles?.mask, body: styles?.body }"
    @close="close"
    @after-open-change="emit('afterOpenChange', $event)"
  >
    <div v-if="hasTitle || hasExtra" class="am-action-sheet-header" :class="classes?.header" :style="styles?.header">
      <div v-if="hasTitle" class="am-action-sheet-title" :class="classes?.title" :style="styles?.title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
      <div v-if="hasExtra" class="am-action-sheet-extra" :class="classes?.extra" :style="styles?.extra">
        <slot name="extra">
          <RenderNode :node="extra" />
        </slot>
      </div>
    </div>
    <div v-if="$slots.default" class="am-action-sheet-content">
      <slot />
    </div>
    <div v-if="actions.length" class="am-action-sheet-list" :class="classes?.list" :style="styles?.list" role="menu">
      <button
        v-for="(action, index) in actions"
        :key="action.key"
        type="button"
        role="menuitem"
        class="am-action-sheet-item"
        :class="[
          classes?.item,
          {
            'am-action-sheet-item-danger': action.danger,
            'am-action-sheet-item-bold': action.bold,
            'am-action-sheet-item-disabled': action.disabled,
          },
        ]"
        :style="styles?.item"
        :disabled="action.disabled || undefined"
        @click="onAction(action, index)"
      >
        <slot name="action" :action="action" :index="index">
          <span class="am-action-sheet-item-main">
            <span v-if="isRenderable(action.icon)" class="am-action-sheet-item-icon">
              <RenderNode :node="action.icon" />
            </span>
            <span class="am-action-sheet-item-text"><RenderNode :node="action.text" /></span>
          </span>
          <span v-if="isRenderable(action.description)" class="am-action-sheet-item-description">
            <RenderNode :node="action.description" />
          </span>
        </slot>
      </button>
    </div>
    <template v-if="hasCancel">
      <div class="am-action-sheet-gap" />
      <button
        type="button"
        class="am-action-sheet-item am-action-sheet-cancel"
        :class="classes?.cancel"
        :style="styles?.cancel"
        @click="onCancel"
      >
        <slot name="cancelText">
          <RenderNode v-if="isRenderable(cancelText)" :node="cancelText" />
          <template v-else>
            {{ locale.cancelText }}
          </template>
        </slot>
      </button>
    </template>
  </Popup>
</template>
