export type SafeAreaPosition = 'top' | 'bottom'

export interface SafeAreaProps {
  /** Which inset of the screen to reserve */
  position?: SafeAreaPosition
  rootClass?: string
}

export interface SafeAreaSlots {
  default?: () => any
}
