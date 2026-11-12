---
title: Tag
subtitle: 标签
description: 进行标记和分类的小标签。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 用于标记事物的属性和维度。
- 进行分类。
- 需要可点选的筛选标签时，使用 `CheckableTag`。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/colorful.vue">多彩标签</demo>
<demo src="./demo/status.vue">状态标签</demo>
<demo src="./demo/variant.vue">变体</demo>
<demo src="./demo/size.vue">尺寸与圆角</demo>
<demo src="./demo/icon.vue">图标</demo>
<demo src="./demo/closable.vue">可关闭</demo>
<demo src="./demo/checkable.vue">可选择标签</demo>

## API

### Tag 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 标签颜色，支持预设色名、状态色名与任意 CSS 颜色 | `string` | - |
| variant | 标签变体 | `'filled' \| 'solid' \| 'outlined'` | `'filled'` |
| bordered | 是否有边框，`false` 时移除 `outlined` 变体的边框 | `boolean` | `true` |
| closable | 是否显示关闭按钮，也可通过对象配置关闭图标和无障碍标签 | `boolean \| { closeIcon?: VueNode, ariaLabel?: string }` | `false` |
| closeIcon | 自定义关闭图标；未设置 `closable` 时，设置它即显示关闭按钮。同名插槽优先 | `VueNode` | - |
| icon | 设置图标，同名插槽优先 | `VueNode` | - |
| href | 设置后渲染为 `<a>` | `string` | - |
| target | 同 `<a>` 的 `target`，`href` 存在时生效 | `string` | - |
| disabled | 是否禁用，禁用后不响应点击与关闭 | `boolean` | `false` |
| size | 标签尺寸（移动端特有） | `'small' \| 'middle' \| 'large'` | `'middle'` |
| round | 是否为全圆角（移动端特有） | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'content' \| 'close', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'content' \| 'close', CSSProperties>` | - |

- 预设色名：`pink` `red` `yellow` `orange` `cyan` `green` `blue` `purple` `geekblue` `magenta` `volcano` `gold` `lime`。
- 状态色名：`success` `processing` `error` `warning` `default`。

### Tag 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| close | 点击关闭按钮时触发；调用 `event.preventDefault()` 可阻止标签自动隐藏，由外部数据控制 | `(event: MouseEvent) => void` |

原生 `click` 事件会透传到根节点，可直接使用 `@click`。

### Tag 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 标签内容 |
| icon | 自定义图标，优先于 `icon` 属性 |
| closeIcon | 自定义关闭图标，优先于 `closeIcon` 属性 |

### CheckableTag 属性 {#checkable-props}

模板中使用 `<am-checkable-tag>`，也可以通过 `Tag.CheckableTag` 访问。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked (v-model) | 是否选中 | `boolean` | - |
| defaultChecked | 非受控模式下的初始选中状态 | `boolean` | `false` |
| icon | 设置图标，同名插槽优先 | `VueNode` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 标签尺寸（移动端特有） | `'small' \| 'middle' \| 'large'` | `'middle'` |
| round | 是否为全圆角（移动端特有） | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |

### CheckableTag 事件 {#checkable-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:checked | 选中状态变化时触发 | `(checked: boolean) => void` |
| change | 选中状态变化时触发 | `(checked: boolean) => void` |
| click | 点击标签时触发，禁用时不触发 | `(event: MouseEvent) => void` |

### CheckableTag 插槽 {#checkable-slots}

| 插槽 | 说明 |
| --- | --- |
| default | 标签内容 |
| icon | 自定义图标，优先于 `icon` 属性 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-tag-height` | 标签高度 | `22px`（`small` 18px / `large` 28px，可选择标签 28px） |
| `--am-tag-font-size` | 字号 | `var(--am-font-size-sm)` |
| `--am-tag-padding-inline` | 水平内边距 | `var(--am-padding-xs)` |
| `--am-tag-border-radius` | 圆角 | `var(--am-border-radius-sm)` |
| `--am-tag-icon-gap` | 图标与文字的间距 | `4px` |
| `--am-tag-c` | 标签的主色，文字、背景与边框颜色均由它派生 | `var(--am-color-text)` |
| `--am-tag-bg` | `filled` 变体的背景色 | `var(--am-color-fill-secondary)` |
| `--am-tag-border-color` | `outlined` 变体的边框色 | `var(--am-color-border)` |

## 与 PC 端的差异 {#diff}

- 新增 `size` 与 `round`，适配移动端常见的大号筛选标签与胶囊标签。
- 自定义颜色（如 `#f50`）同样遵循 `variant`，浅色背景与边框由主色通过 `color-mix()` 派生，暗色模式下自动适配。
- `CheckableTag` 支持非受控用法（`defaultChecked`），PC 端为完全受控组件；默认高度为 28px 以保证点击区域。
- `closable` 对象中的无障碍标签使用 `ariaLabel` 字段，默认取自国际化文案 `common.close`。
- 不提供 `CheckableTagGroup`，多选场景请使用 `Selector`。
- 没有 hover 态，按压反馈使用 `:active`。
