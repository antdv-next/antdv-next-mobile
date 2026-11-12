<script setup lang="ts">
import type { ImagePreviewImage } from '../image-preview/interface'
import type { ImagePreviewGroupConfig, ImagePreviewGroupEmits, ImagePreviewGroupProps, ImagePreviewGroupSlots } from './interface'
import { computed, provide, ref, shallowReactive } from 'vue'
import { clamp } from '../_util'
import ImagePreview from '../image-preview/ImagePreview.vue'
import { imagePreviewGroupContextKey } from './context'

defineOptions({ name: 'AmImagePreviewGroup', inheritAttrs: false })

const props = withDefaults(defineProps<ImagePreviewGroupProps>(), {
  preview: true,
})
const emit = defineEmits<ImagePreviewGroupEmits>()
defineSlots<ImagePreviewGroupSlots>()

const config = computed<ImagePreviewGroupConfig>(() => (typeof props.preview === 'object' && props.preview ? props.preview : {}))
const enabled = computed(() => props.preview !== false)

/** previewable images inside the group, in registration (= render) order */
const registry = shallowReactive(new Map<symbol, () => ImagePreviewImage | undefined>())

const collected = computed(() => {
  const list: Array<{ id: symbol, image: ImagePreviewImage }> = []
  registry.forEach((getImage, id) => {
    const image = getImage()
    if (image)
      list.push({ id, image })
  })
  return list
})

const images = computed<ImagePreviewImage[]>(() => {
  if (props.items)
    return props.items.map(item => (typeof item === 'string' ? { src: item } : item))
  return collected.value.map(item => item.image)
})

const innerOpen = ref(false)
const innerCurrent = ref(0)
const open = computed(() => config.value.open ?? innerOpen.value)
const current = computed(() => clamp(config.value.current ?? innerCurrent.value, 0, Math.max(images.value.length - 1, 0)))

const previewProps = computed(() => {
  const { open: _open, src: _src, current: _current, maxScale, minScale, ...rest } = config.value
  return {
    ...rest,
    ...(maxScale !== undefined ? { maxZoom: maxScale } : {}),
    ...(minScale !== undefined ? { minZoom: minScale } : {}),
  }
})

function setOpen(value: boolean, index = current.value) {
  if (value === open.value)
    return
  innerOpen.value = value
  emit('openChange', value, { current: index })
}

function setCurrent(value: number) {
  const prev = current.value
  if (value === prev)
    return
  innerCurrent.value = value
  emit('change', value, prev)
}

provide(imagePreviewGroupContextKey, {
  enabled,
  fallback: computed(() => props.fallback),
  register(id, getImage) {
    registry.set(id, getImage)
    return () => registry.delete(id)
  },
  open(id) {
    let index = collected.value.findIndex(item => item.id === id)
    if (props.items) {
      // map the tapped image onto `items` by its src, falling back to its position
      const src = collected.value[index]?.image.src
      const matched = images.value.findIndex(item => item.src === src)
      index = matched >= 0 ? matched : index
    }
    index = clamp(index, 0, Math.max(images.value.length - 1, 0))
    if (index !== current.value)
      setCurrent(index)
    setOpen(true, index)
  },
})
</script>

<template>
  <slot />
  <ImagePreview
    v-if="enabled"
    v-bind="previewProps"
    :open="open"
    :current="current"
    :images="images"
    @update:open="setOpen($event)"
    @update:current="setCurrent"
  />
</template>
