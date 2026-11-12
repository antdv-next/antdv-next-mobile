---
title: Select
subtitle: 选择器
description: 在底部弹层的选项列表中选择一项或多项。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 从一组平铺的选项中选择，选项较多、文字较长，或需要搜索、描述信息时。
- 选项很少（2 ~ 6 个）且希望直接展示时使用 [Selector](/components/selector) 或 [Radio](/components/radio)；需要滚轮体验时使用 [Picker](/components/picker)。

API 与 antdv-next 的 `Select` 对齐：`options`、`fieldNames`、`value`、`mode="multiple"`、`labelInValue`、`showSearch`、`filterOption`、`optionRender`、`labelRender`、`maxCount`、`maxTagCount`。移动端以底部弹层的列表代替下拉菜单：单选点击即提交并关闭，多选为勾选列表，点击「确定」提交。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/multiple.vue">多选</demo>
<demo src="./demo/search.vue">搜索</demo>
<demo src="./demo/option.vue">选项描述与自定义渲染</demo>
<demo src="./demo/group.vue">分组与字段名</demo>
<demo src="./demo/virtual.vue">大数据量 / 虚拟滚动</demo>
<demo src="./demo/variant.vue">形态与状态</demo>
<demo src="./demo/custom-trigger.vue" full>自定义触发器与表单</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项数据。带 `options` 字段的项会渲染为分组 | `SelectOption[]` | - |
| fieldNames | 自定义字段名 | `{ label?: string, value?: string, options?: string }` | `{ label: 'label', value: 'value', options: 'options' }` |
| value (v-model) | 已提交的值，多选时为数组 | `string \| number \| (string \| number)[] \| LabeledValue \| LabeledValue[] \| null` | - |
| defaultValue | 默认值（非受控） | 同 `value` | - |
| mode | 设置为 `multiple` 开启多选：勾选列表 + 确认按钮 | `'multiple'` | - |
| labelInValue | 把 `{ label, value }` 作为值，而不是单纯的 `value` | `boolean` | `false` |
| showSearch | 在弹层顶部显示搜索框 | `boolean \| { placeholder?: string, filterOption?: boolean \| Function, autoFocus?: boolean }` | `false` |
| filterOption | 是否根据输入项筛选。`false` 关闭本地筛选（用于远程搜索）；函数自定义筛选逻辑 | `boolean \| ((input: string, option: SelectOption) => boolean)` | `true`（匹配 label 与 description） |
| optionRender | 自定义选项内容，同名插槽 `option` 优先 | `(info: { option, index, selected }) => VueNode` | - |
| labelRender | 自定义触发器中已选项的显示内容，同名插槽优先 | `(item: { label, value }) => VueNode` | - |
| notFoundContent | 没有选项时显示的内容，同名插槽优先 | `VueNode` | `'暂无数据'` |
| maxCount | 多选时最多可选个数，达到后其余选项禁用 | `number` | - |
| maxTagCount | 多选时触发器中最多显示的已选项个数 | `number` | - |
| maxTagPlaceholder | 被 `maxTagCount` 隐藏的已选项的占位内容 | `VueNode \| ((omitted: LabeledValue[]) => VueNode)` | `+N...` |
| loading | 加载状态，列表显示加载图标 | `boolean` | `false` |
| virtual | 虚拟滚动：选项列表通过 [VirtualList](/components/virtual-list) 渲染，只挂载可视区域附近的选项；`false` 时渲染全部选项 | `boolean` | `true` |
| listHeight | 弹层中选项列表的最大高度 | `number \| string` | `360`（`--am-select-list-max-height`） |
| listItemHeight | 选项高度（px）：作为选项的最小高度与未测量前的预估高度。选项没有描述、分组与自定义渲染时按固定高度渲染 | `number` | `48` |
| open (v-model) | 弹层是否展开 | `boolean` | - |
| defaultOpen | 默认是否展开 | `boolean` | `false` |
| placeholder | 占位文字 | `string` | `'请选择'` |
| title | 弹层标题，同名插槽优先 | `VueNode` | - |
| okText | 确认按钮文字（多选时显示） | `string` | `'确定'` |
| cancelText | 取消按钮文字 | `string` | `'取消'` |
| disabled | 是否禁用 | `boolean` | `false` |
| allowClear | 有值时显示清除图标 | `boolean` | `false` |
| status | 校验状态 | `'error' \| 'warning'` | - |
| variant | 形态变体，表单内默认为 `borderless` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` |
| size | 触发器尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| trigger | 是否渲染内置触发器 | `boolean` | `true` |
| suffixIcon | 触发器后缀图标，同名插槽优先，`null` 表示隐藏 | `VueNode` | 箭头图标 |
| getContainer | 弹层挂载节点，`false` 表示原地渲染 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 弹层层级 | `number` | - |
| maskClosable | 点击遮罩是否关闭（视为取消） | `boolean` | `true` |
| destroyOnHidden | 关闭时销毁弹层内容 | `boolean` | `false` |
| id | 触发器的 id，表单内默认取字段 id | `string` | - |
| rootClass | 触发器与弹层根节点的类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'content' \| 'suffix' \| 'popup', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'content' \| 'suffix' \| 'popup', CSSProperties>` | - |

