<script setup lang="ts">
import type { VueNode } from '../_util/type'
import type { CardProps, CardSlots } from './interface'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useSize } from '../config-provider/context'
import { flattenChildren } from '../space/util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCard', inheritAttrs: false })

const props = withDefaults(defineProps<CardProps>(), {
  bordered: undefined,
  loading: false,
  clickable: false,
})
const slots = defineSlots<CardSlots>()

const contextSize = useSize(() => (props.size === 'default' ? 'middle' : props.size))

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''
const variant = computed(() => props.variant ?? (props.bordered === false ? 'borderless' : 'outlined'))
const hasTitle = computed(() => !!slots.title || isNode(props.title))
const hasExtra = computed(() => !!slots.extra || isNode(props.extra))
const hasCover = computed(() => !!slots.cover || isNode(props.cover))
const hasFooter = computed(() => !!slots.footer || isNode(props.footer))

const classNames = computed(() => [
  'am-card',
  variant.value === 'borderless' ? 'am-card-borderless' : 'am-card-bordered',
  {
    'am-card-small': contextSize.value === 'small',
    'am-card-loading': props.loading,
    'am-card-clickable': props.clickable,
    'am-card-type-inner': props.type === 'inner',
    'am-card-contain-cover': hasCover.value,
  },
  props.rootClass,
  props.classes?.root,
])

// Actions are collected while rendering (by the `v-if` of the list) so that slot content stays reactive.
let actionNodes: unknown[] = []
function collectActions() {
  actionNodes = slots.actions ? flattenChildren(slots.actions()) : (props.actions ?? []).filter(isNode)
  return actionNodes.length > 0
}
const getActions = () => actionNodes as VueNode[]
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div v-if="hasTitle || hasExtra" class="am-card-header" :class="classes?.header" :style="styles?.header">
      <div v-if="hasTitle" class="am-card-title" :class="classes?.title" :style="styles?.title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
      <div v-if="hasExtra" class="am-card-extra" :class="classes?.extra" :style="styles?.extra">
        <slot name="extra">
          <RenderNode :node="extra" />
        </slot>
      </div>
    </div>
    <div v-if="hasCover" class="am-card-cover" :class="classes?.cover" :style="styles?.cover">
      <slot name="cover">
        <RenderNode :node="cover" />
      </slot>
    </div>
    <div v-if="loading || $slots.default" class="am-card-body" :class="classes?.body" :style="styles?.body">
      <div v-if="loading" class="am-card-skeleton" aria-busy="true">
        <div class="am-card-skeleton-row am-card-skeleton-title" />
        <div class="am-card-skeleton-row" />
        <div class="am-card-skeleton-row" />
        <div class="am-card-skeleton-row am-card-skeleton-last" />
      </div>
      <slot v-else />
    </div>
    <div v-if="hasFooter" class="am-card-footer" :class="classes?.footer" :style="styles?.footer">
      <slot name="footer">
        <RenderNode :node="footer" />
      </slot>
    </div>
    <ul v-if="collectActions()" class="am-card-actions" :class="classes?.actions" :style="styles?.actions">
      <li v-for="(action, index) in getActions()" :key="index" class="am-card-action">
        <RenderNode :node="action" />
      </li>
    </ul>
  </div>
</template>
