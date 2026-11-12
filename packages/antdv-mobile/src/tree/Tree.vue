<script setup lang="ts">
import type { Key } from '../_util/type'
import type { VirtualListExpose } from '../virtual-list/interface'
import type { TreeSlotFlags } from './context'
import type {
  TreeCheckedKeys,
  TreeCheckInfo,
  TreeDataNode,
  TreeEmits,
  TreeEventDataNode,
  TreeProps,
  TreeScrollToConfig,
  TreeSlots,
} from './interface'
import { computed, nextTick, onBeforeUpdate, onMounted, provide, reactive, ref, useSlots, watch } from 'vue'
import { addUnit, noop } from '../_util'
import { useControlled } from '../_util/hooks'
import { useDisabled } from '../config-provider/context'
import { formItemInputContextKey, useFormItemInputContext } from '../form/context'
import VirtualList from '../virtual-list/VirtualList.vue'
import { treeContextKey } from './context'
import TreeNode from './TreeNode.vue'
import {
  arrAdd,
  arrDel,
  calcSelectedKeys,
  conductCheck,
  conductExpandParent,
  convertDataToEntities,
  fillFieldNames,
  flattenTreeData,
  parseCheckedKeys,
} from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmTree', inheritAttrs: false })

const props = withDefaults(defineProps<TreeProps>(), {
  defaultExpandAll: false,
  autoExpandParent: false,
  defaultExpandParent: true,
  checkable: false,
  checkStrictly: false,
  selectable: true,
  multiple: false,
  disabled: undefined,
  blockNode: true,
  showIcon: false,
  showLine: false,
  icon: undefined,
  switcherIcon: undefined,
  switcherLoadingIcon: undefined,
  expandAction: false,
  virtual: true,
})
const emit = defineEmits<TreeEmits>()
defineSlots<TreeSlots>()
const slots = useSlots() as TreeSlots

// `slots` is not reactive: mirror which ones exist so the rows update when a slot is added / removed (`v-if` on a slot)
function readSlotFlags(): TreeSlotFlags {
  return {
    title: !!slots.title,
    titleRender: !!slots.titleRender,
    icon: !!slots.icon,
    switcherIcon: !!slots.switcherIcon,
    switcherLoadingIcon: !!slots.switcherLoadingIcon,
  }
}
const hasSlot = reactive(readSlotFlags())
onBeforeUpdate(() => Object.assign(hasSlot, readSlotFlags()))

/** fallback of `--am-tree-item-height`, the estimate used before a row is measured */
const DEFAULT_ITEM_HEIGHT = 44
const MAX_RETRY_TIMES = 10

const disabled = useDisabled(() => props.disabled)
const formItem = useFormItemInputContext()
// The row checkboxes are parts of the tree, not fields of their own: keep the FormItem id / triggers away from them.
provide(formItemInputContextKey, {
  status: formItem.status,
  id: computed(() => undefined),
  onFieldChange: noop,
  onFieldBlur: noop,
  isFormItemInput: false,
})

// ---------- data ----------
const fieldNames = computed(() => fillFieldNames(props.fieldNames))
const entities = computed(() => convertDataToEntities(props.treeData, fieldNames.value))

function getNode(key: Key): TreeDataNode | undefined {
  return entities.value.keyEntities.get(key)?.node
}

function getNodes(keys: Key[]): TreeDataNode[] {
  const nodes: TreeDataNode[] = []
  keys.forEach((key) => {
    const node = getNode(key)
    if (node)
      nodes.push(node)
  })
  return nodes
}

// ---------- expanded ----------
function getInitExpandedKeys(): Key[] {
  const { keyEntities } = entities.value
  const keys = props.defaultExpandAll
    ? Array.from(keyEntities.keys())
    : props.expandedKeys ?? props.defaultExpandedKeys ?? []
  return props.defaultExpandParent ? conductExpandParent(keys, keyEntities) : keys
}

const initExpandedProp = props.expandedKeys
const initExpandedKeys = getInitExpandedKeys()

const [innerExpandedKeys, setExpandedKeys] = useControlled<TreeProps, 'expandedKeys', Key[]>(props, 'expandedKeys', {
  defaultValue: () => initExpandedKeys,
  onChange: keys => emit('update:expandedKeys', keys),
})

const expandedKeys = computed<Key[]>(() => {
  const keys = innerExpandedKeys.value ?? []
  if (props.expandedKeys === undefined)
    return keys
  // `defaultExpandParent` / `defaultExpandAll` apply to the initial keys only (same as PC)
  if (props.expandedKeys === initExpandedProp)
    return initExpandedKeys
  return props.autoExpandParent ? conductExpandParent(keys, entities.value.keyEntities) : keys
})
const expandedSet = computed(() => new Set(expandedKeys.value))

const flatNodes = computed(() => flattenTreeData(props.treeData, expandedSet.value, fieldNames.value))

