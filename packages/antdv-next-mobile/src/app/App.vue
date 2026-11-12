<script setup lang="ts">
import type { MessageConfigOptions } from '../message/interface'
import type { NotificationConfig } from '../notification/interface'
import type { ToastConfigOptions } from '../toast/interface'
import type { AppConfig, AppProps, AppSlots, UseAppProps } from './interface'
import { computed } from 'vue'
import { useConfig } from '../config-provider/context'
import message from '../message'
import Modal from '../modal'
import notification from '../notification'
import Toast from '../toast'
import { provideAppConfig, provideAppContext, useAppConfig } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmApp', inheritAttrs: false })

const props = withDefaults(defineProps<AppProps>(), {
  component: 'div',
})
defineSlots<AppSlots>()

const config = useConfig()
const parentConfig = useAppConfig()

const mergedConfig = computed<AppConfig>(() => ({
  message: { ...parentConfig?.value.message, ...props.message },
  notification: { ...parentConfig?.value.notification, ...props.notification },
  toast: { ...parentConfig?.value.toast, ...props.toast },
}))
provideAppConfig(mergedConfig)

// The instances read their config lazily on every call / render, so getters keep them in sync with the props.
const messageConfig: MessageConfigOptions = {
  get top() { return mergedConfig.value.message?.top },
  get duration() { return mergedConfig.value.message?.duration },
  get maxCount() { return mergedConfig.value.message?.maxCount },
  get getContainer() { return mergedConfig.value.message?.getContainer },
}
const notificationConfig: NotificationConfig = {
  get top() { return mergedConfig.value.notification?.top },
  get bottom() { return mergedConfig.value.notification?.bottom },
  get getContainer() { return mergedConfig.value.notification?.getContainer },
  get placement() { return mergedConfig.value.notification?.placement },
  get maxCount() { return mergedConfig.value.notification?.maxCount },
  get stack() { return mergedConfig.value.notification?.stack },
  get duration() { return mergedConfig.value.notification?.duration },
  get showProgress() { return mergedConfig.value.notification?.showProgress },
  get pauseOnHover() { return mergedConfig.value.notification?.pauseOnHover },
  get closeIcon() { return mergedConfig.value.notification?.closeIcon },
  get closable() { return mergedConfig.value.notification?.closable },
  get classes() { return mergedConfig.value.notification?.classes },
  get styles() { return mergedConfig.value.notification?.styles },
}
const toastConfig: ToastConfigOptions = {
  get duration() { return mergedConfig.value.toast?.duration },
  get position() { return mergedConfig.value.toast?.position },
  get maskClickable() { return mergedConfig.value.toast?.maskClickable },
  get getContainer() { return mergedConfig.value.toast?.getContainer },
}

const [messageApi, MessageContextHolder] = message.useMessage(messageConfig)
const [notificationApi, NotificationContextHolder] = notification.useNotification(notificationConfig)
const [modalApi, ModalContextHolder] = Modal.useModal()
const [toastApi, ToastContextHolder] = Toast.useToast(toastConfig)

const api: UseAppProps = {
  message: messageApi,
  notification: notificationApi,
  modal: modalApi,
  toast: toastApi,
}
provideAppContext(api)

defineExpose(api)
</script>

<template>
  <component
    :is="component"
    v-if="component !== false"
    class="am-app"
    :class="[rootClass, { 'am-app-rtl': config.direction.value === 'rtl' }]"
    v-bind="$attrs"
  >
    <MessageContextHolder />
    <NotificationContextHolder />
    <ModalContextHolder />
    <ToastContextHolder />
    <slot />
  </component>
  <template v-else>
    <MessageContextHolder />
    <NotificationContextHolder />
    <ModalContextHolder />
    <ToastContextHolder />
    <slot />
  </template>
</template>
