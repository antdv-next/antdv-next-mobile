import type { ComputedRef, InjectionKey } from 'vue'
import type { AvatarShape, AvatarSize } from './interface'

export interface AvatarGroupContext {
  size: ComputedRef<AvatarSize | undefined>
  shape: ComputedRef<AvatarShape | undefined>
}

export const avatarGroupContextKey: InjectionKey<AvatarGroupContext> = Symbol('AmAvatarGroupContext')
