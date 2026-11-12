---
title: Tree
subtitle: 树形控件
description: 多层次的结构列表，支持展开、选中、勾选与异步加载。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 文件夹、组织架构、分类目录、地区等具有层级关系的数据，需要完整展示层级并可展开、收起。
- 需要在层级结构中选中节点，或用复选框勾选一批节点（父子联动）。
- 只需要逐级选择一个值时，请使用 [Cascader](/components/cascader)。

API 与 antdv-next 的 `Tree` 对齐：`treeData`、`fieldNames`、`expandedKeys` / `selectedKeys` / `checkedKeys`（均支持 `v-model`）、`checkable`、`checkStrictly`、`loadData`、`showLine`、`titleRender`、`scrollTo` 等名称、类型和语义保持一致。移动端整行都是点击区域，行高不小于 40px，数据量大时通过虚拟滚动渲染。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/checkable.vue">可勾选</demo>
<demo src="./demo/controlled.vue">受控操作</demo>
<demo src="./demo/async.vue">异步加载数据</demo>
<demo src="./demo/line.vue">连接线与自定义图标</demo>
<demo src="./demo/search.vue">可搜索</demo>
<demo src="./demo/virtual.vue">大数据量 / 虚拟滚动</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| treeData | 节点数据，见 [TreeDataNode](#tree-data-node)。`key` 在整棵树内必须唯一 | `TreeDataNode[]` | - |
| fieldNames | 自定义节点的 `title`、`key`、`children` 字段名 | `{ title?: string, key?: string, children?: string }` | `{ title: 'title', key: 'key', children: 'children' }` |
| expandedKeys (v-model) | （受控）展开的节点 | `(string \| number)[]` | - |
| defaultExpandedKeys | 默认展开的节点 | `(string \| number)[]` | `[]` |
| defaultExpandAll | 默认展开所有节点（只在初始化时生效） | `boolean` | `false` |
| defaultExpandParent | 初始化时自动展开 `expandedKeys` / `defaultExpandedKeys` 的父节点 | `boolean` | `true` |
| autoExpandParent | 受控的 `expandedKeys` 变化时自动展开其父节点 | `boolean` | `false` |
| selectedKeys (v-model) | （受控）选中的节点，多选需要设置 `multiple` | `(string \| number)[]` | - |
| defaultSelectedKeys | 默认选中的节点 | `(string \| number)[]` | `[]` |
| checkedKeys (v-model) | （受控）勾选的节点。父子联动时传入父节点的 key 会勾选其全部子节点，反之亦然；`checkStrictly` 时可以传入 `{ checked, halfChecked }` | `(string \| number)[] \| { checked: (string \| number)[], halfChecked: (string \| number)[] }` | - |
| defaultCheckedKeys | 默认勾选的节点 | `(string \| number)[]` | `[]` |
| checkable | 节点前显示复选框 | `boolean` | `false` |
| checkStrictly | 父子节点的勾选状态不再联动 | `boolean` | `false` |
| selectable | 是否可选中 | `boolean` | `true` |
| multiple | 支持选中多个节点 | `boolean` | `false` |
| disabled | 禁用整棵树（仍可展开 / 收起） | `boolean` | `false` |
| blockNode | 节点内容占满整行，整行都是点击区域 | `boolean` | `true` |
| showIcon | 是否显示标题前的图标（`icon`） | `boolean` | `false` |
| showLine | 显示连接线。`showLeafIcon` 为 `true` 时叶子节点显示文件图标，也可以传入自定义图标 | `boolean \| { showLeafIcon: boolean \| VueNode \| ((props: TreeNodeAttribute) => VueNode) }` | `false` |
| icon | 标题前的图标，需要 `showIcon`；同名插槽优先，节点数据的 `icon` 最优先 | `VueNode \| ((props: TreeNodeAttribute) => VueNode)` | - |
| switcherIcon | 自定义展开 / 收起图标（收起时自动旋转）；同名插槽优先 | `VueNode \| ((props: TreeNodeAttribute) => VueNode)` | 箭头图标 |
| switcherLoadingIcon | 自定义节点加载中的图标；同名插槽优先 | `VueNode` | 加载指示器 |
| titleRender | 自定义标题；`titleRender` / `title` 插槽优先 | `(node: TreeDataNode) => VueNode` | - |
| loadData | 异步加载子节点：展开没有子节点的非叶子节点时调用，返回 Promise，完成后把子节点写入 `treeData` | `(node: TreeEventDataNode) => Promise<any> \| void` | - |
| loadedKeys | （受控）已加载的节点，配合 `loadData` 使用 | `(string \| number)[]` | `[]` |
| filterTreeNode | 返回 `true` 的节点会被高亮（PC 文档中的 `filterAntTreeNode`） | `(node: TreeEventDataNode) => boolean` | - |
| expandAction | 点击节点内容时是否同时展开 / 收起（PC 端 `DirectoryTree` 的属性，移动端只支持 `click`） | `false \| 'click'` | `false` |
| virtual | 虚拟滚动：通过 [VirtualList](/components/virtual-list) 只挂载可视区域附近的行，需要设置 `height`；`false` 时渲染全部行 | `boolean` | `true` |
| height | 滚动容器的高度。不设置时树随内容撑开、不产生内部滚动 | `number \| string` | - |
| itemHeight | 行的最小高度（px），也是未测量前的预估高度 | `number` | `44`（`--am-tree-item-height`） |
| listHeight | `height` 的别名，与 Select / Cascader 的命名一致；同时设置时 `height` 优先 | `number \| string` | - |
| listItemHeight | `itemHeight` 的别名，与 Select / Cascader 的命名一致；同时设置时 `itemHeight` 优先 | `number` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item' \| 'itemIcon' \| 'itemTitle' \| 'itemSwitcher', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item' \| 'itemIcon' \| 'itemTitle' \| 'itemSwitcher', CSSProperties>` | - |

### TreeDataNode {#tree-data-node}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 节点的唯一标识，配合 (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys 使用 | `string \| number` | 节点的位置（如 `0-0-1`） |
| title | 标题，函数形式会收到节点数据 | `VueNode \| ((node: TreeDataNode) => VueNode)` | `'---'` |
| children | 子节点 | `TreeDataNode[]` | - |
| disabled | 禁用节点（不可选中、不可勾选，仍可展开） | `boolean` | `false` |
| disableCheckbox | 禁用复选框 | `boolean` | `false` |
| selectable | 节点是否可选中，优先于 Tree 的 `selectable` | `boolean` | - |
| checkable | Tree 为 `checkable` 时，`false` 隐藏该节点的复选框 | `boolean` | - |
| isLeaf | 是否为叶子节点（配合 `loadData`）：`true` 不会加载，`false` 强制作为父节点 | `boolean` | - |
| icon | 该节点的图标，需要 `showIcon` | `VueNode \| ((props: TreeNodeAttribute) => VueNode)` | - |
| switcherIcon | 该节点的展开图标 | `VueNode \| ((props: TreeNodeAttribute) => VueNode)` | - |
| class | 行的类名（也支持 PC 端的 `className`） | `string` | - |
| style | 行的样式 | `CSSProperties` | - |

`TreeNodeAttribute`（`icon` / `switcherIcon` 的参数）：`{ eventKey, expanded, selected, checked, halfChecked, loaded, loading, isLeaf, disabled, disableCheckbox, checkable, selectable, pos, level, data }`。

`TreeEventDataNode`（事件中的 `node`）：节点数据加上 `{ key, expanded, selected, checked, halfChecked, loaded, loading, pos }`。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| expand | 展开 / 收起节点时触发 | `(expandedKeys, { expanded: boolean, node, nativeEvent }) => void` |
| select | 点击节点选中 / 取消选中时触发 | `(selectedKeys, { event: 'select', selected: boolean, selectedNodes, node, nativeEvent }) => void` |
| check | 点击复选框时触发。`checkStrictly` 时第一个参数为 `{ checked, halfChecked }` | `(checkedKeys, { event: 'check', checked: boolean, checkedNodes, node, halfCheckedKeys, checkedNodesPositions, nativeEvent }) => void` |
| load | 节点加载完成时触发 | `(loadedKeys, { event: 'load', node }) => void` |
| click | 点击节点内容时触发 | `(event: MouseEvent, node: TreeEventDataNode) => void` |
| scroll | 设置了 `height` 时，内部滚动触发 | `(event: Event) => void` |
| update:expandedKeys | 展开的节点变化 | `(keys: (string \| number)[]) => void` |
| update:selectedKeys | 选中的节点变化 | `(keys: (string \| number)[]) => void` |
| update:checkedKeys | 勾选的节点变化，始终是勾选 key 的数组（`checkStrictly` 时也是，与 PC 一致） | `(keys: (string \| number)[]) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| title | 自定义标题，参数为节点数据（`titleRender` 插槽的移动端别名，两者同时存在时 `title` 优先） | `TreeDataNode` |
| titleRender | 自定义标题，与 PC 端同名 | `TreeDataNode` |
| icon | 标题前的图标，需要 `showIcon` | `TreeNodeAttribute` |
| switcherIcon | 展开 / 收起图标 | `TreeNodeAttribute` |
| switcherLoadingIcon | 节点加载中的图标 | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| scrollTo | 滚动到指定节点或指定的滚动位置，需要设置 `height`。节点必须可见（父节点已展开）；`autoExpand` 在非受控模式下先展开目标节点 | `(target: number \| { key, align?: 'top' \| 'bottom' \| 'center' \| 'auto', offset?: number, autoExpand?: boolean }) => void` |
| nativeElement | 滚动容器（根节点） | `HTMLElement` |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-tree-item-height` | 行的最小高度，`itemHeight` 属性会写入它 | `44px` |
| `--am-tree-indent-size` | 每一级的缩进 | `24px` |
| `--am-tree-switcher-size` | 展开图标点击区域的宽度 | `40px` |
| `--am-tree-switcher-icon-size` | 展开图标大小 | `12px` |
| `--am-tree-switcher-color` | 展开图标颜色 | `var(--am-color-text-tertiary)` |
| `--am-tree-padding-inline` | 树的水平内边距 | `0px` |
| `--am-tree-font-size` | 字号 | `var(--am-font-size-lg)` |
| `--am-tree-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-tree-background` | 背景色 | `var(--am-color-bg-container)` |
| `--am-tree-icon-color` | 标题前图标的颜色 | `var(--am-color-text-secondary)` |
| `--am-tree-title-padding-inline` | 节点内容的水平内边距 | `var(--am-padding-xs)` |
| `--am-tree-node-radius` | 节点内容的圆角 | `var(--am-border-radius)` |
| `--am-tree-node-active-background` | 按下时的背景色 | `var(--am-color-fill-tertiary)` |
| `--am-tree-node-selected-background` | 选中节点的背景色 | `var(--am-color-primary-bg)` |
| `--am-tree-node-selected-color` | 选中节点的文字颜色 | `var(--am-color-text)` |
| `--am-tree-line-color` | 连接线颜色 | `var(--am-color-border)` |
| `--am-tree-highlight-color` | `filterTreeNode` 命中节点与加载指示器的颜色 | `var(--am-color-primary)` |
| `--am-tree-disabled-color` | 禁用节点的文字颜色 | `var(--am-color-text-disabled)` |
| `--am-tree-level` | 当前行的层级（从 0 开始），由组件写在每一行上，用于计算缩进 | - |

复选框的变量见 [Checkbox](/components/checkbox#design-token)。

## 与 PC 端的差异 {#diff}

- **不依赖 `@v-c/tree`**：用 SFC 重新实现，勾选联动算法（`conductCheck`）与 PC 保持一致；只支持 `treeData`，不支持以 `<TreeNode>` 子组件声明节点，也不提供 `Tree.TreeNode`、`Tree.useTree`。
- **不支持拖拽**：没有 `draggable`、`allowDrop`、`draggableIcon` 插槽以及 `dragStart` / `dragEnter` / `dragOver` / `dragLeave` / `dragEnd` / `drop` 事件。
- **去掉 PC 专属交互**：没有 `rightClick` / `contextmenu`、`doubleClick`、`mouseenter` / `mouseleave`、`focus` / `blur`、`keydown`、`activeChange` 事件和键盘导航（`activeKey`、`tabindex`），没有悬停态与标题的 `title` 提示，按压反馈使用 `:active`。
- **不提供 `DirectoryTree`**：可以用 `expandAction="click"`、`multiple`、`showIcon` + `icon` 插槽组合出目录树；`expandAction` 不支持 `doubleClick`。
- `blockNode` 默认为 `true`（PC 为 `false`）：节点内容占满整行，整行都是点击区域。行高不小于 44px，展开图标的点击区域为 40px 宽、整行高。
- 复选框直接复用 [Checkbox](/components/checkbox) 组件，点击区域为整行高。
- 展开 / 收起没有高度动画（PC 使用 collapse motion）：行通过虚拟列表渲染，展开后立即出现；只有箭头的旋转带过渡，也没有 `motion` 属性。
- 受控属性严格受控：`expandedKeys` / `selectedKeys` / `checkedKeys` 传入后，界面只跟随属性变化（PC 会先更新内部状态）。请使用 `v-model` 或在事件中回写。
- 高亮过滤的属性名为 `filterTreeNode`（PC 文档写作 `filterAntTreeNode`，实际生效的是 `@v-c/tree` 的 `filterTreeNode`）。
- 虚拟滚动沿用 PC 的 `virtual` / `height` / `itemHeight`，并额外支持与 Select / Cascader 一致的别名 `listHeight` / `listItemHeight`；`height` 也接受字符串（如 `'50vh'`）。行高按实际测量，`itemHeight` 是最小高度与预估值，标题可以换行。不支持横向滚动（`scrollWidth`）。
- `scrollTo` 的 `align` 额外支持 `center`；没有设置 `height` 时树没有内部滚动，`scrollTo` 不生效。
- 新增 `title` 插槽（`titleRender` 插槽的别名）；`icon` / `switcherIcon` 的参数为精简后的 `TreeNodeAttribute`，额外包含 `level` 与 `data`。
- 节点数据同时支持 `class`（推荐）与 PC 的 `className`。
- 不支持 `classes` / `styles` 的函数形式，也没有已废弃的 `rootStyle`；ConfigProvider 没有 `tree` 的组件级配置，仅跟随 `componentDisabled`。
- `treeData` 的类型 `TreeDataNode` 允许任意自定义字段；配合 `ref<TreeDataNode[]>` 重新赋值时如遇 TypeScript 提示类型实例化过深，请改用 `shallowRef`（大数据量时也更快）。
