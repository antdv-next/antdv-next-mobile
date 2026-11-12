---
title: Input
subtitle: 输入框
description: 通过键盘输入内容，是最基础的表单域的包装。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 需要用户输入表单域内容时。
- 提供多行输入 `TextArea`、搜索栏 `InputSearch`、密码框 `InputPassword` 与验证码 `InputOTP`。

API 与 antdv-next 的 `Input` 对齐，移动端字号不小于 16px（避免 iOS 聚焦缩放），清除按钮默认只在聚焦时显示，并处理了输入法组合输入。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/variant.vue">形态变体</demo>
<demo src="./demo/size.vue">三种尺寸</demo>
<demo src="./demo/affix.vue">前缀、后缀与字数</demo>
<demo src="./demo/status.vue">状态</demo>
<demo src="./demo/textarea.vue">多行文本</demo>
<demo src="./demo/search.vue">搜索栏</demo>
<demo src="./demo/password.vue">密码框</demo>
<demo src="./demo/otp.vue">验证码</demo>

## API

### Input 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 输入框内容，支持 `v-model:value` | `string` | - |
| defaultValue | 输入框默认内容 | `string` | - |
| placeholder | 占位文本 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| readOnly | 是否只读（也可写作 `readonly`） | `boolean` | `false` |
| maxlength | 最大长度 | `number` | - |
| showCount | 是否展示字数，可自定义格式 | `boolean \| { formatter: (info: { value: string, count: number, maxLength?: number }) => VueNode }` | `false` |
| allowClear | 是否显示清除按钮，可自定义图标 | `boolean \| { clearIcon?: VueNode }` | `false` |
| clearTrigger | 清除按钮的显示时机 | `'focus' \| 'always'` | `'focus'` |
| prefix | 前缀，同名插槽优先 | `VueNode` | - |
| suffix | 后缀，同名插槽优先 | `VueNode` | - |
| size | 控件大小 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| status | 校验状态 | `'error' \| 'warning'` | - |
| variant | 形态变体 | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'`（表单内为 `'borderless'`） |
| type | 原生 `input` 的 `type` | `string` | `'text'` |
| inputmode | 虚拟键盘类型：`text` / `numeric` / `decimal` / `tel` / `email` / `url` / `search` | `string` | - |
| enterkeyhint | 虚拟键盘回车键的文案：`done` / `go` / `next` / `search` / `send` | `string` | - |
| align | 文字对齐方式 | `'start' \| 'center' \| 'end'` | `'start'` |
| autofocus | 自动聚焦 | `boolean` | `false` |
| autocomplete | 原生 `autocomplete` | `string` | - |
| name | 原生 `name` | `string` | - |
| id | 原生输入框的 `id`，在 `FormItem` 中默认使用字段 id | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'clear' \| 'count', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'clear' \| 'count', CSSProperties>` | - |

### Input 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:value | 值变化时触发 | `(value: string) => void` |
| change | 输入框内容变化时触发（与 PC 一致，每次输入都会触发） | `(event: Event) => void` |
| input | 同 `change` | `(event: Event) => void` |
| pressEnter | 按下回车时触发 | `(event: KeyboardEvent) => void` |
| focus | 获得焦点时触发 | `(event: FocusEvent) => void` |
| blur | 失去焦点时触发 | `(event: FocusEvent) => void` |
| clear | 点击清除按钮时触发 | `() => void` |
| keydown / keyup | 键盘事件 | `(event: KeyboardEvent) => void` |
| compositionstart / compositionend | 输入法组合输入开始 / 结束 | `(event: CompositionEvent) => void` |

### Input 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| prefix | 前缀，优先于 `prefix` 属性 |
| suffix | 后缀，优先于 `suffix` 属性 |
| clearIcon | 自定义清除图标 |

### Input 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| focus | 获取焦点 | `(options?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) => void` |
| blur | 取消焦点 | `() => void` |
| select | 选中全部内容 | `() => void` |
| input | 原生 `input` 元素 | `HTMLInputElement` |
| nativeElement | 根元素 | `HTMLElement` |

### TextArea {#textarea}

标签为 `<am-textarea>`。除 `prefix`、`suffix`、`type` 外支持 Input 的全部属性、事件与方法（原生元素通过 `textArea` 获取），另有：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rows | 行数 | `number` | `2` |
| autoSize | 自适应内容高度，可设置最小 / 最大行数 | `boolean \| { minRows?: number, maxRows?: number }` | `false` |

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| resize | `autoSize` 导致高度变化时触发 | `({ height: number }) => void` |

### InputSearch {#input-search}

标签为 `<am-input-search>`。支持 Input 的 `value`、`placeholder`、`disabled`、`maxlength`、`allowClear`、`prefix`、`suffix`、`size`、`status`、`variant` 等属性与 `change`、`focus`、`blur`、`clear`、`pressEnter` 事件，另有：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placeholder | 占位文本 | `string` | 语言包 `InputSearch.placeholder` |
| allowClear | 是否显示清除按钮 | `boolean \| { clearIcon?: VueNode }` | `true` |
| variant | 形态变体 | `Variant` | `'filled'` |
| round | 是否为胶囊形 | `boolean` | `true` |
| loading | 搜索 loading，期间不会触发 `search` | `boolean` | `false` |
| searchIcon | 自定义搜索图标，同名插槽优先 | `VueNode` | - |
| enterButton | 输入框后的搜索按钮，`true` 为图标按钮，也可传入文字或节点 | `boolean \| VueNode` | - |
| showCancel | 聚焦或有内容时显示取消按钮 | `boolean` | `false` |
| cancelText | 取消按钮文案，同名插槽优先 | `VueNode` | 语言包 `InputSearch.cancelText` |
| classes / styles | 语义化结构 | `Record<'root' \| 'input' \| 'button' \| 'cancel', ...>` | - |

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| search | 按下回车、点击搜索按钮或清除按钮时触发 | `(value: string, event?: Event, info?: { source: 'input' \| 'clear' }) => void` |
| cancel | 点击取消按钮时触发（同时会清空内容并失焦） | `() => void` |

| 插槽 | 说明 |
| --- | --- |
| searchIcon | 自定义搜索图标 |
| enterButton | 自定义搜索按钮内容 |
| cancelText | 自定义取消按钮内容 |
| prefix / suffix / clearIcon | 同 Input |

### InputPassword {#input-password}

标签为 `<am-input-password>`。除 `type` 外支持 Input 的全部属性、事件与方法，另有：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visibilityToggle | 是否显示切换按钮 | `boolean` | `true` |
| iconVisible | 密码是否可见，支持 `v-model:icon-visible` | `boolean` | `false` |
| iconRender | 自定义切换按钮图标，同名插槽优先 | `({ visible }) => VueNode` | - |

### InputOTP {#input-otp}

标签为 `<am-input-otp>`。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 输入框内容，支持 `v-model:value` | `string` | - |
| defaultValue | 默认值 | `string` | - |
| length | 输入元素数量 | `number` | `6` |
| formatter | 格式化整个值，例如只保留数字 | `(value: string) => string` | - |
| mask | 自定义展示，`true` 显示为圆点，不会修改原始值 | `boolean \| string` | `false` |
| separator | 分隔符，同名插槽优先 | `VueNode \| ((index: number) => VueNode)` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| status | 校验状态 | `'error' \| 'warning'` | - |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| variant | 形态变体 | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` |
| inputMode | 虚拟键盘类型 | `string` | `'numeric'` |
| autoFocus | 自动聚焦 | `boolean` | `false` |
| classes / styles | 语义化结构 | `Record<'root' \| 'cell' \| 'separator', ...>` | - |

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:value | 每次输入都会触发 | `(value: string) => void` |
| change | 全部填充完成时触发 | `(value: string) => void` |
| input | 输入值变化时触发 | `(cells: string[]) => void` |
| focus / blur | 聚焦 / 失焦 | `(event: FocusEvent) => void` |

