---
title: Cascader
subtitle: 级联选择
description: 在底部弹层中逐级选择具有层级关系的数据。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 需要从一组相关联的数据集合中选择，例如省市区、公司层级、商品分类等。
- 层级固定且每级选项不多（两三列）时，也可以使用 [Picker](/components/picker) 的级联列。

API 与 Antdv Next 的 `Cascader` 对齐：`options`、`fieldNames`、`value`（值路径数组）、`changeOnSelect`、`loadData`、`displayRender`。移动端在底部弹层中以「页签 + 选项列表」逐级选择，选中叶子节点后自动提交并关闭。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/change-on-select.vue">选择即改变</demo>
<demo src="./demo/lazy.vue">动态加载选项</demo>
<demo src="./demo/virtual.vue">大数据量 / 虚拟滚动</demo>
<demo src="./demo/custom.vue">自定义显示与字段名</demo>
<demo src="./demo/custom-trigger.vue" full>自定义触发器与表单</demo>
<demo src="./demo/view.vue" full>内嵌视图 CascaderView</demo>

## API

### Cascader 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 可选项数据源 | `CascaderOption[]` | - |
| fieldNames | 自定义字段名 | `{ label?: string, value?: string, children?: string }` | `{ label: 'label', value: 'value', children: 'children' }` |
| value (v-model) | 已提交的值路径 | `(string \| number)[]` | - |
| defaultValue | 默认值（非受控） | `(string \| number)[]` | - |
| changeOnSelect | 允许只选中父级选项。开启后弹层显示「确定」按钮，需要手动确认 | `boolean` | `false` |
| loadData | 动态加载选项：选中 `isLeaf: false` 的选项时调用，为目标选项设置 `children`（可返回 Promise） | `(selectedOptions: CascaderOption[]) => void \| Promise<void>` | - |
| displayRender | 自定义触发器的显示内容，同名插槽优先 | `(labels: string[], selectedOptions: CascaderOption[]) => VueNode` | `labels => labels.join(' / ')` |
| optionRender | 自定义选项内容，同名插槽 `option` 优先 | `(info: { option, level, selected }) => VueNode` | - |
| notFoundContent | 某一级没有选项时显示的内容，同名插槽优先 | `VueNode` | `'暂无数据'` |
| virtual | 虚拟滚动：每一级的选项列表通过 [VirtualList](/components/virtual-list) 渲染，只挂载可视区域附近的选项；`false` 时渲染全部选项 | `boolean` | `true` |
| listHeight | 选项列表的高度 | `number \| string` | 视图高度（`--am-cascader-view-height`，`360px`）减去页签 |
| listItemHeight | 选项高度（px）：作为选项的最小高度与未测量前的预估高度。没有自定义渲染时按固定高度渲染 | `number` | `48` |
| open (v-model) | 弹层是否展开 | `boolean` | - |
| defaultOpen | 默认是否展开 | `boolean` | `false` |
| placeholder | 占位文字 | `string` | `'请选择'` |
| title | 弹层标题，同名插槽优先 | `VueNode` | - |
| okText | 确认按钮文字（`changeOnSelect` 时显示） | `string` | `'确定'` |
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

### CascaderOption

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| label | 选项文字 | `string \| number` |
| value | 选项值 | `string \| number` |
| disabled | 是否禁用 | `boolean` |
| children | 子选项 | `CascaderOption[]` |
| isLeaf | 是否为叶子节点。配合 `loadData` 使用，`false` 表示子选项需要动态加载 | `boolean` |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 已提交的值变化时触发 | `(value: (string \| number)[], selectedOptions: CascaderOption[]) => void` |
| confirm | 选择完成（选中叶子节点或点击确定）时触发 | `(value: (string \| number)[], selectedOptions: CascaderOption[]) => void` |
| cancel | 点击取消按钮或遮罩时触发 | `() => void` |
| select | 点击任意一级的选项时触发，此时值尚未提交 | `(option: CascaderOption, level: number) => void` |
| tabChange | 当前层级（页签）变化时触发 | `(index: number) => void` |
| openChange | 弹层展开 / 收起时触发 | `(open: boolean) => void` |
| clear | 点击清除图标时触发 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义触发器，替换内置的输入框 | `{ open, value, label, selectedOptions, disabled, toggle }` |
| displayRender | 自定义触发器的显示内容 | `{ labels, selectedOptions }` |
| option | 自定义选项内容 | `{ option, level, selected }` |
| notFoundContent | 某一级没有选项时显示的内容 | - |
| title | 弹层标题 | - |
| suffixIcon | 触发器后缀图标 | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| toggle | 切换弹层，可传入目标状态 | `(open?: boolean) => void` |