### SelectOption

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| label | 选项文字 | `string \| number` |
| value | 选项值 | `string \| number` |
| disabled | 是否禁用 | `boolean` |
| description | 显示在文字下方的描述信息（移动端新增） | `string` |
| options | 设置后该项渲染为分组，值为组内选项 | `SelectOption[]` |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 已提交的值变化时触发 | `(value, option: SelectOption \| SelectOption[]) => void` |
| select | 选中选项时触发（多选时为勾选，尚未提交） | `(value: string \| number, option: SelectOption) => void` |
| deselect | 多选时取消勾选触发（尚未提交） | `(value: string \| number, option: SelectOption) => void` |
| search | 搜索框内容变化时触发，弹层关闭时会以空字符串触发一次 | `(value: string) => void` |
| confirm | 选择完成（单选点击选项、多选点击确定）时触发 | `(value) => void` |
| cancel | 点击取消按钮或遮罩时触发 | `() => void` |
| openChange | 弹层展开 / 收起时触发 | `(open: boolean) => void` |
| clear | 点击清除图标时触发 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义触发器，替换内置的输入框 | `{ open, value, label, disabled, toggle }` |
| option | 自定义选项内容 | `{ option, index, selected }` |
| labelRender | 自定义触发器中已选项的显示内容 | `{ label, value }` |
| notFoundContent | 没有选项时显示的内容 | - |
| title | 弹层标题 | - |
| suffixIcon | 触发器后缀图标 | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| toggle | 切换弹层，可传入目标状态 | `(open?: boolean) => void` |

## 主题变量 {#design-token}

触发器与弹层变量见 [Picker](/components/picker#design-token)。下列变量声明在弹层内容 `.am-select-panel` 上。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-select-list-max-height` | 列表最大高度 | `360px` |
| `--am-select-list-min-height` | 列表最小高度 | `160px` |
| `--am-select-font-size` | 选项字号 | `var(--am-font-size-lg)` |
| `--am-select-option-height` | 选项最小高度 | `48px` |
| `--am-select-option-padding-inline` | 选项水平内边距 | `var(--am-padding)` |
| `--am-select-active-color` | 选中项颜色 | `var(--am-color-primary)` |
| `--am-select-description-color` | 描述文字颜色 | `var(--am-color-text-tertiary)` |
| `--am-select-disabled-color` | 禁用选项文字颜色 | `var(--am-color-text-disabled)` |
| `--am-select-search-bg` | 搜索框背景色 | `var(--am-color-fill-tertiary)` |
| `--am-select-search-height` | 搜索框高度 | `36px` |
| `--am-select-check-size` | 多选勾选框尺寸 | `20px` |

## 与 PC 端的差异 {#diff}

- 使用底部弹层的列表代替下拉菜单；搜索框位于弹层顶部，而不是触发器内。
- 多选时在弹层内勾选，点击「确定」后才提交；`select` / `deselect` 在勾选时触发，`change` 在提交时触发。触发器以文字拼接已选项（`A、B +2...`），没有标签（Tag）形态，因此不支持 `tagRender`、`maxTagTextLength`。
- 不支持 `mode="tags"`、`tokenSeparators`、`popupRender`、`placement`、`popupMatchSelectWidth`、`optionFilterProp`、`optionLabelProp`、`defaultActiveFirstOption`、`Select.Option` / `Select.OptGroup` 子组件写法（请使用 `options`）等 API。
- `virtual`、`listHeight`、`listItemHeight` 与 PC 端同名：`listHeight` 默认为 `360`（PC 端 `256`），`listItemHeight` 默认为 `48`（PC 端 `24`）并同时作为选项的最小高度；选项高度默认按实际内容测量，因此带描述的选项也可以虚拟滚动。打开弹层时会把已选项滚动到列表中间。
- 单选清除后的值为 `null`（PC 端为 `undefined`），多选为 `[]`；`allowClear` 默认为 `false`，仅支持布尔值。
- 选项新增 `description` 字段；新增 `title`、`okText`、`cancelText`、`trigger` 属性，`confirm`、`cancel` 事件与 `default`（自定义触发器）插槽。
- 弹层容器使用 `getContainer`（与 Popup 一致），不支持 `getPopupContainer`。
- `classes` / `styles` 的语义化结构为 `root`、`content`、`suffix`、`popup`。