// ---------- selected ----------
const [innerSelectedKeys, setSelectedKeys] = useControlled<TreeProps, 'selectedKeys', Key[]>(props, 'selectedKeys', {
  defaultValue: () => props.defaultSelectedKeys ?? [],
  onChange: keys => emit('update:selectedKeys', keys),
})
const selectedKeys = computed(() => calcSelectedKeys(innerSelectedKeys.value, props.multiple))
const selectedSet = computed(() => new Set(selectedKeys.value))

// ---------- checked ----------
const [rawCheckedKeys, setRawCheckedKeys] = useControlled<TreeProps, 'checkedKeys', TreeCheckedKeys>(props, 'checkedKeys', {
  defaultValue: () => props.defaultCheckedKeys ?? [],
  onChange: keys => emit('update:checkedKeys', Array.isArray(keys) ? keys : keys.checked),
})

const mergedChecked = computed(() => {
  if (!props.checkable)
    return { checkedKeys: [] as Key[], halfCheckedKeys: [] as Key[] }
  const parsed = parseCheckedKeys(rawCheckedKeys.value)
  // nothing to conduct through while the data is still empty: keep the keys as they are
  if (props.checkStrictly || !entities.value.keyEntities.size)
    return parsed
  return conductCheck(parsed.checkedKeys, true, entities.value)
})
const checkedSet = computed(() => new Set(mergedChecked.value.checkedKeys))
const halfCheckedSet = computed(() => new Set(mergedChecked.value.halfCheckedKeys))

// ---------- async loading ----------
const [loadedKeys, setLoadedKeys] = useControlled<TreeProps, 'loadedKeys', Key[]>(props, 'loadedKeys', {
  defaultValue: () => [],
})
const loadedSet = computed(() => new Set(loadedKeys.value ?? []))
const loadingKeys = ref<Key[]>([])
const loadingSet = computed(() => new Set(loadingKeys.value))
const retryTimes = new Map<Key, number>()

function getEventNode(key: Key): TreeEventDataNode {
  const entity = entities.value.keyEntities.get(key)
  return {
    ...entity?.node,
    key,
    expanded: expandedSet.value.has(key),
    selected: selectedSet.value.has(key),
    checked: checkedSet.value.has(key),
    halfChecked: halfCheckedSet.value.has(key),
    loaded: loadedSet.value.has(key),
    loading: loadingSet.value.has(key),
    pos: entity?.pos ?? '',
  }
}

function onNodeLoad(node: TreeEventDataNode): Promise<void> | undefined {
  const key = node.key
  const { loadData } = props
  if (!loadData || entities.value.keyEntities.get(key)?.children.length)
    return undefined
  if (loadedSet.value.has(key) || loadingSet.value.has(key))
    return undefined

  loadingKeys.value = arrAdd(loadingKeys.value, key)
  let result: Promise<any> | void
  try {
    result = loadData(node)
  }
  catch (error) {
    result = Promise.reject(error)
  }
  return Promise.resolve(result).then(
    () => {
      const nextLoadedKeys = arrAdd(loadedKeys.value ?? [], key)
      setLoadedKeys(nextLoadedKeys)
      loadingKeys.value = arrDel(loadingKeys.value, key)
      emit('load', nextLoadedKeys, { event: 'load', node })
    },
    (error) => {
      loadingKeys.value = arrDel(loadingKeys.value, key)
      const times = (retryTimes.get(key) ?? 0) + 1
      retryTimes.set(key, times)
      // give up after too many failures: treat the node as loaded so it stops asking
      if (times >= MAX_RETRY_TIMES) {
        setLoadedKeys(arrAdd(loadedKeys.value ?? [], key))
        return
      }
      throw error
    },
  )
}

/** nodes that are expanded without children (`defaultExpandedKeys`, controlled keys) load on their own */
function loadExpandedNodes() {
  if (!props.loadData)
    return
  const { keyEntities } = entities.value
  flatNodes.value.forEach((item) => {
    if (!expandedSet.value.has(item.key) || item.data.isLeaf === true)
      return
    if (keyEntities.get(item.key)?.children.length)
      return
    onNodeLoad(getEventNode(item.key))?.catch(noop)
  })
}

onMounted(loadExpandedNodes)
watch([flatNodes, loadedSet, () => props.loadData], loadExpandedNodes, { flush: 'post' })

// ---------- node events ----------
function onNodeExpand(event: Event, node: TreeEventDataNode) {
  const key = node.key
  const targetExpanded = !expandedSet.value.has(key)
  const nextExpandedKeys = targetExpanded ? arrAdd(expandedKeys.value, key) : arrDel(expandedKeys.value, key)
  setExpandedKeys(nextExpandedKeys)
  emit('expand', nextExpandedKeys, { node, expanded: targetExpanded, nativeEvent: event })

  if (targetExpanded && props.loadData) {
    // a failed load collapses the node again so the next tap retries
    onNodeLoad(node)?.catch(() => {
      if (expandedSet.value.has(key))
        setExpandedKeys(arrDel(expandedKeys.value, key))
    })
  }
}