### CascaderView

不带触发器与弹层的级联视图，也可通过 `Cascader.View` 访问。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options / fieldNames / changeOnSelect / loadData / optionRender / notFoundContent / virtual / listHeight / listItemHeight | 同 Cascader | - | - |
| value (v-model) | 当前值路径 | `(string \| number)[]` | - |
| defaultValue | 默认值（非受控） | `(string \| number)[]` | - |
| placeholder | 尚未选择的层级的页签文字 | `string` | `'请选择'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'tabs' \| 'tab' \| 'list' \| 'option', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'tabs' \| 'tab' \| 'list' \| 'option', CSSProperties>` | - |

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 值变化时触发：默认仅在选中叶子节点时，`changeOnSelect` 时每一级都会触发 | `(value, selectedOptions) => void` |
| finish | 选中叶子节点（路径完整）时触发 | `(value, selectedOptions) => void` |
| select | 点击任意一级的选项时触发 | `(option, level) => void` |
| tabChange | 当前层级变化时触发 | `(index: number) => void` |

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| scrollToSelected | 把当前层级的已选项滚动到列表中间（切换页签、打开弹层时会自动调用） | `() => void` |

## 主题变量 {#design-token}

触发器与弹层变量见 [Picker](/components/picker#design-token)。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-cascader-view-height` | 视图高度 | `360px` |
| `--am-cascader-view-font-size` | 字号 | `var(--am-font-size-lg)` |
| `--am-cascader-view-tab-height` | 页签高度 | `44px` |
| `--am-cascader-view-tab-color` | 页签文字颜色 | `var(--am-color-text)` |
| `--am-cascader-view-tab-placeholder-color` | 未选择页签的文字颜色 | `var(--am-color-text-tertiary)` |
| `--am-cascader-view-active-color` | 当前页签与选中项的颜色 | `var(--am-color-primary)` |
| `--am-cascader-view-option-height` | 选项最小高度 | `48px` |
| `--am-cascader-view-option-padding-inline` | 选项水平内边距 | `var(--am-padding)` |
| `--am-cascader-view-disabled-color` | 禁用选项文字颜色 | `var(--am-color-text-disabled)` |

## 与 PC 端的差异 {#diff}

- 使用底部弹层的「页签 + 列表」代替多列下拉菜单：选中一项后自动进入下一级，选中叶子节点后自动提交并关闭。
- `changeOnSelect` 开启后不会在每次点击时立即提交，而是显示「确定」按钮，由用户确认当前路径。
- 不支持 `multiple`、`showCheckedStrategy`、`showSearch`、`expandTrigger`、`popupRender`、`placement`、`tagRender`、`maxTagCount`、`Cascader.Panel` 等 API；内嵌场景请使用 `CascaderView`。
- `loadData` 除了 PC 端「修改目标选项的 `children`」的写法外，也支持返回 Promise；若加载后没有子选项，则把该选项当作叶子节点。
- 新增与 Select 一致的 `virtual`、`listHeight`、`listItemHeight`：每一级的列表都是虚拟滚动的，切换页签时会把该级的已选项滚动到列表中间。
- `allowClear` 默认为 `false`，仅支持布尔值。
- 弹层容器使用 `getContainer`（与 Popup 一致），不支持 `getPopupContainer`。
- 新增 `confirm`、`cancel`、`select`、`tabChange` 事件，以及 `title`、`okText`、`cancelText`、`trigger` 属性和 `default`（自定义触发器）插槽。
- `classes` / `styles` 的语义化结构为 `root`、`content`、`suffix`、`popup`。
