<div align="center">
  <img src="./docs/public/logo.svg" width="72" alt="logo" />
  <h1>Antdv Next Mobile</h1>
  <p>Vue 3 移动端组件库，API 与 <a href="https://github.com/antdv-next/antdv-next">antdv-next</a> 对齐。</p>
  <p><a href="https://m.antdv-next.com">文档 · m.antdv-next.com</a></p>
</div>

## 特性

- **与 PC 端 API 对齐**：`v-model:open`、`v-model:value`、`items`、`options`、`rootClass`、`classes`、`Modal.confirm`、`message.success`…… 会用 antdv-next 就会用它。
- **为触屏设计**：底部弹层、滚轮选择器、手势滑动、下拉刷新、安全区适配。
- **纯 CSS 变量主题**：零运行时样式，亮色 / 暗色 / 紧凑算法可组合、可嵌套，改一个变量即可全局换肤。
- **`<script setup>` + TypeScript**：全部组件使用组合式 API 编写，类型完备。
- **按需引入**：ESM 产物，样式随组件自动加载。
- **组合式 API**：`useRequest`、`useLoadMore`、`useCountDown`、`useSwipe`、`useKeyboard` 等 30 余个常用函数随库导出。
- **国际化**：内置 `zh_CN`、`en_US`。

## 安装

```bash
pnpm add antdv-next-mobile
```

## 使用

```ts
import AntdvNextMobile from 'antdv-next-mobile'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(AntdvNextMobile).mount('#app')
```

```vue
<script setup lang="ts">
import { theme } from 'antdv-next-mobile'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-config-provider :theme="{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#00b96b' } }">
    <am-button type="primary" block @click="open = true">
      打开
    </am-button>
    <am-popup v-model:open="open" round closable>
      Hello
    </am-popup>
  </am-config-provider>
</template>
```

## 主题

```css
:root {
  --am-color-primary: #7c3aed;
  --am-border-radius: 12px;
}
```

```ts
import { applyTheme, theme } from 'antdv-next-mobile'

applyTheme({ algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] })
```

## 开发

```bash
pnpm install
pnpm dev          # 文档站 + 手机模拟器 http://localhost:5180
pnpm test         # 单元测试
pnpm typecheck    # 类型检查
pnpm build        # 构建组件库
pnpm build:site   # 构建文档站
```

目录结构与贡献约定见 [AGENTS.md](./AGENTS.md)。

## 浏览器支持

iOS Safari 16.2+、Android Chrome / WebView 111+（主题依赖 CSS `color-mix()`）。

## License

[MIT](./LICENSE)
