import type { Component } from 'vue'
import type { MessageConfigOptions, MessageInstance } from '../message/interface'
import type { ModalHookApi } from '../modal/interface'
import type { NotificationConfig, NotificationInstance } from '../notification/interface'
import type { ToastConfigOptions, ToastInstance } from '../toast/interface'

export interface AppConfig {
  /** Config of the `message` instance inside this App */
  message?: MessageConfigOptions
  /** Config of the `notification` instance inside this App */
  notification?: NotificationConfig
  /** Config of the `toast` instance inside this App */
  toast?: ToastConfigOptions
}

export interface AppProps {
  /** Root element / component, `false` renders no DOM node */
  component?: string | Component | false
  message?: MessageConfigOptions
  notification?: NotificationConfig
  toast?: ToastConfigOptions
  rootClass?: string
}

export interface AppSlots {
  default?: () => any
}

/** Result of `App.useApp()`, also exposed on the `<am-app>` ref */
export interface UseAppProps {
  message: MessageInstance
  notification: NotificationInstance
  modal: ModalHookApi
  toast: ToastInstance
}
