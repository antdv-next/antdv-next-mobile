<script setup lang="ts">
import type { VirtualListExpose } from '../virtual-list/interface'
import type { CascaderOption, CascaderValue, CascaderViewEmits, CascaderViewProps, CascaderViewSlots } from './interface'
import { CheckOutlined } from '@antdv-next/icons'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { Spinner } from '../_base'
import { addUnit, isPromise } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import VirtualList from '../virtual-list/VirtualList.vue'
import { getSelectedOptions, resolveFieldNames } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCascaderView', inheritAttrs: false })

const props = withDefaults(defineProps<CascaderViewProps>(), {
  changeOnSelect: false,
  optionRender: undefined,
  notFoundContent: undefined,
  virtual: true,
})
const emit = defineEmits<CascaderViewEmits>()
const slots = defineSlots<CascaderViewSlots>()

const locale = useLocale('Cascader')
const emptyLocale = useLocale('Empty')
const names = computed(() => resolveFieldNames(props.fieldNames))

const [value, setValue] = useControlled<CascaderViewProps, 'value', CascaderValue[]>(props, 'value', {
  defaultValue: () => props.defaultValue ?? [],
})

/** path being browsed; only becomes the value on a leaf (or on every level with `changeOnSelect`) */
const path = ref<CascaderValue[]>(value.value.slice())
const selectedOptions = computed(() => getSelectedOptions(props.options, path.value, props.fieldNames))

/** option list of every reachable level */
const levels = computed(() => {
  const list: CascaderOption[][] = [props.options ?? []]
  for (const option of selectedOptions.value) {
    const children = option[names.value.children] as CascaderOption[] | undefined
    if (!children?.length)
      break
    list.push(children)
  }
  return list
})

const tabs = computed(() => levels.value.map((_, index) => {
  const option = selectedOptions.value[index]
  return { selected: !!option, label: option ? String(option[names.value.label] ?? option[names.value.value]) : (props.placeholder ?? locale.value.select) }
}))

const lastLevel = () => Math.min(selectedOptions.value.length, levels.value.length - 1)
const activeTab = ref(lastLevel())

watch(value, (val) => {
  const same = val.length === path.value.length && val.every((item, index) => item === path.value[index])
  path.value = val.slice()
  if (!same)
    activeTab.value = lastLevel()
})
watch(() => levels.value.length, (length) => {
  if (activeTab.value > length - 1)
    activeTab.value = length - 1
})

function setActiveTab(index: number) {
  if (index === activeTab.value)
    return
  activeTab.value = index
  emit('tabChange', index)
}

// ---------- list (virtualized, one VirtualList per level) ----------
/** fallback of `--am-cascader-view-option-height`, the estimate used before a row is measured */
const DEFAULT_ITEM_HEIGHT = 48

const listRef = ref<VirtualListExpose>()
/** rows are measured unless every row is known to be exactly `listItemHeight` tall */
const fixedHeight = computed(() => props.listItemHeight !== undefined && !slots.option && props.optionRender === undefined)
const rootStyle = computed(() => [
  {
    '--am-cascader-view-option-height': addUnit(props.listItemHeight),
    // `listHeight` sizes the list, the view grows around it
    'height': props.listHeight !== undefined ? 'auto' : undefined,
  },
  props.styles?.root,
])
const listStyle = computed(() => [props.listHeight !== undefined ? { flex: 'none' } : undefined, props.styles?.list])

/** brings the selected option of the active level to the middle of the list */
function scrollToSelected() {
  const key = path.value[activeTab.value]
  if (key !== undefined && levels.value[activeTab.value]?.some(option => option[names.value.value] === key))
    listRef.value?.scrollTo({ key, align: 'center' })
}

// the list is re-created per level: runs once the new one is mounted
watch(activeTab, () => nextTick(scrollToSelected), { flush: 'post' })
onMounted(() => nextTick(scrollToSelected))

function commit(next: CascaderValue[], selected: CascaderOption[]) {
  setValue(next)
  emit('update:value', next)
  emit('change', next, selected)
}

// ---------- lazy loading ----------
const loading = ref<{ path: CascaderValue[], level: number }>()
function isLoading(option: CascaderOption, level: number) {
  return !!loading.value && loading.value.level === level && loading.value.path[level] === option[names.value.value]
}

