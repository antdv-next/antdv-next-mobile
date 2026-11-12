---
title: ActionSheet
subtitle: 动作面板
description: 从底部弹出的动作菜单面板。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 由用户操作触发，提供一组与当前场景相关的两个或多个动作。
- 在执行危险操作前给用户二次选择的机会（如「删除」与「取消」）。

ActionSheet 是移动端特有的组件，在移动端它替代了 PC 端的下拉操作菜单。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/cancel.vue">取消按钮与标题</demo>
<demo src="./demo/status.vue">选项状态</demo>
<demo src="./demo/static.vue">指令式调用</demo>
<demo src="./demo/custom.vue">自定义内容</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示，支持 `v-model:open` | `boolean` | `false` |
| actions | 动作列表 | [ActionSheetAction](#actionsheetaction)[] | `[]` |
| title | 标题，同名插槽优先 | `VueNode` | - |
| extra | 标题下方的描述信息，同名插槽优先 | `VueNode` | - |
| cancelText | 取消按钮文字，默认取自语言包；设为 `null` 时不显示取消按钮 | `VueNode` | `取消` |
| showCancel | 是否显示取消按钮 | `boolean` | `true` |
| closeOnAction | 点击动作后是否关闭 | `boolean` | `true` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| keyboard | 是否支持按 ESC 关闭 | `boolean` | `true` |
| round | 顶部是否使用圆角 | `boolean` | `true` |
| safeArea | 是否预留底部安全区 | `boolean` | `true` |
| destroyOnHidden | 关闭后销毁内容 | `boolean` | `false` |
| forceRender | 首次打开前预渲染内容 | `boolean` | `false` |
| getContainer | 挂载节点，`false` 为挂载在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 层级 | `number` | 自动递增 |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<SemanticDOM, string>` | - |
| styles | 语义化结构样式 | `Record<SemanticDOM, CSSProperties>` | - |

`SemanticDOM`：`root`、`mask`、`body`（面板）、`header`、`title`、`extra`、`list`、`item`、`cancel`。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:open | 显示状态变化 | `(open: boolean) => void` |
| action | 点击动作时触发，禁用的动作不会触发 | `(action: ActionSheetAction, index: number) => void` |
| cancel | 点击取消按钮时触发 | `(event: MouseEvent) => void` |
| close | 面板请求关闭时触发（点击动作、取消按钮、遮罩或按下 ESC） | `() => void` |
| afterOpenChange | 打开 / 关闭动画结束后触发 | `(open: boolean) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 标题与动作列表之间的自定义内容 | - |
| title | 标题，优先于 `title` 属性 | - |
| extra | 描述信息，优先于 `extra` 属性 | - |
| cancelText | 取消按钮内容，优先于 `cancelText` 属性 | - |
| action | 自定义单个动作的内容 | `{ action, index }` |

### ActionSheetAction

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | - |
| text | 文字 | `VueNode` | - |
| description | 文字下方的描述 | `VueNode` | - |
| icon | 文字前的图标 | `VueNode` | - |
| danger | 危险动作，文字为红色 | `boolean` | `false` |
| bold | 文字加粗 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| onClick | 点击回调 | `(action: ActionSheetAction, index: number) => void` | - |

### 指令式调用 {#static-methods}

```ts
import { ActionSheet } from 'antdv-next-mobile'

const handler = ActionSheet.show({
  actions: [{ key: 'copy', text: '复制' }],
  onAction: (action) => {},
})

handler.close()
```

`ActionSheet.show(config)` 的 `config` 支持上述除 `open`、`destroyOnHidden`、`forceRender` 以外的所有属性，以及：

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| class | 根节点类名 | `string` |
| style | 根节点样式 | `CSSProperties` |
| onAction | 点击动作的回调 | `(action: ActionSheetAction, index: number) => void` |
| onCancel | 点击取消按钮的回调 | `() => void` |
| onClose | 面板请求关闭的回调 | `() => void` |
| afterClose | 完全关闭后的回调 | `() => void` |
| appContext | 应用上下文，使内容中可以使用全局注册的组件 | `AppContext` |

返回 `{ close }`。指令式调用的主题与语言跟随 `ConfigProvider.config()` 的全局配置。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.ActionSheet` 或直接覆盖 CSS 变量（作用于 `rootClass` 所在的根节点）定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-action-sheet-item-height` | 动作项最小高度 | `52px` |
| `--am-action-sheet-item-font-size` | 动作项字号 | `var(--am-font-size-lg)` |
| `--am-action-sheet-item-color` | 动作项文字颜色 | `var(--am-color-text)` |
| `--am-action-sheet-item-active-bg` | 动作项按压背景色 | `var(--am-color-fill-tertiary)` |
| `--am-action-sheet-description-color` | 动作描述颜色 | `var(--am-color-text-description)` |
| `--am-action-sheet-header-color` | 头部文字颜色 | `var(--am-color-text-description)` |
| `--am-action-sheet-gap-size` | 取消按钮上方间隔的高度 | `8px` |
| `--am-action-sheet-gap-color` | 取消按钮上方间隔的颜色 | `var(--am-color-bg-layout)` |
| `--am-action-sheet-max-height` | 面板最大高度，超出后动作列表滚动 | `80%` |
