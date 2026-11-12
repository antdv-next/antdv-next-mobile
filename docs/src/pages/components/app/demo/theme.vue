<docs lang="zh-CN">
`App` 放在 `ConfigProvider` 之下时，`useApp()` 得到的实例会跟随它的主题与语言，这是全局静态方法做不到的。`message` / `notification` / `toast` 属性可以为这些实例设置默认配置。
</docs>

<docs lang="en-US">
With `App` below a `ConfigProvider`, the instances from `useApp()` follow its theme and locale, which the global static methods cannot do. The `message` / `notification` / `toast` props set the default config of these instances.
</docs>

<script setup lang="ts">
import { ref } from 'vue'
import MyPage from './my-page.vue'

const dark = ref(true)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="small" align="center">
      Dark <am-switch v-model:checked="dark" />
    </am-flex>
    <am-config-provider
      :theme="{ algorithm: dark ? 'dark' : 'default', token: { colorPrimary: '#722ed1' } }"
    >
      <am-app
        class="panel"
        :message="{ maxCount: 1 }"
        :notification="{ placement: 'bottom', showProgress: true }"
        :toast="{ position: 'bottom' }"
      >
        <MyPage />
      </am-app>
    </am-config-provider>
  </am-flex>
</template>

<style scoped>
.panel {
  padding: var(--am-padding);
  background: var(--am-color-bg-layout);
  border: 1px solid var(--am-color-border-secondary);
  border-radius: var(--am-border-radius-lg);
}
</style>
