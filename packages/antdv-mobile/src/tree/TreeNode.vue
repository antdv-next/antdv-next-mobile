<script setup lang="ts">
import type { CheckboxChangeEvent } from '../checkbox/interface'
import type { TreeDataNode, TreeNodeAttribute } from './interface'
import type { TreeFlattenNode } from './util'
import { CaretDownFilled, FileOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { Spinner } from '../_base'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import Checkbox from '../checkbox/Checkbox.vue'
import { useTreeContext } from './context'
import { getNodeChildren } from './util'

/** One row of the tree. Internal: rendered by Tree for every visible node. */
defineOptions({ name: 'AmTreeNode' })

const props = defineProps<{ node: TreeFlattenNode }>()

const ctx = useTreeContext()

const data = computed(() => props.node.data)
const nodeKey = computed(() => props.node.key)
const level = computed(() => props.node.level)

const expanded = computed(() => ctx.expandedKeys.value.has(nodeKey.value))
const selected = computed(() => ctx.selectedKeys.value.has(nodeKey.value))
const checked = computed(() => ctx.checkedKeys.value.has(nodeKey.value))
const halfChecked = computed(() => ctx.halfCheckedKeys.value.has(nodeKey.value))
const loaded = computed(() => ctx.loadedKeys.value.has(nodeKey.value))
const loading = computed(() => ctx.loadingKeys.value.has(nodeKey.value))

const hasChildren = computed(() => getNodeChildren(data.value, ctx.fieldNames.value).length > 0)
const isLeaf = computed(() => {
  const leaf = data.value.isLeaf
  if (leaf === false)
    return false
  if (leaf)
    return true
  if (hasChildren.value)
    return false
  return !ctx.props.loadData || loaded.value
})

const disabled = computed(() => ctx.disabled.value || !!data.value.disabled)
const checkable = computed(() => !!ctx.props.checkable && data.value.checkable !== false)
const selectable = computed(() => (typeof data.value.selectable === 'boolean' ? data.value.selectable : ctx.props.selectable !== false))
const checkboxDisabled = computed(() => disabled.value || !!data.value.disableCheckbox)
const isEnd = computed(() => props.node.isEnd[level.value] === true)

const nodeAttribute = computed<TreeNodeAttribute>(() => ({
  eventKey: nodeKey.value,
  expanded: expanded.value,
  selected: selected.value,
  checked: checked.value,
  halfChecked: halfChecked.value,
  loaded: loaded.value,
  loading: loading.value,
  isLeaf: isLeaf.value,
  disabled: disabled.value,
  disableCheckbox: !!data.value.disableCheckbox,
  checkable: checkable.value,
  selectable: selectable.value,
  pos: props.node.pos,
  level: level.value,
  data: data.value,
}))

// The slots are called through the live `ctx.slots` at render time; `ctx.hasSlot` tells (reactively) whether one exists.
const renderIconSlot = (attrs: TreeNodeAttribute) => ctx.slots.icon?.(attrs)
const renderSwitcherIconSlot = (attrs: TreeNodeAttribute) => ctx.slots.switcherIcon?.(attrs)
const renderSwitcherLoadingIconSlot = () => ctx.slots.switcherLoadingIcon?.()
const renderTitleSlot = (node: TreeDataNode) => (ctx.slots.title ?? ctx.slots.titleRender)?.(node)

// ---------- switcher ----------
const showLine = computed(() => !!ctx.props.showLine)
const leafIcon = computed(() => {
  const config = ctx.props.showLine
  return config && typeof config === 'object' ? config.showLeafIcon : undefined
})
/** node > slot > prop */
const customSwitcher = computed(() => {
  if (isRenderable(data.value.switcherIcon))
    return data.value.switcherIcon
  if (ctx.hasSlot.switcherIcon)
    return renderSwitcherIconSlot
  return isRenderable(ctx.props.switcherIcon) ? ctx.props.switcherIcon : undefined
})
const loadingIcon = computed(() => {
  if (ctx.hasSlot.switcherLoadingIcon)
    return renderSwitcherLoadingIconSlot
  return isRenderable(ctx.props.switcherLoadingIcon) ? ctx.props.switcherLoadingIcon : undefined
})

type SwitcherKind = 'loading' | 'none' | 'leaf-file' | 'leaf-custom' | 'leaf-line' | 'custom' | 'line' | 'caret'

const switcherKind = computed<SwitcherKind>(() => {
  if (loading.value)
    return 'loading'
  if (isLeaf.value) {
    if (isRenderable(data.value.switcherIcon))
      return 'custom'
    if (!showLine.value)
      return 'none'
    if (leafIcon.value === true)
      return 'leaf-file'
    return isRenderable(leafIcon.value) ? 'leaf-custom' : 'leaf-line'
  }
  if (customSwitcher.value !== undefined)
    return 'custom'
  return showLine.value ? 'line' : 'caret'
})

// ---------- icon & title ----------
/** node > slot > prop */
const iconNode = computed(() => {
  if (!ctx.props.showIcon)
    return undefined
  if (isRenderable(data.value.icon))
    return data.value.icon
  if (ctx.hasSlot.icon)
    return renderIconSlot
  return isRenderable(ctx.props.icon) ? ctx.props.icon : undefined
})

const title = computed(() => data.value[ctx.fieldNames.value.title])
const hasTitleSlot = computed(() => ctx.hasSlot.title || ctx.hasSlot.titleRender)

const filtered = computed(() => !!ctx.props.filterTreeNode && !!ctx.props.filterTreeNode(ctx.getEventNode(nodeKey.value)))

// ---------- events ----------
function onExpand(event: Event) {
  if (loading.value || isLeaf.value)
    return
  ctx.onNodeExpand(event, ctx.getEventNode(nodeKey.value))
}

function onCheck(event: Event) {
  if (!checkable.value || checkboxDisabled.value)
    return
  ctx.onNodeCheck(event, ctx.getEventNode(nodeKey.value), !checked.value)
}

function onCheckboxChange(event: CheckboxChangeEvent) {
  onCheck(event.nativeEvent)
}

function onSelectorClick(event: MouseEvent) {
  const node = ctx.getEventNode(nodeKey.value)
  ctx.onNodeClick(event, node)
  if (ctx.props.expandAction === 'click')
    onExpand(event)
  if (selectable.value) {
    if (!disabled.value)
      ctx.onNodeSelect(event, node)
  }
  else {
    onCheck(event)
  }
}

const classNames = computed(() => [
  'am-tree-treenode',
  {
    'am-tree-treenode-disabled': disabled.value,
    'am-tree-treenode-unselectable': !selectable.value,
    'am-tree-treenode-switcher-open': !isLeaf.value && expanded.value,
    'am-tree-treenode-switcher-close': !isLeaf.value && !expanded.value,
    'am-tree-treenode-checkbox-checked': checked.value,
    'am-tree-treenode-checkbox-indeterminate': halfChecked.value,
    'am-tree-treenode-selected': selected.value,
    'am-tree-treenode-loading': loading.value,
    'am-tree-treenode-leaf': isLeaf.value,
    'am-tree-treenode-leaf-last': isEnd.value,
    'am-tree-filter-node': filtered.value,
  },
  data.value.class,
  data.value.className,
  ctx.props.classes?.item,
])
</script>

<template>
  <div
    role="treeitem"
    :class="classNames"
    :style="[{ '--am-tree-level': level }, data.style, ctx.props.styles?.item]"
    :data-key="nodeKey"
    :aria-level="level + 1"
    :aria-expanded="isLeaf ? undefined : expanded"
    :aria-selected="selectable && !disabled ? selected : undefined"
    :aria-checked="checkable && !disabled ? (halfChecked ? 'mixed' : checked) : undefined"
    :aria-disabled="disabled || undefined"
  >
    <span class="am-tree-indent" aria-hidden="true">
      <template v-if="showLine">
        <span
          v-for="index in level"
          :key="index"
          class="am-tree-indent-unit"
          :class="{
            'am-tree-indent-unit-start': node.isStart[index - 1],
            'am-tree-indent-unit-end': node.isEnd[index - 1],
          }"
        />
      </template>
    </span>
    <span
      class="am-tree-switcher"
      :class="[
        isLeaf ? 'am-tree-switcher-noop' : expanded ? 'am-tree-switcher-open' : 'am-tree-switcher-close',
        ctx.props.classes?.itemSwitcher,
      ]"
      :style="ctx.props.styles?.itemSwitcher"
      @click="onExpand"
    >
      <template v-if="switcherKind === 'loading'">
        <span class="am-tree-switcher-loading-icon">
          <RenderNode v-if="loadingIcon !== undefined" :node="loadingIcon" />
          <Spinner v-else />
        </span>
      </template>
      <span v-else-if="switcherKind === 'leaf-line'" class="am-tree-switcher-leaf-line" />
      <span v-else-if="switcherKind === 'leaf-file'" class="am-tree-switcher-line-icon"><FileOutlined /></span>
      <span v-else-if="switcherKind === 'leaf-custom'" class="am-tree-switcher-line-icon">
        <RenderNode :node="leafIcon" :params="nodeAttribute" />
      </span>
      <span v-else-if="switcherKind === 'custom'" :class="showLine ? 'am-tree-switcher-line-icon' : 'am-tree-switcher-icon'">
        <RenderNode :node="customSwitcher" :params="nodeAttribute" />
      </span>
      <span v-else-if="switcherKind === 'line'" class="am-tree-switcher-line-icon">
        <MinusSquareOutlined v-if="expanded" />
        <PlusSquareOutlined v-else />
      </span>
      <span v-else-if="switcherKind === 'caret'" class="am-tree-switcher-icon"><CaretDownFilled /></span>
    </span>
    <Checkbox
      v-if="checkable"
      root-class="am-tree-checkbox"
      skip-group
      :checked="checked"
      :indeterminate="!checked && halfChecked"
      :disabled="checkboxDisabled"
      @change="onCheckboxChange"
    />
    <span
      class="am-tree-node-content-wrapper"
      :class="{ 'am-tree-node-selected': selected && !disabled }"
      @click="onSelectorClick"
    >
      <span v-if="iconNode !== undefined" class="am-tree-icon" :class="ctx.props.classes?.itemIcon" :style="ctx.props.styles?.itemIcon">
        <RenderNode :node="iconNode" :params="nodeAttribute" />
      </span>
      <span class="am-tree-title" :class="ctx.props.classes?.itemTitle" :style="ctx.props.styles?.itemTitle">
        <RenderNode v-if="typeof title === 'function'" :node="title" :params="data" />
        <RenderNode v-else-if="hasTitleSlot" :node="renderTitleSlot" :params="data" />
        <RenderNode v-else-if="ctx.props.titleRender" :node="ctx.props.titleRender" :params="data" />
        <template v-else>
          {{ title ?? '---' }}
        </template>
      </span>
    </span>
  </div>
</template>
