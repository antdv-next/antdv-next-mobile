import { withInstall } from '../_util/withInstall'
import ColorPickerVue from './ColorPicker.vue'
import ColorPickerPanelVue from './ColorPickerPanel.vue'

export type * from './interface'

/** Inline panel, embeddable in a page: `ColorPicker.Panel`, `<am-color-picker-panel>`. */
export const ColorPickerPanel = withInstall(ColorPickerPanelVue, 'AmColorPickerPanel')

const ColorPicker = withInstall(ColorPickerVue, 'AmColorPicker', { Panel: ColorPickerPanel })

export default ColorPicker
