---
title: Collapse
subtitle: 折叠面板
description: 可以折叠 / 展开的内容区域。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 对复杂区域进行分组和隐藏，保持页面的整洁。
- 「手风琴」是一种特殊的折叠面板，同一时间只允许展开一个面板，常用于常见问题（FAQ）。

API 与 antdv-next 的 `Collapse` 对齐（`items`、`activeKey`、`accordion`、`collapsible`、`expandIcon` 等），展开 / 收起带有平滑的高度动画。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/accordion.vue" full>手风琴</demo>
<demo src="./demo/panel.vue" full>声明式面板</demo>
<demo src="./demo/extra.vue" full>附加内容与隐藏箭头</demo>
<demo src="./demo/collapsible.vue" full>可折叠触发区域</demo>
<demo src="./demo/expand-icon.vue" full>自定义展开图标</demo>
<demo src="./demo/ghost.vue">幽灵模式与尺寸</demo>

## API

### Collapse 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 面板配置 | [CollapseItemType](#collapseitemtype)[] | - |
| activeKey(v-model) | 当前展开面板的 `key` | `string \| number \| (string \| number)[]` | - |
| defaultActiveKey | 初始展开面板的 `key` | `string \| number \| (string \| number)[]` | - |
| accordion | 手风琴模式，同一时间只展开一个面板 | `boolean` | `false` |
| bordered | 是否显示外侧与面板之间的细线 | `boolean` | `true` |
| ghost | 幽灵模式，背景透明且无细线 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| collapsible | 所有面板的可折叠触发区域 | `'header' \| 'icon' \| 'disabled'` | - |
| expandIcon | 自定义展开图标 | `(panelProps: CollapsePanelInfo) => VueNode` | - |
| expandIconPlacement | 展开图标的位置 | `'start' \| 'end'` | `'end'` |
| destroyOnHidden | 收起时是否销毁面板内容 | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'title' \| 'body' \| 'icon', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'title' \| 'body' \| 'icon', CSSProperties>` | - |
| ~~expandIconPosition~~ | 请使用 `expandIconPlacement` | `'start' \| 'end'` | - |

面板内容默认懒渲染：首次展开时才渲染，之后保持挂载。

### CollapseItemType

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识，未设置时使用下标 | `string \| number` | - |
| label | 面板标题 | `VueNode` | - |
| content | 面板内容 | `VueNode` | - |
| children | `content` 的别名 | `VueNode` | - |
| extra | 标题右侧的附加内容 | `VueNode` | - |
| showArrow | 是否显示展开图标 | `boolean` | `true` |
| collapsible | 该面板的可折叠触发区域，优先于 `Collapse` 的同名属性 | `'header' \| 'icon' \| 'disabled'` | - |
| forceRender | 未展开过时也渲染内容 | `boolean` | `false` |
| class | 面板类名 | `string` | - |
| style | 面板样式 | `CSSProperties` | - |
| classes | 面板的语义化结构类名 | `Record<'header' \| 'title' \| 'body' \| 'icon', string>` | - |
| styles | 面板的语义化结构样式 | `Record<'header' \| 'title' \| 'body' \| 'icon', CSSProperties>` | - |

### Collapse 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 展开的面板变化时触发，参数始终为数组 | `(key: (string \| number)[]) => void` |
| update:activeKey | 展开的面板变化时触发，用于 `v-model:activeKey` | `(key: (string \| number)[]) => void` |

### Collapse 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 声明式的 `<am-collapse-panel>`，渲染在 `items` 之后 | - |
| expandIcon | 自定义展开图标，优先于 `expandIcon` 属性 | `{ panelKey, isActive, header, extra, showArrow, forceRender, collapsible }` |
| labelRender | 自定义 `items` 的标题 | `{ item: CollapseItemType, index: number }` |
| contentRender | 自定义 `items` 的内容 | `{ item: CollapseItemType, index: number }` |

### CollapsePanel

`<am-collapse-panel>`（`Collapse.Panel`）通过 `key` 标识面板。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识，对应 `activeKey` | `string \| number` | - |
| header | 面板标题 | `VueNode` | - |
| extra | 标题右侧的附加内容 | `VueNode` | - |
| showArrow | 是否显示展开图标 | `boolean` | `true` |
| collapsible | 可折叠触发区域 | `'header' \| 'icon' \| 'disabled'` | - |
| forceRender | 未展开过时也渲染内容 | `boolean` | `false` |
| classes | 语义化结构类名 | `Record<'header' \| 'title' \| 'body' \| 'icon', string>` | - |
| styles | 语义化结构样式 | `Record<'header' \| 'title' \| 'body' \| 'icon', CSSProperties>` | - |

| 插槽 | 说明 |
| --- | --- |
| default | 面板内容 |
| header | 面板标题，优先于 `header` 属性 |
| extra | 附加内容，优先于 `extra` 属性 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Collapse` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-collapse-header-padding` | 标题内边距 | `var(--am-padding-sm) var(--am-padding)` |
| `--am-collapse-header-min-height` | 标题最小高度 | `48px` |
| `--am-collapse-header-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-collapse-header-color` | 标题颜色 | `var(--am-color-text)` |
| `--am-collapse-header-background` | 标题背景色 | `var(--am-color-bg-container)` |
| `--am-collapse-content-padding` | 内容内边距 | `var(--am-padding-sm) var(--am-padding)` |
| `--am-collapse-content-font-size` | 内容字号 | `var(--am-font-size)` |
| `--am-collapse-content-color` | 内容颜色 | `var(--am-color-text-secondary)` |
| `--am-collapse-content-background` | 内容背景色 | `var(--am-color-bg-container)` |
| `--am-collapse-icon-size` | 展开图标尺寸 | `14px` |
| `--am-collapse-icon-color` | 展开图标颜色 | `var(--am-color-text-tertiary)` |
| `--am-collapse-border-color` | 细线颜色 | `var(--am-color-split)` |

## 与 PC 端的差异 {#diff}

- 外观为通栏列表样式：`bordered` 表现为 0.5px 细线而不是带圆角的边框，标题与内容默认同为容器背景色。
- `expandIconPlacement` 默认为 `end`（箭头在右侧），符合移动端习惯；PC 端默认为 `start`。
- `change` / `update:activeKey` 返回的 `key` 保留原始类型（`string | number`），不会统一转成字符串。
- `CollapsePanel` 单独使用（不在 `Collapse` 内）时会自行维护展开状态。
- 新增 `items[].children` 作为 `content` 的别名。
