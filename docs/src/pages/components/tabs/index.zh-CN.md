---
title: Tabs
subtitle: 标签页
description: 选项卡切换组件，用于在同一层级的内容分组之间切换。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 内容需要分组展示，一次只显示其中一组，保持界面整洁。
- 标签数量较多时标签栏可横向滚动，激活项自动居中。
- 需要通过左右滑动内容区域来切换分组。

API 与 antdv-next 的 `Tabs` 对齐（`items`、`activeKey`、`type`、`size`、`centered`、`destroyOnHidden` 等），并补充了滑动切换、吸顶等移动端能力。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/scrollable.vue" full>滚动标签栏</demo>
<demo src="./demo/type.vue" full>标签类型</demo>
<demo src="./demo/size.vue" full>尺寸与居中</demo>
<demo src="./demo/icon.vue" full>图标、禁用与附加内容</demo>
<demo src="./demo/swipeable.vue" full>滑动切换</demo>
<demo src="./demo/sticky.vue" full>吸顶</demo>
<demo src="./demo/slot.vue" full>自定义渲染</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 标签页配置 | [TabsItem](#tabsitem)[] | `[]` |
| activeKey(v-model) | 当前激活标签页的 `key` | `string \| number` | - |
| defaultActiveKey | 默认激活标签页的 `key` | `string \| number` | 第一个未禁用项的 `key` |
| type | 标签类型，`capsule` 为移动端新增的胶囊样式 | `'line' \| 'card' \| 'capsule'` | `'line'` |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| centered | 标签居中展示 | `boolean` | `false` |
| stretch | 标签等分标签栏宽度 | `boolean` | 标签不超过 4 个且未设置 `centered` 时为 `true` |
| tabPlacement | 标签栏位置 | `'top' \| 'bottom'` | `'top'` |
| animated | 是否使用动画切换，`true` 表示指示条与内容都开启 | `boolean \| { inkBar?: boolean, tabPane?: boolean }` | `{ inkBar: true, tabPane: false }` |
| swipeable | 是否可以左右滑动内容区域切换标签 | `boolean` | `false` |
| sticky | 标签栏是否吸顶 | `boolean` | `false` |
| offsetTop | 吸顶时与滚动容器顶部的距离 | `number \| string` | `0` |
| destroyOnHidden | 被隐藏时是否销毁标签页内容 | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'item' \| 'indicator' \| 'body' \| 'content', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'item' \| 'indicator' \| 'body' \| 'content', CSSProperties>` | - |
| ~~tabPosition~~ | 请使用 `tabPlacement` | `'top' \| 'bottom'` | - |

### TabsItem

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | - |
| label | 标签标题 | `VueNode` | - |
| content | 标签页内容 | `VueNode` | - |
| children | `content` 的别名 | `VueNode` | - |
| icon | 标签图标 | `VueNode` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| forceRender | 未激活过时也渲染内容 | `boolean` | `false` |
| destroyOnHidden | 被隐藏时是否销毁内容，优先于 `Tabs` 的同名属性 | `boolean` | - |
| class | 标签类名 | `string` | - |
| style | 标签样式 | `CSSProperties` | - |

标签页内容默认懒渲染：首次激活时才渲染，之后保持挂载。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 切换标签页时触发 | `(activeKey: string \| number) => void` |
| tabClick | 点击标签时触发（包括禁用与已激活的标签） | `(key: string \| number, event: MouseEvent) => void` |
| update:activeKey | 切换标签页时触发，用于 `v-model:activeKey` | `(activeKey: string \| number) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| labelRender | 自定义标签标题，优先于 `item.label` | `{ item: TabsItem, index: number }` |
| contentRender | 自定义标签页内容，优先于 `item.content` | `{ item: TabsItem, index: number }` |
| default | 没有 `content` 的标签页的兜底内容 | `{ item: TabsItem, index: number }` |
| leftExtra | 标签栏左侧附加内容 | - |
| rightExtra | 标签栏右侧附加内容 | - |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Tabs` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-tabs-height` | 标签栏高度 | `44px` |
| `--am-tabs-background` | 标签栏背景色 | `var(--am-color-bg-container)` |
| `--am-tabs-color` | 标签文字颜色 | `var(--am-color-text)` |
| `--am-tabs-active-color` | 激活标签文字颜色 | `var(--am-color-primary)` |
| `--am-tabs-font-size` | 标签字号 | `var(--am-font-size-lg)` |
| `--am-tabs-tab-padding-inline` | 标签水平内边距 | `var(--am-padding-sm)` |
| `--am-tabs-ink-bar-width` | 指示条宽度 | `24px` |
| `--am-tabs-ink-bar-height` | 指示条高度 | `2px` |
| `--am-tabs-ink-bar-color` | 指示条颜色 | `var(--am-color-primary)` |
| `--am-tabs-ink-bar-radius` | 指示条圆角 | `2px` |
| `--am-tabs-card-background` | 卡片类型的标签栏背景色 | `var(--am-color-fill-tertiary)` |
| `--am-tabs-capsule-height` | 胶囊标签高度 | `30px` |
| `--am-tabs-capsule-background` | 胶囊标签背景色 | `var(--am-color-fill-tertiary)` |
| `--am-tabs-z-index` | 吸顶时的层级 | `99` |

## 与 PC 端的差异 {#diff}

- 新增 `type="capsule"`、`swipeable`、`sticky` / `offsetTop`、`stretch`；标签栏溢出时直接横向滚动并让激活项自动居中，不再使用「更多」下拉菜单（`more`、`moreIcon`、`popupClassName` 不支持）。
- 不支持 `type="editable-card"` 及相关的 `addIcon`、`removeIcon`、`hideAdd`、`edit` 事件。
- `tabPlacement` 只支持 `top` 和 `bottom`，移动端不提供左右布局。
- 不支持 `renderTabBar`、`indicator`、`tabBarGutter`、`tabBarStyle`、`tabScroll` 事件；指示条宽度通过 `--am-tabs-ink-bar-width` 调整。
- 不支持声明式的 `TabPane` 子组件，统一使用 `items`；`default` 插槽改为没有 `content` 的标签页的兜底内容。
- `key` 支持 `number`；`animated` 为 `true` 时内容区域也会滑动切换。
