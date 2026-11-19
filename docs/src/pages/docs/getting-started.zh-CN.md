---
title: 快速上手
order: 2
group:
  title: 指南
  order: 1
---

## 安装 {#install}

```bash
pnpm add @antdv-next/mobile
```

## 完整引入 {#full-import}

```ts
import AntdvMobile from '@antdv-next/mobile'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(AntdvMobile).mount('#app')
```

组件以 `am-` 为前缀全局注册，样式会随组件自动引入，不需要额外导入 CSS 文件。

```vue
<template>
  <am-button type="primary" block @click="open = true">
    打开弹层
  </am-button>
  <am-popup v-model:open="open" round closable>
    <div style="padding: 24px">Hello Antdv Mobile</div>
  </am-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>
```

## 按需引入 {#on-demand}

直接导入需要的组件即可，构建工具会自动摇掉未使用的代码和样式。

```vue
<script setup lang="ts">
import { Button, message } from '@antdv-next/mobile'
</script>

<template>
  <Button type="primary" @click="message.success('操作成功')">
    提交
  </Button>
</template>
```

如果需要独立加载完整样式，可以在客户端入口中引入：

```ts
import '@antdv-next/mobile/style.css'
```

Vite SSR 默认将依赖留给 Node 加载。组件的 ESM 文件会引入 CSS，因此服务端构建也需要处理组件库。将以下配置合并到 `vite.config.ts`，即可在服务端使用 `renderToString` 渲染组件：

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  ssr: { noExternal: ['@antdv-next/mobile'] },
})
```

## 自动导入 {#auto-import}

配合 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)，可以在模板里直接写 `<am-button>`，不需要全局注册，也不需要手动导入。resolver 随 `@antdv-next/mobile` 一起发布，组件列表始终与已安装的版本一致。

```bash
pnpm add -D unplugin-vue-components
```

```ts
// vite.config.ts
import { AntdvNextMobileResolver } from '@antdv-next/mobile/resolver'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntdvNextMobileResolver()],
    }),
  ],
})
```

Webpack、Rspack、Rollup、esbuild 的用法相同，只需把 `unplugin-vue-components/vite` 换成对应的入口。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| exclude | 不需要自动导入的组件或图标，匹配标签名（`AmButton`）或导出名（`Button`） | `string \| RegExp \| (string \| RegExp)[]` | - |
| resolveIcons | 是否同时自动导入 `@antdv-next/icons` 的图标（`<SearchOutlined />`） | `boolean` | `false` |

```ts
AntdvNextMobileResolver({
  resolveIcons: true,
  exclude: ['AmButton', /^AmInput/],
})
```

`message`、`Modal.confirm` 等静态方法不是模板组件，仍然需要手动导入。

## 视口与安全区 {#viewport}

在 `index.html` 中设置视口，`viewport-fit=cover` 用于开启安全区适配：

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no"
/>
```

组件按 375 设计稿绘制，所有长度都跟随 `--am-unit`（默认 `1px`）。需要等比缩放或对接 750 设计稿、rem 方案时，只要改这一个变量，见[设计稿适配](/docs/adaptation)。

## 静态方法 {#static-api}

`message`、`Toast`、`Modal.confirm`、`ActionSheet.show`、`ImagePreview.show` 等方法可以在任意位置调用。它们渲染在独立的节点中，通过 `ConfigProvider.config` 读取全局主题与语言：

```ts
import { ConfigProvider, theme } from '@antdv-next/mobile'
import enUS from '@antdv-next/mobile/locale/en_US'

ConfigProvider.config({
  theme: { algorithm: theme.darkAlgorithm, token: { colorPrimary: '#00b96b' } },
  locale: enUS,
})
```

## TypeScript {#typescript}

所有组件的 `Props`、`Emits`、`Slots` 类型均可直接导入：

```ts
import type { ButtonProps, PopupProps, ThemeConfig } from '@antdv-next/mobile'
```
