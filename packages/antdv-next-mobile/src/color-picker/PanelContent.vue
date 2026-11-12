<script setup lang="ts">
import Divider from '../divider/Divider.vue'
import { useColorPickerPanelContext } from './context'
import PanelPicker from './PanelPicker.vue'
import PanelPresets from './PanelPresets.vue'

/** Internal: the default panel content (`panel` of `panelRender`). */
defineOptions({ name: 'AmColorPickerPanelContent' })

const ctx = useColorPickerPanelContext()
</script>

<template>
  <div class="am-color-picker-panel-content">
    <PanelPicker />
    <Divider v-if="Array.isArray(ctx.presets.value)" class="am-color-picker-divider" />
    <PanelPresets />
  </div>
</template>
