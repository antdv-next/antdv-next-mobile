<script setup lang="ts">
import type { NavBarEmits, NavBarProps, NavBarSlots } from './interface'
import { LeftOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmNavBar', inheritAttrs: false })

const props = withDefaults(defineProps<NavBarProps>(), {
  title: undefined,
  subTitle: undefined,
  back: undefined,
  backIcon: undefined,
  left: undefined,
  right: undefined,
  fixed: false,
  placeholder: false,
  safeArea: false,
  bordered: true,
})
const emit = defineEmits<NavBarEmits>()
const slots = defineSlots<NavBarSlots>()

const locale = useLocale('common')

const isEmpty = (node: unknown) => node === undefined || node === null || node === false || node === true || node === ''

const showBack = computed(() => !!slots.back || (props.back !== null && props.back !== false))
const showBackIcon = computed(() => !!slots.backIcon || (props.backIcon !== null && props.backIcon !== false))
const hasBackText = computed(() => !!slots.back || !isEmpty(props.back))
const hasSubTitle = computed(() => !!slots.subTitle || !isEmpty(props.subTitle))

const classNames = computed(() => [
  'am-nav-bar',
  {
    'am-nav-bar-fixed': props.fixed,
    'am-nav-bar-placeholder': props.fixed && props.placeholder,
    'am-nav-bar-safe-area': props.safeArea,
    'am-nav-bar-bordered': props.bordered,
  },
  props.rootClass,
  props.classes?.root,
])

function handleBack(event: MouseEvent) {
  emit('back', event)
}
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div
      class="am-nav-bar-content"
      :class="classes?.content"
      :style="[zIndex !== undefined ? { zIndex } : undefined, styles?.content]"
    >
      <div class="am-nav-bar-left" :class="classes?.left" :style="styles?.left">
        <div
          v-if="showBack"
          class="am-nav-bar-back"
          :class="classes?.back"
          :style="styles?.back"
          role="button"
          tabindex="0"
          :aria-label="locale.back"
          @click="handleBack"
        >
          <span v-if="showBackIcon" class="am-nav-bar-back-icon">
            <slot name="backIcon">
              <LeftOutlined v-if="backIcon === undefined || backIcon === true" />
              <RenderNode v-else :node="backIcon" />
            </slot>
          </span>
          <span v-if="hasBackText" class="am-nav-bar-back-text">
            <slot name="back">
              <RenderNode :node="back" />
            </slot>
          </span>
        </div>
        <slot name="left">
          <RenderNode :node="left" />
        </slot>
      </div>
      <div class="am-nav-bar-title" :class="classes?.title" :style="styles?.title">
        <div class="am-nav-bar-title-text">
          <slot>
            <slot name="title">
              <RenderNode :node="title" />
            </slot>
          </slot>
        </div>
        <div v-if="hasSubTitle" class="am-nav-bar-sub-title" :class="classes?.subTitle" :style="styles?.subTitle">
          <slot name="subTitle">
            <RenderNode :node="subTitle" />
          </slot>
        </div>
      </div>
      <div class="am-nav-bar-right" :class="classes?.right" :style="styles?.right">
        <slot name="right">
          <RenderNode :node="right" />
        </slot>
      </div>
    </div>
  </div>
</template>
