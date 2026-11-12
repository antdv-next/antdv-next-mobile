<script setup lang="ts">
import type { PickerValue, PickerViewEmits, PickerViewProps, PickerViewSlots } from './interface'
import { LoadingOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { useControlled } from '../_util/hooks'
import PickerViewColumn from './PickerViewColumn.vue'
import { resolvePicker } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmPickerView', inheritAttrs: false })

const props = withDefaults(defineProps<PickerViewProps>(), {
  itemHeight: 40,
  visibleItemCount: 5,
  loading: false,
  optionRender: undefined,
})
const emit = defineEmits<PickerViewEmits>()
defineSlots<PickerViewSlots>()

const [innerValue, setInnerValue] = useControlled<PickerViewProps, 'value', PickerValue[]>(props, 'value', {
  defaultValue: () => props.defaultValue ?? [],
})

const resolved = computed(() => resolvePicker(props.columns, innerValue.value, props.fieldNames))

function onColumnChange(columnIndex: number, value: PickerValue) {
  const next = resolved.value.value.slice()
  next[columnIndex] = value
  const result = resolvePicker(props.columns, next, props.fieldNames)
  setInnerValue(result.value)
  emit('update:value', result.value)
  emit('change', result.value, { items: result.items, columnIndex })
}

const rootStyle = computed(() => [
  {
    '--am-picker-view-item-height': `${props.itemHeight}px`,
    '--am-picker-view-visible-count': String(props.visibleItemCount),
  },
  props.styles?.root,
])
</script>

<template>
  <div
    v-bind="$attrs"
    class="am-picker-view"
    :class="[{ 'am-picker-view-loading': loading }, rootClass, classes?.root]"
    :style="rootStyle"
  >
    <div v-if="loading" class="am-picker-view-spin">
      <slot name="loading">
        <LoadingOutlined class="am-spin-icon" />
      </slot>
    </div>
    <template v-else>
      <div class="am-picker-view-indicator" :class="classes?.indicator" :style="styles?.indicator" />
      <div class="am-picker-view-columns">
        <PickerViewColumn
          v-for="(column, index) in resolved.columns"
          :key="index"
          :class="classes?.column"
          :style="styles?.column"
          :options="column"
          :value="resolved.value[index]"
          :column-index="index"
          :item-height="itemHeight"
          :visible-item-count="visibleItemCount"
          :option-render="optionRender"
          :item-class="classes?.item"
          :item-style="styles?.item"
          @change="onColumnChange(index, $event)"
        >
          <template v-if="$slots.option" #option="info">
            <slot name="option" v-bind="info" />
          </template>
        </PickerViewColumn>
      </div>
    </template>
  </div>
</template>
