<script setup lang="ts">
import type { ImagePreviewEmits, ImagePreviewImage, ImagePreviewProps, ImagePreviewSlots } from './interface'
import { CloseOutlined } from '@antdv-next/icons'
import { computed, nextTick, ref, watch } from 'vue'
import { clamp, inBrowser, resolveContainer } from '../_util'
import { nextZIndex, useControlled, useEventListener, useLockScroll } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import Carousel from '../carousel/Carousel.vue'
import { useConfig, usePopupTheme } from '../config-provider/context'
import { useLocale } from '../locale'
import ImagePreviewItem from './ImagePreviewItem.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmImagePreview', inheritAttrs: false })

const props = withDefaults(defineProps<ImagePreviewProps>(), {
  open: undefined,
  defaultOpen: false,
  images: () => [],
  defaultCurrent: 0,
  loop: true,
  showIndex: true,
  closable: false,
  closeIcon: undefined,
  closeOnClick: true,
  swipeToClose: true,
  maxZoom: 3,
  minZoom: 1 / 3,
  doubleTapZoom: true,
  getContainer: undefined,
})
const emit = defineEmits<ImagePreviewEmits>()
defineSlots<ImagePreviewSlots>()

const config = useConfig()
const popupTheme = usePopupTheme()
const commonLocale = useLocale('common')

const rootRef = ref<HTMLElement>()
const carouselRef = ref<InstanceType<typeof Carousel>>()

const [open, setOpen] = useControlled(props, 'open', {
  defaultValue: props.defaultOpen,
  onChange: (value: boolean) => {
    emit('update:open', value)
    emit('openChange', value)
  },
})
const [current, setCurrent] = useControlled(props, 'current', {
  defaultValue: props.defaultCurrent,
  onChange: (value: number) => {
    emit('update:current', value)
    emit('change', value)
  },
})

const list = computed<ImagePreviewImage[]>(() => props.images.map(item => (typeof item === 'string' ? { src: item } : item)))
const total = computed(() => list.value.length)
const safeCurrent = computed(() => clamp(current.value ?? 0, 0, Math.max(total.value - 1, 0)))
const indexInfo = computed(() => ({ current: safeCurrent.value, total: total.value }))

const zIndex = ref<number | undefined>(props.zIndex)
const rootSize = ref({ width: 0, height: 0 })
/** 0 - 1, how far the image is dragged down (fades the backdrop) */
const dragProgress = ref(0)
/** index shown by the carousel, used to tell user swipes from external `current` changes */
let swiperIndex = safeCurrent.value

function resize() {
  if (!inBrowser)
    return
  const root = rootRef.value
  rootSize.value = {
    width: root?.offsetWidth || window.innerWidth,
    height: root?.offsetHeight || window.innerHeight,
  }
}

watch(
  open,
  (value) => {
    if (value) {
      zIndex.value = props.zIndex ?? nextZIndex()
      dragProgress.value = 0
      swiperIndex = safeCurrent.value
      resize()
      nextTick(resize)
    }
  },
  { immediate: true },
)
watch(() => props.zIndex, (value) => {
  if (value !== undefined)
    zIndex.value = value
})
watch(safeCurrent, (value) => {
  if (value !== swiperIndex) {
    swiperIndex = value
    carouselRef.value?.goTo(value, true)
  }
})

useEventListener('resize', resize)
useEventListener('orientationchange', resize)
useLockScroll(rootRef, () => !!open.value)

const container = computed(() => {
  if (props.getContainer === false)
    return null
  if (props.getContainer !== undefined)
    return resolveContainer(props.getContainer)
  return config.getPopupContainer.value?.() ?? resolveContainer()
})

function close() {
  if (!open.value)
    return
  emit('close')
  setOpen(false)
}

function onTap() {
  if (props.closeOnClick)
    close()
}

function onBeforeChange(_: number, next: number) {
  swiperIndex = next
  if (next !== safeCurrent.value)
    setCurrent(next)
}

useEventListener('keydown', (event: KeyboardEvent) => {
  if (open.value && event.key === 'Escape')
    close()
})

defineExpose({
  close,
  /** switch to an image */
  goTo: (index: number, dontAnimate?: boolean) => carouselRef.value?.goTo(index, dontAnimate),
})
</script>

<template>
  <Teleport :to="container ?? 'body'" :disabled="!container">
    <Transition name="am-fade" appear @after-enter="emit('afterOpenChange', true)" @after-leave="emit('afterOpenChange', false)">
      <div
        v-if="open"
        ref="rootRef"
        v-bind="$attrs"
        class="am-image-preview"
        :class="[popupTheme.class, rootClass, classes?.root]"
        :style="[popupTheme.style, { zIndex }, styles?.root]"
        :dir="popupTheme.dir"
        role="dialog"
        aria-modal="true"
      >
        <div class="am-image-preview-backdrop" :style="dragProgress ? { opacity: 1 - dragProgress, transitionDuration: '0s' } : undefined" />
        <Carousel
          ref="carouselRef"
          class="am-image-preview-swiper"
          :dots="false"
          :infinite="loop"
          :initial-slide="safeCurrent"
          :draggable="total > 1"
          @before-change="onBeforeChange"
        >
          <ImagePreviewItem
            v-for="(image, index) in list"
            :key="index"
            :src="image.src"
            :alt="image.alt"
            :index="index"
            :active="index === safeCurrent"
            :max-zoom="maxZoom"
            :min-zoom="minZoom"
            :double-tap-zoom="doubleTapZoom"
            :swipe-to-close="swipeToClose"
            :root-width="rootSize.width"
            :root-height="rootSize.height"
            :image-class="classes?.image"
            :image-style="styles?.image"
            @tap="onTap"
            @swipe-close="close"
            @drag-progress="dragProgress = $event"
          >
            <template v-if="$slots.image" #default>
              <slot name="image" :src="image.src" :alt="image.alt" :index="index" />
            </template>
          </ImagePreviewItem>
        </Carousel>
        <div v-if="showIndex && total > 0" class="am-image-preview-index" :class="classes?.index" :style="styles?.index">
          <slot name="index" v-bind="indexInfo">
            {{ safeCurrent + 1 }} / {{ total }}
          </slot>
        </div>
        <button
          v-if="closable"
          type="button"
          class="am-image-preview-close"
          :aria-label="commonLocale.close"
          @click="close"
        >
          <slot name="closeIcon">
            <RenderNode v-if="closeIcon !== undefined" :node="closeIcon" />
            <CloseOutlined v-else />
          </slot>
        </button>
        <div v-if="$slots.footer" class="am-image-preview-footer" :class="classes?.footer" :style="styles?.footer">
          <slot name="footer" v-bind="indexInfo" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
