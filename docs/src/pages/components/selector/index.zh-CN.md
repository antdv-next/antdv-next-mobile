---
title: Selector
subtitle: 选择组
description: 在一组平铺的选项中进行单选或多选。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 选项数量不多（通常不超过 10 个），希望全部平铺展示、一步完成选择。
- 作为表单中的单选 / 多选控件，替代 `Radio.Group`、`Checkbox.Group` 获得更大的点击区域。
- 筛选面板中的条件选择。

`Selector` 是移动端特有组件，`value` 始终是数组，可直接放入 `Form.Item` 中使用。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">单选</demo>
<demo src="./demo/multiple.vue">多选</demo>
<demo src="./demo/columns.vue">多列布局</demo>
<demo src="./demo/description.vue">选项描述</demo>
<demo src="./demo/disabled.vue">禁用</demo>
<demo src="./demo/check-mark.vue">隐藏对勾角标</demo>
<demo src="./demo/field-names.vue">自定义字段名与插槽</demo>
<demo src="./demo/style-class.vue">组件变量</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 可选项 | [SelectorOption](#selectoroption)[] | `[]` |
| value | 选中项，支持 `v-model:value` | `(string \| number)[]` | - |
| defaultValue | 默认选中项 | `(string \| number)[]` | `[]` |
| multiple | 是否允许多选 | `boolean` | `false` |
| columns | 列数，设置后选项等宽排列；默认按内容宽度换行 | `number` | - |
| showCheckMark | 是否显示选中项右下角的对勾角标 | `boolean` | `true` |
| disabled | 是否全部禁用 | `boolean` | `false` |
| fieldNames | 自定义 `options` 中 `label`、`description`、`value`、`disabled` 的字段名 | `{ label?: string, description?: string, value?: string, disabled?: string }` | - |
| id | 根节点 id，在 `Form.Item` 中自动设置 | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item' \| 'label' \| 'description', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item' \| 'label' \| 'description', CSSProperties>` | - |

### SelectorOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项文字 | `VueNode` | - |
| description | 选项描述 | `VueNode` | - |
| value | 选项的值 | `string \| number` | - |
| disabled | 是否禁用该选项 | `boolean` | `false` |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 选中项变化时触发，`extra.items` 为选中的原始选项 | `(value: (string \| number)[], extra: { items: SelectorOption[] }) => void` |
| update:value | `v-model:value` 更新 | `(value: (string \| number)[]) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| label | 自定义选项文字，优先于 `option.label` | `{ option, index, checked, disabled }` |
| description | 自定义选项描述，优先于 `option.description` | `{ option, index, checked, disabled }` |
| checkMark | 自定义选中角标内容 | `{ option, index, checked, disabled }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Selector` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-selector-gap` | 选项间距 | `var(--am-margin-xs)` |
| `--am-selector-padding` | 选项内边距 | `var(--am-padding-xs) var(--am-padding)` |
| `--am-selector-min-height` | 选项最小高度 | `var(--am-control-height)` |
| `--am-selector-border-radius` | 选项圆角 | `var(--am-border-radius-sm)` |
| `--am-selector-font-size` | 文字大小 | `var(--am-font-size)` |
| `--am-selector-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-selector-bg` | 选项背景色 | `var(--am-color-fill-tertiary)` |
| `--am-selector-active-color` | 选中文字与角标颜色 | `var(--am-color-primary)` |
| `--am-selector-active-bg` | 选中背景色 | `var(--am-color-primary-bg)` |
| `--am-selector-check-mark-size` | 对勾角标大小 | `18px` |

## 与 PC 端的差异 {#diff}

- PC 端没有对应组件，功能上接近 `Checkbox.Group` / `Radio.Group` / `Tag.CheckableTagGroup` 的平铺选择形态。
- 属性命名沿用 antdv-next 的约定：`options`、`value` / `v-model:value`、`defaultValue`、`fieldNames`、`disabled`。
- 无论单选还是多选，`value` 都是数组；单选模式下再次点击已选项会取消选中（得到 `[]`），需要必选时请配合 `Form.Item` 的 `required` 规则。
