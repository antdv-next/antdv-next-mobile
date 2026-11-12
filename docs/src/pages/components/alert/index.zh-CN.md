---
title: Alert
subtitle: 警告提示
description: 警告提示，展现需要关注的信息。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 当某个页面需要向用户显示警告的信息时。
- 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

API 与 Antdv Next 的 `Alert` 对齐：`title`（兼容已废弃的 `message`）、`description`、`showIcon`、`closable`、`action`、`banner`、`variant`。需要单行滚动公告时请使用 [NoticeBar](/components/notice-bar)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">四种样式</demo>
<demo src="./demo/description.vue">含有辅助性文字介绍</demo>
<demo src="./demo/icon.vue">图标</demo>
<demo src="./demo/closable.vue">可关闭的警告提示</demo>
<demo src="./demo/action.vue">操作</demo>
<demo src="./demo/variant.vue">描边变体</demo>
<demo src="./demo/banner.vue" full>顶部公告</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 警告提示的样式 | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'`（`banner` 模式下为 `'warning'`） |
| variant | 变体：`filled` 为浅色背景，`outlined` 仅保留描边 | `'filled' \| 'outlined'` | `'filled'` |
| title | 警告提示内容，同名插槽优先 | `VueNode` | - |
| description | 警告提示的辅助性文字介绍，同名插槽优先 | `VueNode` | - |
| showIcon | 是否显示辅助图标 | `boolean` | `false`（`banner` 模式下为 `true`） |
| icon | 自定义图标，`showIcon` 为 `true` 时有效 | `VueNode` | - |
| closable | 是否显示关闭按钮，可传入配置对象 | `boolean \| { closeIcon?: VueNode, disabled?: boolean, 'aria-label'?: string }` | `false` |
| closeIcon | 自定义关闭图标，设置后自动显示关闭按钮 | `VueNode` | - |
| action | 自定义操作项 | `VueNode` | - |
| banner | 是否用作顶部公告：无边框、无圆角 | `boolean` | `false` |
| role | 根节点的 `role` | `string` | `'alert'` |
| message | 已废弃，请使用 `title` | `VueNode` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'section' \| 'title' \| 'description' \| 'actions' \| 'close', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'section' \| 'title' \| 'description' \| 'actions' \| 'close', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| close | 点击关闭按钮时触发 | `(event: MouseEvent) => void` |
| afterClose | 关闭动画结束后触发 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 警告提示内容，等同于 `title` |
| title | 警告提示内容 |
| description | 辅助性文字介绍 |
| icon | 自定义图标 |
| action | 自定义操作项 |
| closeIcon | 自定义关闭图标 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Alert` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-alert-padding-block` | 垂直内边距 | `var(--am-padding-xs)` |
| `--am-alert-padding-inline` | 水平内边距 | `var(--am-padding-sm)` |
| `--am-alert-with-description-padding` | 带描述时的内边距 | `var(--am-padding-sm) var(--am-padding)` |
| `--am-alert-border-radius` | 圆角 | `var(--am-border-radius)` |
| `--am-alert-font-size` | 文字大小 | `var(--am-font-size)` |
| `--am-alert-icon-size` | 图标大小 | `16px` |
| `--am-alert-with-description-icon-size` | 带描述时的图标大小 | `22px` |
| `--am-alert-title-color` | 标题颜色 | `var(--am-color-text-heading)` |
| `--am-alert-description-color` | 描述颜色 | `var(--am-color-text)` |
| `--am-alert-color` | 图标主色（随 `type` 变化） | `var(--am-color-info)` |
| `--am-alert-bg` | 背景色（随 `type` 变化） | `var(--am-color-info-bg)` |
| `--am-alert-border-color` | 边框色（随 `type` 变化） | `var(--am-color-info-border)` |

## 与 PC 端的差异 {#diff}

- 默认插槽可直接作为标题内容使用（`<am-alert>内容</am-alert>`）。
- 关闭按钮扩大了点击热区，按压反馈使用 `:active`。
- 不提供 `Alert.ErrorBoundary`，不透出 `mouseenter` / `mouseleave` 事件（原生事件可通过 attrs 监听）。
- `closable` 配置对象不支持 `onClose` / `afterClose` 回调，请使用 `close` / `afterClose` 事件。
- 需要轮播 / 滚动公告请使用移动端专属的 `NoticeBar`。