function onNodeSelect(event: Event, node: TreeEventDataNode) {
  const key = node.key
  const targetSelected = !selectedSet.value.has(key)
  let nextSelectedKeys: Key[]
  if (!targetSelected)
    nextSelectedKeys = arrDel(selectedKeys.value, key)
  else if (!props.multiple)
    nextSelectedKeys = [key]
  else
    nextSelectedKeys = arrAdd(selectedKeys.value, key)

  setSelectedKeys(nextSelectedKeys)
  emit('select', nextSelectedKeys, {
    event: 'select',
    selected: targetSelected,
    node,
    selectedNodes: getNodes(nextSelectedKeys),
    nativeEvent: event,
  })
  formItem.onFieldChange()
}

function onNodeCheck(event: Event, node: TreeEventDataNode, checked: boolean) {
  const { checkedKeys: oriCheckedKeys, halfCheckedKeys: oriHalfCheckedKeys } = mergedChecked.value
  const key = node.key
  const info: TreeCheckInfo = { event: 'check', node, checked, nativeEvent: event, checkedNodes: [] }
  let checkedValue: TreeCheckedKeys

  if (props.checkStrictly) {
    const nextCheckedKeys = checked ? arrAdd(oriCheckedKeys, key) : arrDel(oriCheckedKeys, key)
    checkedValue = { checked: nextCheckedKeys, halfChecked: arrDel(oriHalfCheckedKeys, key) }
    info.checkedNodes = getNodes(nextCheckedKeys)
  }
  else {
    let conducted = conductCheck([...oriCheckedKeys, key], true, entities.value)
    if (!checked) {
      const keySet = new Set(conducted.checkedKeys)
      keySet.delete(key)
      conducted = conductCheck(
        Array.from(keySet),
        { checked: false, halfCheckedKeys: conducted.halfCheckedKeys },
        entities.value,
      )
    }
    checkedValue = conducted.checkedKeys
    info.halfCheckedKeys = conducted.halfCheckedKeys
    info.checkedNodesPositions = []
    conducted.checkedKeys.forEach((checkedKey) => {
      const entity = entities.value.keyEntities.get(checkedKey)
      if (!entity)
        return
      info.checkedNodes.push(entity.node)
      info.checkedNodesPositions!.push({ node: entity.node, pos: entity.pos })
    })
  }

  setRawCheckedKeys(checkedValue)
  emit('check', checkedValue, info)
  formItem.onFieldChange()
}

function onNodeClick(event: MouseEvent, node: TreeEventDataNode) {
  emit('click', event, node)
}

provide(treeContextKey, {
  props,
  slots,
  hasSlot,
  disabled,
  fieldNames,
  expandedKeys: expandedSet,
  selectedKeys: selectedSet,
  checkedKeys: checkedSet,
  halfCheckedKeys: halfCheckedSet,
  loadedKeys: loadedSet,
  loadingKeys: loadingSet,
  getEventNode,
  onNodeClick,
  onNodeExpand,
  onNodeSelect,
  onNodeCheck,
})

// ---------- list ----------
const listRef = ref<VirtualListExpose>()
const mergedHeight = computed(() => props.height ?? props.listHeight)
const mergedItemHeight = computed(() => props.itemHeight ?? props.listItemHeight)
/** windowing needs a scroll container of its own; without `height` the tree grows with its content */
const mergedVirtual = computed(() => props.virtual && mergedHeight.value !== undefined && mergedHeight.value !== '')

const classNames = computed(() => [
  'am-tree',
  {
    'am-tree-block-node': props.blockNode,
    'am-tree-show-line': !!props.showLine,
    'am-tree-checkable': props.checkable,
    'am-tree-unselectable': !props.selectable,
    'am-tree-disabled': disabled.value,
  },
  props.rootClass,
  props.classes?.root,
])

const ALIGN = { top: 'start', bottom: 'end', center: 'center', auto: 'auto' } as const

function scrollTo(target: number | TreeScrollToConfig) {
  if (typeof target === 'number') {
    listRef.value?.scrollTo(target)
    return
  }
  if (!target || target.key === undefined)
    return
  const run = () => listRef.value?.scrollTo({
    key: target.key,
    align: ALIGN[target.align ?? 'top'] ?? 'start',
    offset: target.offset,
  })
  if (target.autoExpand && props.expandedKeys === undefined && !expandedSet.value.has(target.key)) {
    setExpandedKeys(arrAdd(expandedKeys.value, target.key))
    nextTick(run)
    return
  }
  run()
}

defineExpose({
  scrollTo,
  /** the scroll container */
  get nativeElement() {
    return listRef.value?.nativeElement
  },
})
</script>

<template>
  <VirtualList
    ref="listRef"
    v-bind="$attrs"
    role="tree"
    :class="classNames"
    :style="[{ '--am-tree-item-height': addUnit(mergedItemHeight) }, styles?.root]"
    :aria-multiselectable="multiple || undefined"
    :aria-disabled="disabled || undefined"
    :data="flatNodes"
    item-key="key"
    :virtual="mergedVirtual"
    :height="mergedHeight"
    :item-height="mergedItemHeight ?? DEFAULT_ITEM_HEIGHT"
    @scroll="emit('scroll', $event)"
  >
    <template #default="{ item }">
      <TreeNode :node="item" />
    </template>
  </VirtualList>
</template>
