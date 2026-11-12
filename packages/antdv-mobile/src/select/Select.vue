<script setup lang="ts">
import type { VirtualListExpose } from '../virtual-list/interface'
import type {
  SelectEmits,
  SelectFilterOption,
  SelectLabeledValue,
  SelectOption,
  SelectProps,
  SelectSlots,
  SelectValue,
  SelectValueType,
} from './interface'
import { CheckOutlined, SearchOutlined } from '@antdv-next/icons'
import { computed, nextTick, ref, watch } from 'vue'
import { Spinner } from '../_base'
import { addUnit, isObject, toArray } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useConfig } from '../config-provider/context'
import { useLocale } from '../locale'
import PickerPopup from '../picker/PickerPopup.vue'
import PickerTrigger from '../picker/PickerTrigger.vue'
import { usePickerField } from '../picker/usePickerField'
import VirtualList from '../virtual-list/VirtualList.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSelect', inheritAttrs: false })

const props = withDefaults(defineProps<SelectProps>(), {
  labelInValue: false,
  showSearch: false,
  filterOption: undefined,
  optionRender: undefined,
  labelRender: undefined,
  notFoundContent: undefined,
  maxTagPlaceholder: undefined,
  loading: false,
  open: undefined,
  defaultOpen: false,
  disabled: undefined,
  allowClear: false,
  trigger: true,
  suffixIcon: undefined,
  getContainer: undefined,
  maskClosable: true,
  destroyOnHidden: false,
  virtual: true,
})
const emit = defineEmits<SelectEmits>()
const slots = defineSlots<SelectSlots>()

const locale = useLocale('Select')
const searchLocale = useLocale('InputSearch')
const config = useConfig()

const { open, setOpen, toggle, disabled, commit } = usePickerField(props, (value) => {
  emit('update:open', value)
  emit('openChange', value)
})

const multiple = computed(() => props.mode === 'multiple')
const names = computed(() => ({ label: 'label', value: 'value', options: 'options', ...props.fieldNames }))

// ---------- options ----------
interface FlatItem {
  group: boolean
  key: string
  label: string
  value?: SelectValue
  disabled: boolean
  option: SelectOption
}

function flatten(options: SelectOption[] | undefined, parentDisabled = false, prefix = ''): FlatItem[] {
  const list: FlatItem[] = []
  ;(options ?? []).forEach((option, index) => {
    const children = option[names.value.options] as SelectOption[] | undefined
    const key = `${prefix}${index}`
    if (Array.isArray(children)) {
      list.push({ group: true, key: `g-${key}`, label: String(option[names.value.label] ?? ''), disabled: true, option })
      list.push(...flatten(children, parentDisabled || !!option.disabled, `${key}-`))
    }
    else {
      const value = option[names.value.value] as SelectValue
      list.push({ group: false, key: `o-${key}`, label: String(option[names.value.label] ?? value ?? ''), value, disabled: parentDisabled || !!option.disabled, option })
    }
  })
  return list
}

const flatItems = computed(() => flatten(props.options))
const optionMap = computed(() => {
  const map = new Map<SelectValue, FlatItem>()
  flatItems.value.forEach((item) => {
    if (!item.group && item.value !== undefined && !map.has(item.value))
      map.set(item.value, item)
  })
  return map
})

// ---------- value ----------
const [value, setValue] = useControlled<SelectProps, 'value', SelectValueType | null>(props, 'value', {
  defaultValue: () => props.defaultValue ?? null,
})

const isLabeled = (item: unknown): item is SelectLabeledValue => isObject(item) && 'value' in item

/** committed values with their labels: option label > `labelInValue` label > the value itself */
const selectedItems = computed<SelectLabeledValue[]>(() =>
  toArray(value.value as SelectValue | SelectLabeledValue | (SelectValue | SelectLabeledValue)[] | null)
    .filter(item => item !== undefined && item !== null && item !== '')
    .map((item) => {
      const raw = isLabeled(item) ? item.value : item
      return { value: raw, label: optionMap.value.get(raw)?.label ?? (isLabeled(item) ? item.label : String(raw)) }
    }),
)
const selectedValues = computed(() => selectedItems.value.map(item => item.value))

/** checked values of the popup in multiple mode, committed on confirm */
const pending = ref<SelectValue[]>(selectedValues.value.slice())
watch(open, (val) => {
  if (val)
    pending.value = selectedValues.value.slice()
})
watch(selectedValues, (val) => {
  pending.value = val.slice()
})

const activeValues = computed(() => (multiple.value ? pending.value : selectedValues.value))
const isSelected = (item: FlatItem) => item.value !== undefined && activeValues.value.includes(item.value)
const reachedMax = computed(() => multiple.value && props.maxCount !== undefined && pending.value.length >= props.maxCount)
const isDisabled = (item: FlatItem) => item.disabled || (reachedMax.value && !isSelected(item))

