<div align="center">
  <img src="https://raw.githubusercontent.com/antdv-next/antdv-next-mobile/main/docs/public/logo.svg" width="72" alt="logo" />
  <h1>Antdv Mobile</h1>
  <p>Mobile UI component library for Vue 3, API-aligned with <a href="https://github.com/antdv-next/antdv-next">Antdv Next</a>.</p>
  <p><a href="https://m.antdv-next.com">Documentation · m.antdv-next.com</a></p>
  <p>English · <a href="https://github.com/antdv-next/antdv-next-mobile/blob/main/packages/antdv-mobile/README.zh-CN.md">中文</a></p>
</div>

## Features

- **Same API as PC**: `v-model:open`, `v-model:value`, `items`, `options`, `rootClass`, `classes`, `Modal.confirm`, `message.success` ... if you know Antdv Next, you already know this library.
- **Designed for touch**: bottom popups, wheel pickers, swipe gestures, pull-to-refresh, safe-area support.
- **Pure CSS variable theme**: zero runtime styles. Light / dark / compact algorithms combine and nest, and one variable restyles the whole app.
- **`<script setup>` + TypeScript**: every component is written with the Composition API and fully typed.
- **Import on demand**: ESM output, styles are loaded together with each component. Auto import through `@antdv-next/mobile/resolver` (unplugin-vue-components).
- **Composables**: `useRequest`, `useLoadMore`, `useCountDown`, `useSwipe`, `useKeyboard` and 30+ more are exported with the library.
- **Internationalization**: `zh_CN` and `en_US` are built in.

## Install

```bash
pnpm add @antdv-next/mobile
```

## Usage

```ts
import AntdvMobile from '@antdv-next/mobile'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(AntdvMobile).mount('#app')
```

```vue
<script setup lang="ts">
import { theme } from '@antdv-next/mobile'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-config-provider :theme="{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#00b96b' } }">
    <am-button type="primary" block @click="open = true">
      Open
    </am-button>
    <am-popup v-model:open="open" round closable>
      Hello
    </am-popup>
  </am-config-provider>
</template>
```

The built-in texts are Chinese by default. Switch to English with a language pack:

```vue
<script setup lang="ts">
import enUS from '@antdv-next/mobile/locale/en_US'
</script>

<template>
  <am-config-provider :locale="enUS">
    <App />
  </am-config-provider>
</template>
```

## Theme

```css
:root {
  --am-color-primary: #7c3aed;
  --am-border-radius: 12px;
}
```

```ts
import { applyTheme, theme } from '@antdv-next/mobile'

applyTheme({ algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] })
```

## Development

```bash
pnpm install
pnpm dev          # docs site + phone simulator at http://localhost:5180
pnpm test         # unit tests
pnpm typecheck    # type check
pnpm build        # build the library
pnpm build:site   # build the docs site
```

See [AGENTS.md](https://github.com/antdv-next/antdv-next-mobile/blob/main/AGENTS.md) for the project layout and contribution conventions.

## Browser Support

iOS Safari 16.2+, Android Chrome / WebView 111+ (the theme relies on CSS `color-mix()`).

## License

[MIT](https://github.com/antdv-next/antdv-next-mobile/blob/main/LICENSE)
