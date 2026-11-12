<script setup lang="ts">
import type { Key } from '../_util/type'
import type { CollapsePanelInfo, CollapsePanelProps, CollapsePanelSlots } from './interface'
import { RightOutlined } from '@antdv-next/icons'
import { computed, getCurrentInstance, inject, ref } from 'vue'
import { genId, isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import CollapseTransition from '../collapse-transition/CollapseTransition.vue'
import { collapseContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCollapsePanel', inheritAttrs: false })

const props = withDefaults(defineProps<CollapsePanelProps>(), {
  header: undefined,
  extra: undefined,
  showArrow: undefined,
  forceRender: false,
})
const slots = defineSlots<CollapsePanelSlots>()

const context = inject(collapseContextKey, undefined)
const instance = getCurrentInstance()
/** like antdv-next, the panel is identified by its vnode `key` */
const panelKey = (instance?.vnode.key ?? genId('am-collapse-panel')) as Key
const contentId = genId('am-collapse-content')

// a panel used on its own keeps its own state
const selfActive = ref(false)
const active = computed(() => (context ? context.isActive(panelKey) : selfActive.value))

const collapsible = computed(() => props.collapsible ?? context?.collapsible.value)
const disabled = computed(() => collapsible.value === 'disabled')
const showArrow = computed(() => props.showArrow ?? true)

const hasExtra = computed(() => !!slots.extra || isRenderable(props.extra))

const panelInfo = computed<CollapsePanelInfo>(() => ({
  panelKey,
  isActive: active.value,
  header: props.header,
  extra: props.extra,
  showArrow: showArrow.value,
  forceRender: props.forceRender,
  collapsible: collapsible.value,
}))

function toggle() {
  if (disabled.value)
    return
  if (context)
    context.toggle(panelKey)
  else
    selfActive.value = !selfActive.value
}

function handleClick(area: 'header' | 'title' | 'icon') {
  const trigger = collapsible.value === 'header' ? 'title' : collapsible.value === 'icon' ? 'icon' : 'header'
  if (area === trigger)
    toggle()
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="am-collapse-item"
    :class="{
      'am-collapse-item-active': active,
      'am-collapse-item-disabled': disabled,
      [`am-collapse-item-collapsible-${collapsible}`]: !!collapsible,
    }"
  >
    <div
      class="am-collapse-header"
      :class="[context?.classes.value?.header, classes?.header]"
      :style="[context?.styles.value?.header, styles?.header]"
      :role="collapsible ? undefined : 'button'"
      :tabindex="collapsible ? undefined : 0"
      :aria-expanded="active"
      :aria-controls="contentId"
      :aria-disabled="disabled || undefined"
      @click="handleClick('header')"
      @keydown.enter="handleClick('header')"
    >
      <span
        v-if="showArrow"
        class="am-collapse-expand-icon"
        :class="[context?.classes.value?.icon, classes?.icon]"
        :style="[context?.styles.value?.icon, styles?.icon]"
        @click="handleClick('icon')"
      >
        <RenderNode v-if="context?.expandIcon.value" :node="context.expandIcon.value" :params="panelInfo" />
        <RightOutlined v-else class="am-collapse-arrow" />
      </span>
      <span
        class="am-collapse-title"
        :class="[context?.classes.value?.title, classes?.title]"
        :style="[context?.styles.value?.title, styles?.title]"
        @click="handleClick('title')"
      >
        <slot name="header">
          <RenderNode :node="header" />
        </slot>
      </span>
      <span v-if="hasExtra" class="am-collapse-extra">
        <slot name="extra">
          <RenderNode :node="extra" />
        </slot>
      </span>
    </div>
    <CollapseTransition
      :id="contentId"
      :open="active"
      :force-render="forceRender"
      :destroy-on-hidden="!!context?.destroyOnHidden.value"
      class="am-collapse-panel"
      role="region"
    >
      <div
        class="am-collapse-body"
        :class="[context?.classes.value?.body, classes?.body]"
        :style="[context?.styles.value?.body, styles?.body]"
      >
        <slot />
      </div>
    </CollapseTransition>
  </div>
</template>