function toOutput(values: SelectValue[]): SelectValueType | null {
  const items = values.map((val) => {
    if (!props.labelInValue)
      return val
    const known = selectedItems.value.find(item => item.value === val)
    return { value: val, label: optionMap.value.get(val)?.label ?? known?.label ?? String(val) }
  })
  if (multiple.value)
    return items as SelectValueType
  return items[0] ?? null
}

function update(values: SelectValue[]) {
  const next = toOutput(values)
  const options = values.map(val => optionMap.value.get(val)?.option).filter((option): option is SelectOption => !!option)
  setValue(next)
  emit('update:value', next)
  emit('change', next, multiple.value ? options : options[0])
  commit()
}

const sameValues = (a: SelectValue[], b: SelectValue[]) => a.length === b.length && a.every((val, index) => val === b[index])

// ---------- label of the trigger ----------
const separator = computed(() => (config.locale.value.locale.startsWith('zh') ? '、' : ', '))
const shownItems = computed(() => {
  const items = selectedItems.value
  return multiple.value && props.maxTagCount !== undefined ? items.slice(0, Math.max(props.maxTagCount, 0)) : items
})
const omittedItems = computed(() => selectedItems.value.slice(shownItems.value.length))
const omittedText = computed(() => (omittedItems.value.length ? `+${omittedItems.value.length}...` : ''))
const label = computed(() => {
  const text = shownItems.value.map(item => item.label).join(separator.value)
  if (!omittedItems.value.length)
    return text
  return text ? `${text} ${omittedText.value}` : omittedText.value
})
const customLabel = computed(() => !!slots.labelRender || props.labelRender !== undefined || props.maxTagPlaceholder !== undefined)

// ---------- search ----------
const searchConfig = computed(() => (isObject(props.showSearch) ? props.showSearch : {}))
const searchValue = ref('')
const searchRef = ref<HTMLInputElement>()

const visibleItems = computed(() => {
  const input = searchValue.value.trim()
  const filter: SelectFilterOption = searchConfig.value.filterOption ?? props.filterOption ?? true
  if (!props.showSearch || !input || filter === false)
    return flatItems.value
  const keyword = input.toLowerCase()
  const match = (item: FlatItem) => (typeof filter === 'function'
    ? filter(input, item.option)
    : item.label.toLowerCase().includes(keyword) || String(item.option.description ?? '').toLowerCase().includes(keyword))
  const matched = flatItems.value.filter(item => item.group || match(item))
  // drop group titles that lost all of their options
  return matched.filter((item, index) => !item.group || (matched[index + 1] && !matched[index + 1].group))
})
const isEmpty = computed(() => !visibleItems.value.some(item => !item.group))

// ---------- list (virtualized) ----------
/** fallback of `--am-select-option-height`, the estimate used before a row is measured */
const DEFAULT_ITEM_HEIGHT = 48

const listRef = ref<VirtualListExpose>()
const listData = computed(() => (props.loading ? [] : visibleItems.value))
/** rows are measured unless every row is known to be exactly `listItemHeight` tall */
const fixedHeight = computed(() =>
  props.listItemHeight !== undefined
  && !slots.option
  && props.optionRender === undefined
  && !flatItems.value.some(item => item.group || item.option.description),
)
const panelStyle = computed(() => ({
  '--am-select-list-max-height': addUnit(props.listHeight),
  '--am-select-option-height': addUnit(props.listItemHeight),
}))

/** brings the (first) selected option to the middle of the list, or resets the scroll position */
function scrollToSelected() {
  const list = listRef.value
  if (!list)
    return false
  const first = activeValues.value[0]
  const key = first === undefined ? undefined : optionMap.value.get(first)?.key
  if (key !== undefined && visibleItems.value.some(item => item.key === key))
    list.scrollTo({ key, align: 'center' })
  else
    list.scrollTo(0)
  return true
}

let pendingScroll = false
function onAfterOpenChange(val: boolean) {
  // the list was not mounted yet when the popup opened
  if (val && pendingScroll)
    scrollToSelected()
  pendingScroll = false
}

function onSearch(event: Event) {
  searchValue.value = (event.target as HTMLInputElement).value
  emit('search', searchValue.value)
  listRef.value?.scrollTo(0)
}

watch(open, (val) => {
  if (val) {
    nextTick(() => {
      pendingScroll = !scrollToSelected()
    })
    if (searchConfig.value.autoFocus)
      nextTick(() => searchRef.value?.focus())
  }
  else if (searchValue.value) {
    searchValue.value = ''
    emit('search', '')
  }
})

