import type { ComputedRef, InjectionKey } from 'vue'
import type { AggregationColor } from './color'
import type {
  ColorPickerFormat,
  ColorPickerPanelSemanticClassNames,
  ColorPickerPanelSemanticStyles,
  ColorPickerPresetsItem,
} from './interface'
import { inject, provide } from 'vue'

export interface ColorDragInfo {
  type: 'hue' | 'alpha'
  value: number
}

/** State shared by the parts of one panel (`Picker` / `Presets` of `panelRender` read it too). */
export interface ColorPickerPanelContext {
  color: ComputedRef<AggregationColor>
  format: ComputedRef<ColorPickerFormat>
  disabled: ComputedRef<boolean>
  allowClear: ComputedRef<boolean>
  disabledAlpha: ComputedRef<boolean>
  disabledFormat: ComputedRef<boolean>
  presets: ComputedRef<ColorPickerPresetsItem[] | undefined>
  classes: ComputedRef<ColorPickerPanelSemanticClassNames | undefined>
  styles: ComputedRef<ColorPickerPanelSemanticStyles | undefined>
  /** `dragging`: more changes follow, `changeComplete` is reported when the drag ends */
  change: (color: AggregationColor, dragging?: boolean, info?: ColorDragInfo) => void
  /** a drag ended: reports the color picked last */
  changeComplete: () => void
  clear: () => void
  setFormat: (format: ColorPickerFormat) => void
}

const panelContextKey: InjectionKey<ColorPickerPanelContext> = Symbol('AmColorPickerPanelContext')

export function provideColorPickerPanelContext(context: ColorPickerPanelContext) {
  provide(panelContextKey, context)
}

export function useColorPickerPanelContext() {
  const context = inject(panelContextKey, null)
  if (!context)
    throw new Error('[@antdv-next/mobile] ColorPicker panel parts must be rendered inside a ColorPicker panel.')
  return context
}
