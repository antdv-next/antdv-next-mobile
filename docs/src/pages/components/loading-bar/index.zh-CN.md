---
title: LoadingBar
subtitle: 加载条
description: 显示在页面顶部的细进度条，用于路由切换、接口请求等全局加载反馈。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 路由切换、整页数据请求时，给出不打断操作的全局加载反馈。
- 需要阻止用户操作时使用 [Toast](/components/toast) 的 `Toast.loading()`，局部加载使用 [Spin](/components/spin)。

LoadingBar 是移动端特有的组件，全局只有一个实例。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/custom.vue">自定义样式</demo>

## API

`LoadingBar` 只支持指令式调用：

```ts
import { LoadingBar } from 'antdv-next-mobile'

LoadingBar.start()
LoadingBar.finish()
LoadingBar.error()
```

配合 Vue Router：

```ts
router.beforeEach(() => LoadingBar.start())
router.afterEach(() => LoadingBar.finish())
router.onError(() => LoadingBar.error())
```

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| LoadingBar.start | 显示加载条并缓慢前进（最多到 90%）。加载中再次调用会重新开始 | `() => void` |
| LoadingBar.finish | 走完并淡出。未开始时调用无效果 | `() => void` |
| LoadingBar.error | 以错误色走完并淡出。未开始时也会显示 | `() => void` |
| LoadingBar.config | 全局配置 | `(options: LoadingBarConfigOptions) => void` |

### LoadingBarConfigOptions

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 加载条颜色 | `string` | 主色 |
| errorColor | 出错时的颜色 | `string` | 错误色 |
| height | 加载条粗细，数字单位为 px | `number \| string` | `3` |
| top | 距视口顶部的距离，数字单位为 px | `number \| string` | `0` |
| zIndex | 层级，默认比已打开的弹层更高 | `number` | - |
| getContainer | 挂载节点 | `() => HTMLElement` | `document.body` |
| appContext | 宿主应用的上下文 | `AppContext` | - |

静态调用跟随 `ConfigProvider.config()` 设置的全局主题。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.LoadingBar` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-loading-bar-height` | 加载条粗细 | `3px` |
| `--am-loading-bar-top` | 距顶部的距离 | `0px` |
| `--am-loading-bar-color` | 加载条颜色 | `var(--am-color-primary)` |
| `--am-loading-bar-error-color` | 出错时的颜色 | `var(--am-color-error)` |

## 与 PC 端的差异 {#diff}

- 移动端特有组件，antdv-next 没有对应组件。