方法：`focus()`、`blur()`、`nativeElement`。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Input` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-input-height` | 输入框高度 | `var(--am-control-height)` |
| `--am-input-font-size` | 文字大小 | `var(--am-font-size-lg)` |
| `--am-input-padding-inline` | 水平内边距 | `var(--am-padding-sm)` |
| `--am-input-border-radius` | 圆角 | `var(--am-border-radius)` |
| `--am-input-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-input-placeholder-color` | 占位文本颜色 | `var(--am-color-text-placeholder)` |
| `--am-input-background` | 背景色 | `var(--am-color-bg-container)` |
| `--am-input-border-color` | 边框颜色 | `var(--am-color-border)` |
| `--am-input-active-border-color` | 聚焦时的边框与光标颜色 | `var(--am-color-primary)` |
| `--am-input-filled-background` | `filled` 形态背景色 | `var(--am-color-fill-tertiary)` |
| `--am-input-affix-color` | 前后缀颜色 | `var(--am-color-text-tertiary)` |
| `--am-input-affix-gap` | 前后缀与输入区的间距 | `var(--am-margin-xs)` |
| `--am-input-clear-size` | 清除图标大小 | `16px` |
| `--am-input-search-height` | 搜索栏高度 | `36px` |
| `--am-input-search-border-radius` | 搜索栏圆角 | `999px`（`round`） |
| `--am-input-search-gap` | 搜索栏与按钮的间距 | `var(--am-margin-sm)` |
| `--am-input-search-action-color` | 搜索按钮颜色 | `var(--am-color-primary)` |
| `--am-otp-cell-size` | 验证码格子尺寸 | `var(--am-control-height-lg)` |
| `--am-otp-gap` | 验证码格子间距 | `var(--am-margin-xs)` |
| `--am-otp-font-size` | 验证码文字大小 | `var(--am-font-size-heading-3)` |
| `--am-otp-border-radius` | 验证码格子圆角 | `var(--am-border-radius)` |
| `--am-otp-active-border-color` | 验证码激活格子边框与光标颜色 | `var(--am-color-primary)` |

## 与 PC 端的差异 {#diff}

- 不支持 `addonBefore` / `addonAfter`、`count` 配置、`Input.Group` 与 `bordered`。
- 新增 `align`、`clearTrigger`、`enterkeyhint`、`select()` 方法；清除按钮默认只在聚焦且有内容时显示。
- 输入法组合输入期间不会触发 `update:value` / `change`，组合结束后一次性提交。
- `InputSearch` 是移动端搜索栏：默认 `filled` 胶囊形、`allowClear` 开启并带有搜索图标；新增 `showCancel`、`cancelText`、`round` 与 `cancel` 事件；回车搜索后自动失焦以收起键盘。
- `InputPassword` 的 `visibilityToggle` 只支持 `boolean`，不支持 `action="hover"`。
- `InputOTP` 由单个原生输入框驱动（`autocomplete="one-time-code"`，支持短信验证码自动填充与粘贴），`inputMode` 默认为 `'numeric'`；`update:value` 在每次输入时触发，`change` 仍只在填满时触发；不支持 `type`。
- `classes` / `styles` 仅支持对象形式。
