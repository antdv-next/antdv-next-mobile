<script setup lang="ts">
import type { ShareSheetEmits, ShareSheetOption, ShareSheetProps, ShareSheetSlots } from './interface'
import { computed } from 'vue'
import { cls, isRenderable } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import Popup from '../popup/Popup.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmShareSheet', inheritAttrs: false })

const props = withDefaults(defineProps<ShareSheetProps>(), {
  open: undefined,
  defaultOpen: false,
  options: () => [],
  title: undefined,
  description: undefined,
  cancelText: undefined,
  showCancel: true,
  closeOnSelect: true,
  maskClosable: true,
  keyboard: true,
  round: true,
  safeArea: true,
  destroyOnHidden: false,
  forceRender: false,
  getContainer: undefined,
})
const emit = defineEmits<ShareSheetEmits>()
const slots = defineSlots<ShareSheetSlots>()

// the cancel text is shared with ActionSheet
const locale = useLocale('ActionSheet')

const [mergedOpen, setOpen] = useControlled(props, 'open', {
  defaultValue: () => props.defaultOpen,
  onChange: (value: boolean) => {
    emit('update:open', value)
    emit('openChange', value)
  },
})

const rows = computed<ShareSheetOption[][]>(() => {
  const { options } = props
  if (!options.length)
    return []
  return Array.isArray(options[0]) ? (options as ShareSheetOption[][]) : [options as ShareSheetOption[]]
})

const hasTitle = computed(() => !!slots.title || isRenderable(props.title))
const hasDescription = computed(() => !!slots.description || isRenderable(props.description))
const hasCancel = computed(() => props.showCancel && props.cancelText !== null && props.cancelText !== false)

function close() {
  emit('close')
  setOpen(false)
}

function onSelect(option: ShareSheetOption, index: number, rowIndex: number) {
  if (option.disabled)
    return
  emit('select', option, index, rowIndex)
  if (props.closeOnSelect)
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
    :open="mergedOpen"
    placement="bottom"
    :mask-closable="maskClosable"
    :keyboard="keyboard"
    :round="round"
    :safe-area="safeArea"
    :destroy-on-hidden="destroyOnHidden"
    :force-render="forceRender"
    :get-container="getContainer"
    :z-index="zIndex"
    :root-class="cls('am-share-sheet-root', rootClass)"
    :classes="{ root: classes?.root, mask: classes?.mask, body: cls('am-share-sheet', classes?.body) }"
    :styles="{ root: styles?.root, mask: styles?.mask, body: styles?.body }"
    @close="close"
    @after-open-change="emit('afterOpenChange', $event)"
  >
    <div v-if="hasTitle || hasDescription" class="am-share-sheet-header" :class="classes?.header" :style="styles?.header">
      <div v-if="hasTitle" class="am-share-sheet-title" :class="classes?.title" :style="styles?.title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
      <div
        v-if="hasDescription"
        class="am-share-sheet-description"
        :class="classes?.description"
        :style="styles?.description"
      >
        <slot name="description">
          <RenderNode :node="description" />
        </slot>
      </div>
    </div>
    <div v-if="$slots.default" class="am-share-sheet-content">
      <slot />
    </div>
    <div v-if="rows.length" class="am-share-sheet-rows">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="am-share-sheet-row"
        :class="classes?.row"
        :style="styles?.row"
        role="list"
      >
        <button
          v-for="(option, index) in row"
          :key="option.key ?? index"
          type="button"
          role="listitem"
          class="am-share-sheet-option"
          :class="[classes?.option, option.class, { 'am-share-sheet-option-disabled': option.disabled }]"
          :style="[styles?.option, option.style]"
          :disabled="option.disabled || undefined"
          @click="onSelect(option, index, rowIndex)"
        >
          <span class="am-share-sheet-icon" :class="classes?.icon" :style="styles?.icon">
            <slot name="icon" :option="option" :index="index" :row-index="rowIndex">
              <RenderNode v-if="isRenderable(option.icon)" :node="option.icon" />
              <img v-else-if="option.image" class="am-share-sheet-image" :src="option.image" alt="" draggable="false">
            </slot>
          </span>
          <span class="am-share-sheet-label" :class="classes?.label" :style="styles?.label">
            <slot name="label" :option="option" :index="index" :row-index="rowIndex">
              <RenderNode :node="option.label" />
            </slot>
          </span>
          <span v-if="isRenderable(option.description)" class="am-share-sheet-option-description">
            <RenderNode :node="option.description" />
          </span>
        </button>
      </div>
    </div>
    <template v-if="hasCancel">
      <div class="am-share-sheet-gap" />
      <button
        type="button"
        class="am-share-sheet-cancel"
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
