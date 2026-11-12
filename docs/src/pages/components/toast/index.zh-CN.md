---
title: Toast
subtitle: 轻提示
description: 在屏幕中央显示的黑色半透明提示，用于操作结果、加载状态等轻量反馈。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 对用户的操作给出简短的结果反馈，不需要用户处理，一段时间后自动消失。
- 加载过程中需要阻止用户操作页面时，使用 `Toast.loading()`。

Toast 是移动端特有的组件，同一时间只会显示一个，新的提示会替换旧的。如果希望多条提示在顶部堆叠且不遮挡内容，请使用 [Message](/components/message)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/icon.vue">图标</demo>
<demo src="./demo/loading.vue">加载中</demo>
<demo src="./demo/position.vue">显示位置</demo>
<demo src="./demo/mask.vue">阻止背景点击</demo>
<demo src="./demo/update.vue">动态更新与手动关闭</demo>

## API

`Toast` 只支持指令式调用：

```ts
import { Toast } from '@antdv-next/mobile'

Toast.show('Hello')
Toast.show({ content: '保存成功', icon: 'success' })
```

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| Toast.show | 显示提示，可直接传入文字 | `(config: ToastShowConfig \| string) => { close }` |
| Toast.success | 显示成功提示，等同于 `icon: 'success'` | `(config: ToastShowConfig \| string) => { close }` |
| Toast.fail | 显示失败提示，等同于 `icon: 'fail'` | `(config: ToastShowConfig \| string) => { close }` |
| Toast.loading | 显示加载提示。默认不自动关闭（`duration: 0`）并阻止背景点击（`maskClickable: false`） | `(config?: ToastShowConfig \| string) => { close }` |
| Toast.clear | 关闭当前显示的提示 | `() => void` |
| Toast.config | 全局配置 | `(options: ToastConfigOptions) => void` |
| Toast.useToast | 返回 `[toast, ContextHolder]`：提示渲染在 `<ContextHolder />` 所在的位置，跟随其所在的 `ConfigProvider`（也可以通过 `App.useApp().toast` 获得） | `(config?: ToastConfigOptions) => [ToastInstance, Component]` |

返回的 `close` 方法只会关闭它对应的那一条提示：如果它已被新的提示替换，调用 `close` 不会有任何效果。

### ToastShowConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | `VueNode` | - |
| icon | 图标，可选预设或自定义节点 | `'success' \| 'fail' \| 'loading' \| VueNode` | - |
| duration | 显示时长，单位**毫秒**。设为 0 时不自动关闭 | `number` | `2000` |
| position | 垂直方向的显示位置 | `'top' \| 'center' \| 'bottom'` | `'center'` |
| maskClickable | 是否允许点击背景。为 `false` 时显示期间页面不可操作 | `boolean` | `true` |
| class | 根节点类名 | `string` | - |
| style | 根节点样式 | `CSSProperties` | - |
| afterClose | 提示关闭（或被替换）后的回调 | `() => void` | - |

### ToastConfigOptions

```ts
Toast.config({ duration: 3000, position: 'bottom' })
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| duration | 默认显示时长，单位毫秒 | `number` | `2000` |
| position | 默认显示位置 | `'top' \| 'center' \| 'bottom'` | `'center'` |
| maskClickable | 默认是否允许点击背景 | `boolean` | `true` |
| getContainer | 挂载节点 | `() => HTMLElement` | `() => document.body` |
| appContext | 应用上下文，使内容中可以使用全局注册的组件 | `AppContext` | - |

Toast 的主题与语言跟随 `ConfigProvider.config()` 的全局配置。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Toast` 或直接覆盖 `.am-toast-root` 上的 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-toast-z-index` | 层级（未自动分配时） | `2020` |
| `--am-toast-bg` | 背景色 | 75% 不透明度的黑色 |
| `--am-toast-color` | 文字颜色 | `var(--am-color-white)` |
| `--am-toast-font-size` | 字号 | `var(--am-font-size)` |
| `--am-toast-padding` | 纯文字提示的内边距 | `var(--am-padding-xs) var(--am-padding-sm)` |
| `--am-toast-border-radius` | 圆角 | `var(--am-border-radius)` |
| `--am-toast-max-width` | 最大宽度 | `70%` |
| `--am-toast-min-width` | 最小宽度 | `96px` |
| `--am-toast-icon-size` | 图标大小 | `36px` |
| `--am-toast-offset` | `top` / `bottom` 位置距离屏幕边缘的比例 | `15%` |

## 与 Message 的区别 {#diff}

Toast 没有 PC 端的对应组件，它与 [Message](/components/message) 的区别如下：

| | Toast | Message |
| --- | --- | --- |
| 位置 | 屏幕中央（可选上 / 下） | 顶部 |
| 数量 | 同一时间只有一个 | 多条堆叠 |
| 时长单位 | 毫秒 | 秒（与 PC 端一致） |
| 阻止页面操作 | 支持（`maskClickable: false`） | 不支持 |
| API | 移动端特有 | 与 Antdv Next 的 `message` 对齐 |
