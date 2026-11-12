---
title: Button
subtitle: 按钮
description: 按钮用于开始一个即时操作。
group:
  title: 通用
  order: 1
---

## 何时使用 {#when-to-use}

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

API 与 antdv-next 的 `Button` 对齐：`type` 是 `color` + `variant` 的语法糖，移动端默认高度更高、点击态使用 `:active` 反馈。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">按钮类型</demo>
<demo src="./demo/color-variant.vue">颜色与变体</demo>
<demo src="./demo/block.vue">块级按钮</demo>
<demo src="./demo/size.vue">按钮尺寸</demo>
<demo src="./demo/shape.vue">按钮形状</demo>
<demo src="./demo/icon.vue">图标按钮</demo>
<demo src="./demo/loading.vue">加载中状态</demo>
<demo src="./demo/disabled.vue">不可用状态</demo>
<demo src="./demo/ghost.vue">幽灵按钮</demo>
<demo src="./demo/style-class.vue">语义化类名与组件变量</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型，`color` 与 `variant` 的语法糖 | `'default' \| 'primary' \| 'dashed' \| 'text' \| 'link'` | `'default'` |
| color | 按钮颜色 | `'default' \| 'primary' \| 'danger' \| 'success' \| 'warning'` | - |
| variant | 按钮变体 | `'solid' \| 'outlined' \| 'dashed' \| 'filled' \| 'text' \| 'link'` | - |
| danger | 危险按钮，等价于 `color="danger"` | `boolean` | `false` |
| ghost | 幽灵按钮，背景透明，用于深色或图片背景 | `boolean` | `false` |
| block | 宽度撑满父元素 | `boolean` | `false` |
| size | 按钮尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| shape | 按钮形状 | `'default' \| 'round' \| 'circle'` | `'default'` |
| icon | 图标，同名插槽优先 | `VueNode` | - |
| iconPlacement | 图标位置 | `'start' \| 'end'` | `'start'` |
| loading | 加载中状态，可配置延迟与自定义图标 | `boolean \| { delay?: number, icon?: VueNode }` | `false` |
| disabled | 禁用状态 | `boolean` | `false` |
| href | 设置后渲染为 `<a>` | `string` | - |
| target | 同 `<a>` 的 `target`，`href` 存在时生效 | `string` | - |
| htmlType | 原生 `button` 的 `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'content', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'content', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击按钮时触发，禁用与加载中不会触发 | `(event: MouseEvent) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标，优先于 `icon` 属性 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Button` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-button-height` | 按钮高度 | `var(--am-control-height)` |
| `--am-button-font-size` | 文字大小 | `var(--am-font-size-lg)` |
| `--am-button-padding-inline` | 水平内边距 | `var(--am-padding)` |
| `--am-button-border-radius` | 圆角 | `var(--am-border-radius)` |
| `--am-button-font-weight` | 字重 | `400` |
| `--am-button-icon-gap` | 图标与文字间距 | `6px` |

## 与 PC 端的差异 {#diff}

- 新增 `success`、`warning` 两种 `color`，不支持 PC 端的预设色板色（如 `magenta`）。
- 不支持 `autoInsertSpace`，移动端不在两个汉字之间插入空格。
- 没有 hover 态与波纹动效，按压反馈使用 `:active`。
