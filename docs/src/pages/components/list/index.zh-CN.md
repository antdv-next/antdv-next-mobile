---
title: List
subtitle: 列表
description: 通用列表，以单元格的形式整齐地承载文字、图标、操作等内容。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 展示一组结构相同的信息条目：设置项、联系人、订单、菜单入口等。
- 作为表单项、开关、选择器等组件的承载容器。
- 条目需要点击跳转或触发操作时，自带按压反馈与右侧箭头。

`List` 是移动端最常用的布局容器之一，由 `List` 与 `List.Item`（`<am-list-item>`）组成，也支持 `dataSource` + `renderItem` 的数据模式。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/clickable.vue" full>可点击列表</demo>
<demo src="./demo/prefix.vue" full>图标、描述与额外内容</demo>
<demo src="./demo/card.vue" full>卡片模式</demo>
<demo src="./demo/control.vue" full>搭配其他组件</demo>
<demo src="./demo/data.vue" full>数据模式</demo>
<demo src="./demo/virtual.vue" full>大数据量 / 虚拟滚动</demo>
<demo src="./demo/size.vue" full>尺寸与对齐</demo>
<demo src="./demo/style-class.vue" full>自定义样式</demo>

## API

### List 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| header | 列表头部 | `VueNode` | - |
| footer | 列表底部 | `VueNode` | - |
| mode | 展示模式，`card` 为带圆角与左右边距的卡片 | `'default' \| 'card'` | `'default'` |
| bordered | 是否显示列表上下的细线（仅 `default` 模式） | `boolean` | `true` |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| dataSource | 列表数据源，配合 `renderItem` 使用 | `any[]` | - |
| renderItem | 渲染数据源中的每一项 | `(item: any, index: number) => VueNode` | - |
| rowKey | 数据项的 `key`：字段名或函数 | `string \| ((item: any, index: number) => string \| number)` | 下标 |
| loading | 是否加载中，在列表底部显示加载指示 | `boolean` | `false` |
| virtual | 数据模式下开启虚拟滚动：列表项通过 [VirtualList](/components/virtual-list) 渲染，只挂载可视区域附近的项。开启后列表自身滚动，需要设置 `height` | `boolean` | `false` |
| height | 虚拟滚动时滚动区域的高度 | `number \| string` | - |
| itemHeight | 虚拟滚动时列表项的预估高度（px），实际高度会在渲染后测量 | `number` | 列表项最小高度（`40` / `48` / `56`） |
| locale | 文案，`emptyText` 为数据为空时的提示 | `{ emptyText?: VueNode }` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'body' \| 'footer', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'body' \| 'footer', CSSProperties>` | - |

### List 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| reachEnd | 虚拟滚动时滚动到列表底部附近触发，用于加载更多（无限加载）；数据长度变化后可再次触发 | `() => void` |

### List 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| scrollTo | 虚拟滚动时滚动到指定位置（px），或滚动到指定下标 / `rowKey` 的项 | `(target: number \| { index?: number, key?: string \| number, align?: 'start' \| 'center' \| 'end' \| 'auto', offset?: number, behavior?: ScrollBehavior }) => void` |

### List 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 列表内容，通常是若干 `<am-list-item>` | - |
| header | 列表头部，优先于 `header` 属性 | - |
| footer | 列表底部，优先于 `footer` 属性 | - |
| renderItem | 渲染数据源中的每一项，优先于 `renderItem` 属性 | `{ item: any, index: number }` |
| emptyText | 数据为空时的内容，优先于 `locale.emptyText` | - |

### List.Item 属性 {#item-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 主要内容，同默认插槽 | `VueNode` | - |
| description | 主要内容下方的描述 | `VueNode` | - |
| prefix | 左侧区域，通常是图标或头像 | `VueNode` | - |
| extra | 右侧区域，通常是值或状态文字 | `VueNode` | - |
| arrow | 右侧箭头，可传入自定义节点 | `boolean \| VueNode` | 可点击时为 `true` |
| clickable | 是否有按压反馈 | `boolean` | 监听了 `click` 事件或设置了 `href` 时为 `true` |
| disabled | 是否禁用 | `boolean` | `false` |
| href | 设置后渲染为 `<a>` | `string` | - |
| target | 同 `<a>` 的 `target`，`href` 存在时生效 | `string` | - |
| align | 左右区域相对内容的垂直对齐方式 | `'center' \| 'start'` | `'center'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'prefix' \| 'content' \| 'title' \| 'description' \| 'extra' \| 'arrow', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'prefix' \| 'content' \| 'title' \| 'description' \| 'extra' \| 'arrow', CSSProperties>` | - |

### List.Item 事件 {#item-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击列表项时触发，禁用时不会触发 | `(event: MouseEvent) => void` |

### List.Item 插槽 {#item-slots}

| 插槽 | 说明 |
| --- | --- |
| default | 主要内容，优先于 `title` 插槽与属性 |
| title | 主要内容 |
| description | 描述 |
| prefix | 左侧区域 |
| extra | 右侧区域 |
| arrow | 自定义右侧箭头 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.List` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-list-background` | 列表背景色 | `var(--am-color-bg-container)` |
| `--am-list-font-size` | 列表项字号 | `var(--am-font-size-lg)` |
| `--am-list-border-color` | 细线颜色 | `var(--am-color-split)` |
| `--am-list-header-color` | 头部 / 底部文字颜色 | `var(--am-color-text-tertiary)` |
| `--am-list-header-font-size` | 头部 / 底部字号 | `var(--am-font-size)` |
| `--am-list-header-padding` | 头部内边距 | `var(--am-padding-sm) var(--am-padding) var(--am-padding-xs)` |
| `--am-list-card-margin-inline` | 卡片模式的左右外边距 | `var(--am-margin-sm)` |
| `--am-list-card-border-radius` | 卡片模式的圆角 | `var(--am-border-radius-lg)` |
| `--am-list-item-padding-inline` | 列表项水平内边距 | `var(--am-padding)` |
| `--am-list-item-padding-block` | 列表项垂直内边距 | `var(--am-padding-sm)` |
| `--am-list-item-min-height` | 列表项最小高度 | `48px` |
| `--am-list-item-prefix-gap` | 左侧区域与内容的间距 | `var(--am-padding-sm)` |
| `--am-list-item-description-color` | 描述颜色 | `var(--am-color-text-tertiary)` |
| `--am-list-item-description-font-size` | 描述字号 | `var(--am-font-size)` |
| `--am-list-item-extra-color` | 右侧区域颜色 | `var(--am-color-text-tertiary)` |
| `--am-list-item-arrow-color` | 箭头颜色 | `var(--am-color-text-quaternary)` |

## 与 PC 端的差异 {#diff}

PC 端的 `List` 已不再推荐使用，移动端的 `List` 是面向触屏重新设计的单元格列表：

- `List.Item` 由 `prefix`、`title`（默认插槽）、`description`、`extra`、`arrow` 组成，支持 `clickable`、`href`、`disabled`；没有 `List.Item.Meta`、`actions`。
- 新增 `mode="card"`；`bordered` 表现为列表上下的 0.5px 细线，列表项之间的分隔线始终显示并与标题左对齐（没有 `split`）。
- 保留数据模式的 `dataSource`、`renderItem`、`rowKey`、`loading`、`locale.emptyText`、`header`、`footer`、`size`。
- 不支持 `grid`、`pagination`、`loadMore`、`itemLayout`；分页与加载更多请搭配 `Pagination`、`InfiniteScroll` 使用。
- 数据模式新增 `virtual`、`height`、`itemHeight`、`reachEnd` 事件与 `scrollTo` 方法：上万条数据时只渲染可视区域附近的列表项，默认关闭（列表通常随页面滚动）。
