<script setup lang="ts">
import type { CascaderEmits, CascaderOption, CascaderProps, CascaderSlots, CascaderValue } from './interface'
import { computed, ref, watch } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import PickerPopup from '../picker/PickerPopup.vue'
import PickerTrigger from '../picker/PickerTrigger.vue'
import { usePickerField } from '../picker/usePickerField'
import CascaderView from './CascaderView.vue'
import { getLabels, getSelectedOptions } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCascader', inheritAttrs: false })

const props = withDefaults(defineProps<CascaderProps>(), {
  changeOnSelect: false,
  optionRender: undefined,
  notFoundContent: undefined,
  open: undefined,
  defaultOpen: false,
  disabled: undefined,
  allowClear: false,
  trigger: true,
  suffixIcon: undefined,
  getContainer: undefined,
  maskClosable: true,
  destroyOnHidden: false,
})
const emit = defineEmits<CascaderEmits>()
defineSlots<CascaderSlots>()

const locale = useLocale('Cascader')

const { open, setOpen, toggle, disabled, commit } = usePickerField(props, (value) => {
  emit('update:open', value)
  emit('openChange', value)
})

const [value, setValue] = useControlled<CascaderProps, 'value', CascaderValue[]>(props, 'value', {
  defaultValue: () => props.defaultValue ?? [],
})

/** path of the popup, committed on confirm (`changeOnSelect`) or when a leaf is selected */
const pending = ref<CascaderValue[]>(value.value.slice())
watch(open, (val) => {
  if (val)
    pending.value = value.value.slice()
})
watch(value, (val) => {
  pending.value = val.slice()
})

const selectedOptions = computed(() => getSelectedOptions(props.options, value.value, props.fieldNames))
const labels = computed(() => getLabels(props.options, value.value, props.fieldNames))
const label = computed(() => labels.value.join(' / '))

function update(next: CascaderValue[], selected: CascaderOption[]) {
  setValue(next)
  emit('update:value', next)
  emit('change', next, selected)
  commit()
}

function finish(next: CascaderValue[]) {
  const selected = getSelectedOptions(props.options, next, props.fieldNames)
  const changed = next.length !== value.value.length || next.some((item, index) => item !== value.value[index])
  if (changed)
    update(next, selected)
  emit('confirm', next, selected)
  setOpen(false)
}

function onViewChange(next: CascaderValue[]) {
  pending.value = next
}

function onFinish(next: CascaderValue[]) {
  // without `changeOnSelect` a leaf completes the selection, no confirm button needed
  if (!props.changeOnSelect)
    finish(next)
}

function onCancel() {
  emit('cancel')
  setOpen(false)
}

function onClear() {
  update([], [])
  emit('clear')
}

defineExpose({ toggle })
</script>

<template>
  <slot
    v-if="$slots.default"
    :open="open"
    :value="value"
    :label="label"
    :selected-options="selectedOptions"
    :disabled="disabled"
    :toggle="toggle"
  />
  <PickerTrigger
    v-else-if="trigger"
    v-bind="$attrs"
    :id="id"
    class="am-cascader"
    :label="label"
    :placeholder="placeholder ?? locale.placeholder"
    :open="open"
    :disabled="disabled"
    :allow-clear="allowClear"
    :status="status"
    :variant="variant"
    :size="size"
    :suffix-icon="suffixIcon"
    :root-class="rootClass"
    :classes="classes"
    :styles="styles"
    @click="toggle()"
    @clear="onClear"
  >
    <slot name="displayRender" :labels="labels" :selected-options="selectedOptions">
      <RenderNode v-if="displayRender" :node="displayRender(labels, selectedOptions)" />
      <template v-else>
        {{ label }}
      </template>
    </slot>
    <template v-if="$slots.suffixIcon" #suffixIcon>
      <slot name="suffixIcon" />
    </template>
  </PickerTrigger>
  <PickerPopup
    :open="open"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    :show-confirm="changeOnSelect"
    :confirm-disabled="!pending.length"
    :get-container="getContainer"
    :z-index="zIndex"
    :mask-closable="maskClosable"
    :destroy-on-hidden="destroyOnHidden"
    :root-class="rootClass"
    :popup-class="classes?.popup"
    :popup-style="styles?.popup"
    @confirm="finish(pending)"
    @cancel="onCancel"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <CascaderView
      :value="pending"
      :options="options"
      :field-names="fieldNames"
      :change-on-select="changeOnSelect"
      :load-data="loadData"
      :option-render="optionRender"
      :not-found-content="notFoundContent"
      @change="onViewChange"
      @finish="onFinish"
      @select="(option, level) => emit('select', option, level)"
      @tab-change="emit('tabChange', $event)"
    >
      <template v-if="$slots.option" #option="info">
        <slot name="option" v-bind="info" />
      </template>
      <template v-if="$slots.notFoundContent" #notFoundContent>
        <slot name="notFoundContent" />
      </template>
    </CascaderView>
  </PickerPopup>
</template>
