---
title: Switch
subtitle: 开关
description: 使用开关切换两种状态之间。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 需要表示开关状态 / 两种状态之间的切换时。
- 和 `Checkbox` 的区别是，切换 `Switch` 会直接触发状态改变，而 `Checkbox` 一般用于状态标记，需要和提交操作配合。

API 与 antdv-next 的 `Switch` 对齐：`v-model:checked`、`checkedChildren` / `unCheckedChildren`、`checkedValue` / `unCheckedValue`、`loading`。移动端额外提供了 `beforeChange` 异步拦截。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/disabled.vue">不可用</demo>
<demo src="./demo/children.vue">文字和图标</demo>
<demo src="./demo/size.vue">两种大小</demo>
<demo src="./demo/loading.vue">加载中</demo>
<demo src="./demo/before-change.vue">异步控制</demo>
<demo src="./demo/checked-value.vue">自定义开关值</demo>
<demo src="./demo/token.vue">自定义颜色</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked (v-model) | 当前是否选中 | `boolean \| string \| number \| object` | - |
| defaultChecked | 初始是否选中 | `boolean \| string \| number \| object` | `false` |
| value (v-model) | `checked` 的别名 | `boolean \| string \| number \| object` | - |
| defaultValue | `defaultChecked` 的别名 | `boolean \| string \| number \| object` | - |
| checkedValue | 选中时的值 | `boolean \| string \| number \| object` | `true` |
| unCheckedValue | 非选中时的值 | `boolean \| string \| number \| object` | `false` |
| checkedChildren | 选中时的内容，同名插槽优先 | `VueNode` | - |
| unCheckedChildren | 非选中时的内容，同名插槽优先 | `VueNode` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 加载中的开关，此时不可操作 | `boolean` | `false` |
| size | 开关大小 | `'default' \| 'small'` | `'default'` |
| beforeChange | 切换前的拦截函数，参数为即将变成的值；返回 `false`、resolve `false` 或 reject 时取消切换，Promise 等待期间自动进入加载状态 | `(checked) => boolean \| void \| Promise<boolean \| void>` | - |
| autoFocus | 自动获取焦点 | `boolean` | `false` |
| id | 根节点 `id`，在 `Form.Item` 内默认取字段 id | `string` | - |
| title | 原生 `title` | `string` | - |
| tabIndex | 原生 `tabindex` | `number` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'content' \| 'indicator', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'content' \| 'indicator', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 变化时触发 | `(checked, event: MouseEvent) => void` |
| click | 点击时触发（禁用与加载中不触发），早于 `beforeChange` | `(checked, event: MouseEvent) => void` |
| update:checked | 变化时触发，用于 `v-model:checked` | `(checked) => void` |
| update:value | 变化时触发，用于 `v-model:value` | `(checked) => void` |
| focus | 获得焦点时触发 | `(event: FocusEvent) => void` |
| blur | 失去焦点时触发 | `(event: FocusEvent) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| checkedChildren | 选中时的内容，优先于同名属性 |
| unCheckedChildren | 非选中时的内容，优先于同名属性 |

### 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 获取焦点 | `() => void` |
| blur | 移除焦点 | `() => void` |
| nativeElement | 根元素 | `HTMLButtonElement` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Switch` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-switch-height` | 开关高度 | `30px`（small：`22px`） |
| `--am-switch-min-width` | 开关最小宽度 | `50px`（small：`36px`） |
| `--am-switch-handle-size` | 滑块尺寸 | `26px`（small：`18px`） |
| `--am-switch-padding` | 滑块与轨道的间距 | `2px` |
| `--am-switch-font-size` | 内容文字大小 | `var(--am-font-size-sm)` |
| `--am-switch-color` | 选中时的背景色 | `var(--am-color-primary)` |
| `--am-switch-color-active` | 选中时按压的背景色 | `var(--am-color-primary-active)` |
| `--am-switch-bg` | 未选中时的背景色 | `var(--am-color-text-quaternary)` |
| `--am-switch-bg-active` | 未选中时按压的背景色 | `var(--am-color-text-tertiary)` |
| `--am-switch-handle-bg` | 滑块背景色 | `var(--am-color-white)` |
| `--am-switch-duration` | 动画时长 | `var(--am-motion-duration-mid)` |

## 与 PC 端的差异 {#diff}

- 新增 `beforeChange`，用于切换前的同步 / 异步确认，等待期间自动展示加载状态。
- 默认尺寸更大（30px 高），按压时滑块会像 iOS 原生开关一样拉伸，没有 hover 态与波纹动效。
- 新增 `focus`、`blur` 事件；`change` / `click` 的第二个参数仅为 `MouseEvent`（键盘操作同样以 `click` 事件派发）。
- `classes` / `styles` 只支持对象形式，不支持函数形式。
