import type { ComputedRef, InjectionKey } from 'vue'
import type { GridSemanticClassNames, GridSemanticStyles } from './interface'

export interface GridContext {
  clickable: boolean
  classes?: GridSemanticClassNames
  styles?: GridSemanticStyles
}

/** Provided by Grid so every GridItem shares its `clickable` / `classes` / `styles`. */
export const gridContextKey: InjectionKey<ComputedRef<GridContext>> = Symbol('AmGridContext')
