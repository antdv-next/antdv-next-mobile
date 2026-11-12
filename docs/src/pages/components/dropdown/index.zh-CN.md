---
title: Dropdown
subtitle: 下拉菜单
description: 向下展开的筛选菜单栏，常用于列表页顶部的排序与筛选。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 列表页顶部需要一排筛选项（排序、分类、更多筛选……），点击后在菜单栏下方展开面板进行选择。
- 面板内容可以是单选列表，也可以是任意自定义内容（多选、表单等）。

> 注意：移动端的 `Dropdown` 是「筛选菜单栏」，与 PC 端 Antdv Next 中悬停 / 点击弹出的「下拉操作菜单」不是同一种交互。在移动端，操作菜单请使用 [ActionSheet](/components/action-sheet) 或 [Popover](/components/popover) 的菜单模式。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/custom.vue" full>自定义面板</demo>
<demo src="./demo/highlight.vue" full>高亮与禁用</demo>
<demo src="./demo/control.vue" full>受控展开</demo>
<demo src="./demo/arrow.vue" full>自定义箭头与样式</demo>

## API

```vue
<am-dropdown v-model:active-key="activeKey">
  <am-dropdown-item key="sort" v-model:value="sort" :options="options" />
  <am-dropdown-item key="filter" title="筛选">
    自定义内容
  </am-dropdown-item>
</am-dropdown>
```

`DropdownItem` 通过 Vue 的 `key` 标识自己，对应 `Dropdown` 的 `activeKey`。未设置 `key` 时会自动生成一个。

### Dropdown 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| activeKey | 当前展开项的 `key`，`null` 表示全部收起，支持 `v-model:activeKey` | `string \| number \| null` | - |
| defaultActiveKey | 默认展开项的 `key` | `string \| number \| null` | `null` |
| closeOnMaskClick | 点击遮罩后是否收起 | `boolean` | `true` |
| closeOnClickAway | 触摸菜单栏与面板以外的区域时是否收起 | `boolean` | `true` |
| arrowIcon | 自定义箭头图标，同名插槽优先 | `VueNode` | `<CaretDownOutlined />` |
| getContainer | 面板的挂载节点，`false` 为挂载在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 面板层级 | `number` | 自动递增 |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'nav' \| 'item' \| 'title' \| 'arrow', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'nav' \| 'item' \| 'title' \| 'arrow', CSSProperties>` | - |

### Dropdown 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:activeKey | 展开项变化 | `(key: string \| number \| null) => void` |
| change | 展开项变化时触发，收起时为 `null` | `(key: string \| number \| null) => void` |

### Dropdown 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | `DropdownItem` 列表 |
| arrowIcon | 自定义箭头图标，优先于 `arrowIcon` 属性 |

### Dropdown 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| close | 收起当前展开的面板 | `() => void` |

### DropdownItem 属性 {#item-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 菜单栏上的标题，同名插槽优先。未设置时显示已选选项的 `label` | `VueNode` | - |
| options | 单选列表的选项，未提供默认插槽时渲染 | `{ label: VueNode, value: string \| number, disabled?: boolean }[]` | `[]` |
| value | 已选中的选项值，支持 `v-model:value` | `string \| number` | - |
| defaultValue | 默认选中的选项值 | `string \| number` | - |
| highlight | 是否高亮标题（例如已应用了筛选条件） | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| closeOnSelect | 选择选项后是否收起面板 | `boolean` | `true` |
| showFooter | 是否显示「重置 / 确定」页脚，用于自定义面板 | `boolean` | `false` |
| confirmText | 确定按钮文字 | `VueNode` | `确定` |
| resetText | 重置按钮文字 | `VueNode` | `重置` |
| arrowIcon | 自定义箭头图标，优先于 `Dropdown` 的 `arrowIcon` | `VueNode` | - |
| forceRender | 首次展开前预渲染面板 | `boolean` | `false` |
| destroyOnHidden | 收起后销毁面板内容 | `boolean` | `false` |
| rootClass | 面板层根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'mask' \| 'panel' \| 'body' \| 'option' \| 'footer', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'mask' \| 'panel' \| 'body' \| 'option' \| 'footer', CSSProperties>` | - |

### DropdownItem 事件 {#item-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:value | 选中值变化 | `(value: string \| number) => void` |
| change | 选中的选项变化时触发 | `(value: string \| number, option: DropdownOption) => void` |
| confirm | 点击页脚的确定按钮时触发，随后面板收起 | `() => void` |
| reset | 点击页脚的重置按钮时触发，面板不会收起 | `() => void` |
| afterOpenChange | 展开 / 收起动画结束后触发 | `(open: boolean) => void` |

### DropdownItem 插槽 {#item-slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义面板内容，替代选项列表 | `{ close }` |
| title | 菜单栏上的标题 | - |
| arrowIcon | 自定义箭头图标 | - |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Dropdown` 或直接覆盖 CSS 变量定制。菜单栏的变量作用于 `.am-dropdown`，面板的变量作用于 `DropdownItem` 的 `rootClass`（`.am-dropdown-layer`）。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-dropdown-height` | 菜单栏高度 | `44px` |
| `--am-dropdown-bg` | 菜单栏背景色 | `var(--am-color-bg-container)` |
| `--am-dropdown-color` | 标题颜色 | `var(--am-color-text)` |
| `--am-dropdown-active-color` | 展开 / 高亮时的标题颜色 | `var(--am-color-primary)` |
| `--am-dropdown-font-size` | 标题字号 | `var(--am-font-size)` |
| `--am-dropdown-arrow-size` | 箭头大小 | `10px` |
| `--am-dropdown-arrow-color` | 箭头颜色 | `var(--am-color-text-quaternary)` |
| `--am-dropdown-z-index` | 面板层级（未自动分配时） | `var(--am-z-index-popup-base)` |
| `--am-dropdown-panel-bg` | 面板背景色 | `var(--am-color-bg-elevated)` |
| `--am-dropdown-panel-max-height` | 面板最大高度（相对菜单栏下方的可用空间） | `70%` |
| `--am-dropdown-panel-border-radius` | 面板底部圆角 | `var(--am-border-radius-lg)` |
| `--am-dropdown-option-height` | 选项最小高度 | `48px` |
| `--am-dropdown-option-active-color` | 已选选项颜色 | `var(--am-color-primary)` |

## 与 PC 端的差异 {#diff}

- **交互形态完全不同**：PC 端 `Dropdown` 是包裹触发元素的悬浮操作菜单（`menu`、`trigger`、`placement`……）；移动端 `Dropdown` 是一条筛选菜单栏，子项为 `DropdownItem`，面板从菜单栏下方滑出并带有遮罩。因此 PC 端的 `menu`、`trigger`、`placement`、`arrow`、`popupRender`、`Dropdown.Button` 等均不适用。
- 展开状态使用 `activeKey`（而不是 `open`），因为同一时间只展开其中一项。
- 移动端的操作菜单场景请使用 [ActionSheet](/components/action-sheet) 或 [Popover](/components/popover) 的 `actions`。
