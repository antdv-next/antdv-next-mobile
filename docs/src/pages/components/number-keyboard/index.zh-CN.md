---
title: NumberKeyboard
subtitle: 数字键盘
description: 虚拟数字键盘，用于输入金额、密码、验证码、身份证号等。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 需要安全地输入支付密码、验证码，不希望唤起系统键盘时。
- 需要定制按键（小数点、`X`、`00`）或把「完成」按钮做成主操作（如「支付」）时。

键盘从底部滑出，**没有遮罩、不锁定页面滚动、不会抢占焦点**。它只负责产生按键事件与维护 `v-model:value` 字符串，展示输入内容的「输入框」由业务自行实现（例如搭配 `Input` 的只读态或密码格）。移动端独有组件，PC 端没有对应组件。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/custom.vue">带右侧栏的键盘</demo>
<demo src="./demo/extra-key.vue">额外按键</demo>
<demo src="./demo/title.vue">标题与乱序</demo>
<demo src="./demo/password.vue">密码输入</demo>
<demo src="./demo/inline.vue">内嵌展示</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open (v-model) | 是否显示键盘 | `boolean` | `false`（内嵌时为 `true`） |
| defaultOpen | 默认是否显示（非受控） | `boolean` | - |
| value (v-model) | 当前输入的字符串 | `string` | - |
| defaultValue | 默认值（非受控） | `string` | `''` |
| maxlength | 输入的最大长度，超出后按键不再生效 | `number` | - |
| title | 键盘标题，同名插槽优先 | `VueNode` | - |
| theme | 键盘样式。`custom` 会在右侧增加删除键与大号的完成按钮 | `'default' \| 'custom'` | `'default'` |
| extraKey | 额外按键的内容。默认样式支持 1 个（左下角），`custom` 样式支持最多 2 个 | `string \| string[]` | - |
| randomKeyOrder | 每次打开时随机打乱数字键的顺序，用于安全场景 | `boolean` | `false` |
| showDeleteKey | 是否显示删除键 | `boolean` | `true` |
| closeButtonText | 标题栏右侧关闭按钮的文字，为空则不显示（默认样式） | `string` | - |
| confirmText | 右侧完成按钮的文字（`custom` 样式） | `string` | `'完成'` |
| hideOnClickOutside | 点击键盘以外的区域时是否收起 | `boolean` | `true` |
| safeArea | 是否开启底部安全区适配 | `boolean` | `true` |
| poppable | 是否固定在屏幕底部。`false` 时内嵌在页面中 | `boolean` | `true` |
| getContainer | 固定模式下的挂载节点，`false` 表示原地渲染 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 层级 | `number` | 自动递增 |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'body' \| 'key', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'body' \| 'key', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| input | 点击数字键或额外按键时触发 | `(key: string) => void` |
| delete | 点击删除键时触发，长按会连续触发 | `() => void` |
| confirm | 点击完成按钮时触发（`custom` 样式） | `() => void` |
| close | 点击关闭按钮或完成按钮时触发 | `() => void` |
| blur | 点击键盘以外的区域时触发 | `() => void` |
| openChange | 键盘显示 / 收起时触发 | `(open: boolean) => void` |
| update:value | `v-model:value` 更新 | `(value: string) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| title | 自定义标题 |
| delete | 自定义删除键内容 |
| extraKey | 自定义左下角按键内容（默认样式） |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.NumberKeyboard` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-number-keyboard-bg` | 键盘背景色 | `var(--am-color-bg-layout)` |
| `--am-number-keyboard-key-height` | 按键高度 | `48px` |
| `--am-number-keyboard-key-font-size` | 按键字号 | `24px` |
| `--am-number-keyboard-key-bg` | 按键背景色 | `var(--am-color-bg-container)` |
| `--am-number-keyboard-key-active-bg` | 按键按下时叠加的颜色 | `var(--am-color-fill)` |
| `--am-number-keyboard-key-radius` | 按键圆角 | `var(--am-border-radius)` |
| `--am-number-keyboard-gap` | 按键间距 | `6px` |
| `--am-number-keyboard-padding` | 键盘内边距 | `6px` |
| `--am-number-keyboard-title-height` | 标题栏高度 | `40px` |
| `--am-number-keyboard-title-color` | 标题颜色 | `var(--am-color-text-secondary)` |
| `--am-number-keyboard-title-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-number-keyboard-close-color` | 关闭按钮颜色 | `var(--am-color-primary)` |
| `--am-number-keyboard-confirm-bg` | 完成按钮背景色 | `var(--am-color-primary)` |
| `--am-number-keyboard-confirm-active-bg` | 完成按钮按下时的背景色 | `var(--am-color-primary-active)` |
| `--am-number-keyboard-confirm-color` | 完成按钮文字颜色 | `var(--am-color-text-light-solid)` |
| `--am-number-keyboard-confirm-font-size` | 完成按钮字号 | `var(--am-font-size-lg)` |
| `--am-number-keyboard-z-index` | 固定模式的层级基准 | `var(--am-z-index-popup-base)` |