// ---------- interactions ----------
function onOptionClick(item: FlatItem) {
  if (item.group || item.value === undefined || isDisabled(item) || props.loading)
    return
  if (!multiple.value) {
    emit('select', item.value, item.option)
    if (!sameValues([item.value], selectedValues.value))
      update([item.value])
    emit('confirm', toOutput([item.value]))
    setOpen(false)
    return
  }
  if (pending.value.includes(item.value)) {
    pending.value = pending.value.filter(val => val !== item.value)
    emit('deselect', item.value, item.option)
  }
  else {
    pending.value = [...pending.value, item.value]
    emit('select', item.value, item.option)
  }
}

function onConfirm() {
  if (!sameValues(pending.value, selectedValues.value))
    update(pending.value.slice())
  emit('confirm', toOutput(pending.value))
  setOpen(false)
}

function onCancel() {
  emit('cancel')
  setOpen(false)
}

function onClear() {
  update([])
  emit('clear')
}

defineExpose({ toggle })
</script>

<template>
  <slot v-if="$slots.default" :open="open" :value="value" :label="label" :disabled="disabled" :toggle="toggle" />
  <PickerTrigger
    v-else-if="trigger"
    v-bind="$attrs"
    :id="id"
    class="am-select"
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
    <template v-if="customLabel" #default>
      <template v-for="(item, index) in shownItems" :key="item.value">
        <template v-if="index">
          {{ separator }}
        </template>
        <slot name="labelRender" v-bind="item">
          <RenderNode v-if="labelRender !== undefined" :node="labelRender" :params="item" />
          <template v-else>
            {{ item.label }}
          </template>
        </slot>
      </template>
      <span v-if="omittedItems.length" class="am-select-omitted">
        <RenderNode v-if="maxTagPlaceholder !== undefined" :node="maxTagPlaceholder" :params="omittedItems" />
        <template v-else>{{ omittedText }}</template>
      </span>
    </template>
    <template v-if="$slots.suffixIcon" #suffixIcon>
      <slot name="suffixIcon" />
    </template>
  </PickerTrigger>
  <PickerPopup
    :open="open"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    :show-confirm="multiple"
    :confirm-disabled="loading"
    :get-container="getContainer"
    :z-index="zIndex"
    :mask-closable="maskClosable"
    :destroy-on-hidden="destroyOnHidden"
    :root-class="rootClass"
    :popup-class="classes?.popup"
    :popup-style="styles?.popup"
    @confirm="onConfirm"
    @cancel="onCancel"
    @after-open-change="onAfterOpenChange"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <div class="am-select-panel" :class="{ 'am-select-panel-multiple': multiple }" :style="panelStyle">
      <div v-if="showSearch" class="am-select-search">
        <SearchOutlined class="am-select-search-icon" />
        <input
          ref="searchRef"
          class="am-select-search-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          :value="searchValue"
          :placeholder="searchConfig.placeholder ?? searchLocale.placeholder"
          :aria-label="searchConfig.placeholder ?? searchLocale.placeholder"
          @input="onSearch"
        >
      </div>
      <VirtualList
        ref="listRef"
        class="am-select-list"
        role="listbox"
        :aria-multiselectable="multiple || undefined"
        :data="listData"
        item-key="key"
        :virtual="virtual"
        :item-height="listItemHeight ?? DEFAULT_ITEM_HEIGHT"
        :fixed="fixedHeight"
      >
        <template #default="{ item, index }">
          <div v-if="item.group" class="am-select-group">
            {{ item.label }}
          </div>
          <div
            v-else
            class="am-select-option"
            :class="{ 'am-select-option-selected': isSelected(item), 'am-select-option-disabled': isDisabled(item) }"
            role="option"
            :aria-selected="isSelected(item)"
            :aria-disabled="isDisabled(item) || undefined"
            @click="onOptionClick(item)"
          >
            <div class="am-select-option-content">
              <slot name="option" :option="item.option" :index="index" :selected="isSelected(item)">
                <RenderNode
                  v-if="optionRender !== undefined"
                  :node="optionRender"
                  :params="{ option: item.option, index, selected: isSelected(item) }"
                />
                <template v-else>
                  <div class="am-select-option-label">
                    {{ item.label }}
                  </div>
                  <div v-if="item.option.description" class="am-select-option-description">
                    {{ item.option.description }}
                  </div>
                </template>
              </slot>
            </div>
            <span v-if="multiple" class="am-select-option-check">
              <CheckOutlined v-if="isSelected(item)" />
            </span>
            <CheckOutlined v-else-if="isSelected(item)" class="am-select-option-icon" />
          </div>
        </template>
        <template v-if="loading || isEmpty" #footer>
          <div v-if="loading" class="am-select-loading">
            <Spinner />
          </div>
          <div v-else class="am-select-empty">
            <slot name="notFoundContent">
              <RenderNode v-if="notFoundContent !== undefined" :node="notFoundContent" />
              <template v-else>
                {{ locale.notFoundContent }}
              </template>
            </slot>
          </div>
        </template>
      </VirtualList>
    </div>
  </PickerPopup>
</template>
