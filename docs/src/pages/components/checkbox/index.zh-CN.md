---
title: Checkbox
subtitle: 多选框
description: 在一组可选项中进行多项选择。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 在一组可选项中进行多项选择时。
- 单独使用可以表示两种状态之间的切换（如「同意协议」），和 `Switch` 类似；区别在于切换 `Switch` 会直接触发状态改变，而 `Checkbox` 一般用于状态标记，需要和提交操作配合。

API 与 Antdv Next 的 `Checkbox` 对齐：`v-model:checked`、`Checkbox.Group` 的 `v-model:value` / `options`，`change` 事件的参数结构也保持一致，PC 端的处理函数可以直接复用。移动端额外提供了列表形态（`block`）、圆形（`shape`）与自定义图标。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/disabled.vue">不可用</demo>
<demo src="./demo/group.vue">选项组</demo>
<demo src="./demo/check-all.vue">全选</demo>
<demo src="./demo/block.vue" full>列表形态</demo>
<demo src="./demo/shape-icon.vue">形状与自定义图标</demo>
<demo src="./demo/max.vue">限制可选数量</demo>
<demo src="./demo/checked-value.vue">自定义选中值</demo>

## API

### Checkbox 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked (v-model) | 是否选中 | `boolean \| string \| number \| object` | - |
| defaultChecked | 初始是否选中 | `boolean \| string \| number \| object` | `false` |
| checkedValue | 选中时 `checked` 的值 | `boolean \| string \| number \| object` | `true` |
| unCheckedValue | 未选中时 `checked` 的值 | `boolean \| string \| number \| object` | `false` |
| indeterminate | 半选状态，只负责样式控制，未选中时生效 | `boolean` | `false` |
| disabled | 禁用状态 | `boolean` | `false` |
| value | 在 `Checkbox.Group` 中使用时的选项值 | `any` | - |
| block | 通栏展示：文字在左、勾选框在右 | `boolean` | `false` |
| shape | 勾选框形状 | `'square' \| 'round'` | `'square'` |
| icon | 自定义图标，同名插槽优先 | `VueNode \| (ctx: { checked, indeterminate, disabled }) => VueNode` | - |
| name | 原生 `input` 的 `name` | `string` | - |
| id | 原生 `input` 的 `id`，在 `Form.Item` 内默认取字段 id | `string` | - |
| title | 原生 `title` | `string` | - |
| tabIndex | 原生 `tabindex` | `number` | - |
| autoFocus | 自动获取焦点 | `boolean` | `false` |
| required | 原生 `required` | `boolean` | `false` |
| skipGroup | 忽略外层的 `Checkbox.Group` | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'label', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'label', CSSProperties>` | - |

### Checkbox 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 变化时触发 | `(e: CheckboxChangeEvent) => void` |
| update:checked | 变化时触发，用于 `v-model:checked` | `(checked: any) => void` |
| click | 点击时触发 | `(event: MouseEvent) => void` |
| focus | 获得焦点时触发 | `(event: FocusEvent) => void` |
| blur | 失去焦点时触发 | `(event: FocusEvent) => void` |

```ts
interface CheckboxChangeEvent {
  target: CheckboxProps & { checked: boolean }
  stopPropagation: () => void
  preventDefault: () => void
  nativeEvent: Event
}
```

### Checkbox 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 文字内容 | - |
| icon | 自定义图标，优先于 `icon` 属性 | `{ checked: boolean, indeterminate: boolean, disabled: boolean }` |

### Checkbox 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 获取焦点 | `() => void` |
| blur | 移除焦点 | `() => void` |
| input | 原生 `input` 元素 | `HTMLInputElement` |
| nativeElement | 根元素 | `HTMLElement` |

### Checkbox.Group 属性 {#group-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 选中的选项值 | `any[]` | - |
| defaultValue | 默认选中的选项值 | `any[]` | `[]` |
| options | 选项配置，设置后忽略默认插槽 | `(string \| number \| CheckboxOptionType)[]` | - |
| disabled | 整组禁用 | `boolean` | `false` |
| name | 组内所有 `input` 的 `name` | `string` | - |
| max | 最多可选数量，达到后其余选项不可选 | `number` | - |
| block | 列表形态，每个选项通栏展示 | `boolean` | `false` |
| shape | 组内勾选框的形状 | `'square' \| 'round'` | `'square'` |
| labelRender | 自定义选项文字，同名插槽优先 | `(params: { item: CheckboxOptionType, index: number }) => VueNode` | - |
| role | 根节点的 `role` | `string` | `'group'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item' \| 'itemIcon' \| 'itemLabel', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item' \| 'itemIcon' \| 'itemLabel', CSSProperties>` | - |

```ts
interface CheckboxOptionType {
  label: VueNode
  value: any
  disabled?: boolean
  title?: string
  id?: string
  required?: boolean
  class?: string
  style?: CSSProperties
}
```

### Checkbox.Group 事件 {#group-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 变化时触发，值按选项顺序排列 | `(checkedValue: any[]) => void` |
| update:value | 变化时触发，用于 `v-model:value` | `(checkedValue: any[]) => void` |

### Checkbox.Group 插槽 {#group-slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自由组合 `Checkbox`，未设置 `options` 时生效 | - |
| labelRender | 自定义选项文字 | `{ item: CheckboxOptionType, index: number }` |
| icon | 统一自定义组内图标 | `{ checked: boolean, indeterminate: boolean, disabled: boolean }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Checkbox` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-checkbox-size` | 勾选框尺寸 | `20px` |
| `--am-checkbox-gap` | 勾选框与文字间距 | `var(--am-padding-xs)` |
| `--am-checkbox-font-size` | 文字大小 | `var(--am-font-size-lg)` |
| `--am-checkbox-border-radius` | 勾选框圆角 | `var(--am-border-radius-sm)` |
| `--am-checkbox-color` | 选中颜色 | `var(--am-color-primary)` |
| `--am-checkbox-border-color` | 未选中边框颜色 | `var(--am-color-border)` |
| `--am-checkbox-min-height` | 最小高度（触控热区） | `32px` |
| `--am-checkbox-block-height` | `block` 形态的最小行高 | `48px` |
| `--am-checkbox-group-gap` | 组内选项水平间距 | `var(--am-padding)` |

## 与 PC 端的差异 {#diff}

- 新增 `block`（列表形态）、`shape`（圆形勾选框）、`icon` 属性 / 插槽，`Checkbox.Group` 新增 `max`、`block`、`shape` 与 `icon` 插槽。
- 勾选框尺寸更大（20px），整行 `label` 都是点击热区，最小高度 32px。
- 不提供 `mouseenter`、`mouseleave`、`keypress`、`keydown` 事件，没有 hover 态与波纹动效。
- `CheckboxOptionType` 不支持 `onChange`，请监听 `Checkbox.Group` 的 `change` 事件。
- `classes` / `styles` 只支持对象形式，不支持函数形式。