function finishLoading() {
  const current = loading.value
  if (!current)
    return
  loading.value = undefined
  // the user may have gone elsewhere... but taps are blocked while loading, so the path is still ours
  const selected = getSelectedOptions(props.options, current.path, props.fieldNames)
  const option = selected[current.level]
  if (option?.[names.value.children]?.length) {
    setActiveTab(current.level + 1)
  }
  else {
    // nothing came back: the option is a leaf after all
    if (!props.changeOnSelect)
      commit(current.path, selected)
    emit('finish', current.path, selected)
  }
}

watch(() => props.options, () => {
  const current = loading.value
  if (!current)
    return
  const option = getSelectedOptions(props.options, current.path, props.fieldNames)[current.level]
  // `loadData` without a promise: done as soon as the option got children (or turned into a leaf)
  if (!option || option[names.value.children]?.length || option.isLeaf !== false)
    finishLoading()
}, { deep: true })

function onSelect(option: CascaderOption, level: number) {
  if (option.disabled || loading.value)
    return
  const next = [...path.value.slice(0, level), option[names.value.value] as CascaderValue]
  path.value = next
  const selected = selectedOptions.value.slice()
  emit('select', option, level)

  const children = option[names.value.children] as CascaderOption[] | undefined
  const hasChildren = !!children?.length
  const lazy = !hasChildren && !!props.loadData && option.isLeaf === false

  if (props.changeOnSelect || (!hasChildren && !lazy))
    commit(next, selected)

  if (hasChildren) {
    setActiveTab(level + 1)
  }
  else if (lazy) {
    loading.value = { path: next, level }
    const result = props.loadData!(selected)
    if (isPromise(result))
      result.then(finishLoading, finishLoading)
  }
  else {
    emit('finish', next, selected)
  }
}

defineExpose({ scrollToSelected })
</script>

<template>
  <div v-bind="$attrs" class="am-cascader-view" :class="[rootClass, classes?.root]" :style="rootStyle">
    <div class="am-cascader-view-tabs" :class="classes?.tabs" :style="styles?.tabs" role="tablist">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="am-cascader-view-tab"
        :class="[
          { 'am-cascader-view-tab-active': index === activeTab, 'am-cascader-view-tab-placeholder': !tab.selected },
          classes?.tab,
        ]"
        :style="styles?.tab"
        role="tab"
        :aria-selected="index === activeTab"
        @click="setActiveTab(index)"
      >
        {{ tab.label }}
      </div>
    </div>
    <VirtualList
      :key="activeTab"
      ref="listRef"
      class="am-cascader-view-list"
      :class="classes?.list"
      :style="listStyle"
      role="listbox"
      :data="levels[activeTab]"
      :item-key="names.value"
      :virtual="virtual"
      :height="listHeight"
      :item-height="listItemHeight ?? DEFAULT_ITEM_HEIGHT"
      :fixed="fixedHeight"
    >
      <template #default="{ item: option }">
        <div
          class="am-cascader-view-option"
          :class="[
            {
              'am-cascader-view-option-selected': path[activeTab] === option[names.value],
              'am-cascader-view-option-disabled': option.disabled,
            },
            classes?.option,
          ]"
          :style="styles?.option"
          role="option"
          :aria-selected="path[activeTab] === option[names.value]"
          :aria-disabled="option.disabled || undefined"
          @click="onSelect(option, activeTab)"
        >
          <span class="am-cascader-view-option-label">
            <slot name="option" :option="option" :level="activeTab" :selected="path[activeTab] === option[names.value]">
              <RenderNode
                v-if="optionRender !== undefined"
                :node="optionRender"
                :params="{ option, level: activeTab, selected: path[activeTab] === option[names.value] }"
              />
              <template v-else>
                {{ option[names.label] ?? option[names.value] }}
              </template>
            </slot>
          </span>
          <Spinner v-if="isLoading(option, activeTab)" class="am-cascader-view-option-icon" />
          <CheckOutlined v-else-if="path[activeTab] === option[names.value]" class="am-cascader-view-option-icon" />
        </div>
      </template>
      <template v-if="!levels[activeTab]?.length" #footer>
        <div class="am-cascader-view-empty">
          <slot name="notFoundContent">
            <RenderNode v-if="notFoundContent !== undefined" :node="notFoundContent" />
            <template v-else>
              {{ emptyLocale.description }}
            </template>
          </slot>
        </div>
      </template>
    </VirtualList>
  </div>
</template>
