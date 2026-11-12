---
title: Grid
subtitle: 栅格
description: 24 栅格系统，以及移动端的宫格入口。
group:
  title: 布局
  order: 2
---

## 何时使用 {#when-to-use}

- 需要按固定比例划分一行内的区域时，例如宫格入口、表单的并排字段、图片墙。
- 通过 `Row` 建立一行，内容放在 `Col` 内；一行的 `span` 总和超过 24 时自动换行。

- 需要等分的图标入口（首页金刚区、功能面板）时，使用 `Grid` / `GridItem`：自带图标、标题、徽标、分割线和按压反馈。

`Row` / `Col` 基于 Flex 实现，API 与 antdv-next 对齐；`Grid` / `GridItem` 是移动端新增的宫格组件，基于 CSS Grid 实现。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础栅格</demo>
<demo src="./demo/gutter.vue">区块间隔</demo>
<demo src="./demo/offset.vue">偏移与排序</demo>
<demo src="./demo/justify.vue">排版</demo>
<demo src="./demo/flex.vue">Flex 填充</demo>
<demo src="./demo/entry.vue" full>宫格入口</demo>
<demo src="./demo/entry-bordered.vue" full>宫格分割线与正方形</demo>
<demo src="./demo/entry-gap.vue">宫格间距与横向排列</demo>
<demo src="./demo/entry-custom.vue">跨列与自定义内容</demo>

## API

### Row 属性 {#row-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 栅格间隔，数字单位为 px，也可以是 CSS 长度；数组形式为 `[水平间距, 垂直间距]` | `number \| string \| [number \| string, number \| string]` | `0` |
| align | 垂直对齐方式 | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | `'top'` |
| justify | 水平排列方式 | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` |
| wrap | 是否自动换行 | `boolean` | `true` |
| rootClass | 根节点类名 | `string` | - |

### Col 属性 {#col-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 栅格占位格数，为 `0` 时相当于 `display: none` | `number \| string` | - |
| offset | 栅格左侧的间隔格数 | `number \| string` | `0` |
| order | 栅格顺序 | `number \| string` | `0` |
| push | 栅格向右移动格数 | `number \| string` | `0` |
| pull | 栅格向左移动格数 | `number \| string` | `0` |
| flex | Flex 布局属性：数字表示比例，`'100px'` 表示固定宽度，`'auto'` 表示填充剩余空间 | `number \| string` | - |
| rootClass | 根节点类名 | `string` | - |

### Grid 属性 {#grid-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 宫格数据，见 [GridItemType](#grid-item-type)；默认插槽中的 `GridItem` 渲染在其后 | `GridItemType[]` | `[]` |
| columns | 列数 | `number \| string` | `4` |
| gap | 格子之间的间距，数字单位为 px，也可以是 CSS 长度；数组形式为 `[水平间距, 垂直间距]` | `number \| string \| [number \| string, number \| string]` | `0` |
| bordered | 是否显示分割线；设置了 `gap` 时每个格子显示完整边框 | `boolean` | `false` |
| square | 是否将格子固定为正方形 | `boolean` | `false` |
| orientation | 图标与标题的排列方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| clickable | 是否开启按压反馈与按钮语义；关闭后仍会触发点击事件 | `boolean` | `true` |
| iconSize | 图标大小，数字单位为 px | `number \| string` | `28` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化类名：`root` / `item` / `icon` / `title` / `badge` | `GridSemanticClassNames` | - |
| styles | 语义化样式：`root` / `item` / `icon` / `title` / `badge` | `GridSemanticStyles` | - |

### GridItemType {#grid-item-type}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识，缺省时使用下标 | `string \| number` | - |
| icon | 图标 | `VueNode` | - |
| title | 标题 | `VueNode` | - |
| badge | 徽标，数字或文字；`true` 显示为红点 | `number \| string \| boolean` | - |
| span | 跨越的列数 | `number \| string` | `1` |
| disabled | 是否禁用 | `boolean` | `false` |
| class | 格子的类名 | `string` | - |
| style | 格子的样式 | `CSSProperties` | - |

### GridItem 属性 {#grid-item-props}

`Grid.Item`，属性 `icon` / `title` / `badge` / `span` / `disabled` 与 [GridItemType](#grid-item-type) 相同，另外支持：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化类名：`root` / `icon` / `title` / `badge` | `GridItemSemanticClassNames` | - |
| styles | 语义化样式：`root` / `icon` / `title` / `badge` | `GridItemSemanticStyles` | - |

### 事件 {#events}

| 组件 | 事件 | 说明 | 回调参数 |
| --- | --- | --- | --- |
| Grid | itemClick | 点击 `items` 中的格子时触发，禁用的格子不触发 | `(item: GridItemType, index: number, event: MouseEvent)` |
| GridItem | click | 点击格子时触发，禁用时不触发 | `(event: MouseEvent)` |

### 插槽 {#slots}

| 组件 | 插槽 | 说明 |
| --- | --- | --- |
| Row | default | 行内容，通常是若干 `Col` |
| Col | default | 列内容 |
| Grid | default | 若干 `GridItem` |
| Grid | icon | 自定义 `items` 的图标，参数 `{ item, index }` |
| Grid | title | 自定义 `items` 的标题，参数 `{ item, index }` |
| GridItem | default | 自定义整个格子的内容 |
| GridItem | icon | 图标，优先于 `icon` 属性 |
| GridItem | title | 标题，优先于 `title` 属性 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-row-gutter-x` | 水平间距，由 `gutter` 属性写入，`Col` 通过它计算左右内边距 | `0px` |
| `--am-grid-columns` | 宫格列数，由 `columns` 属性写入 | `4` |
| `--am-grid-background` | 格子背景色 | `var(--am-color-bg-container)` |
| `--am-grid-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-grid-font-size` | 标题字号 | `var(--am-font-size-sm)` |
| `--am-grid-icon-size` | 图标大小，由 `iconSize` 属性写入 | `28px` |
| `--am-grid-icon-color` | 图标颜色 | `currentcolor` |
| `--am-grid-item-padding` | 格子内边距 | `var(--am-padding) var(--am-padding-xs)` |
| `--am-grid-item-gap` | 图标与标题的间距 | `var(--am-padding-xs)` |
| `--am-grid-item-radius` | 格子圆角 | `0px` |
| `--am-grid-border-color` | 分割线颜色 | `var(--am-color-split)` |
| `--am-grid-badge-color` | 徽标背景色 | `var(--am-color-error)` |

## 与 PC 端的差异 {#diff}

- 不支持响应式断点：`Col` 没有 `xs` / `sm` / `md` / `lg` / `xl` / `xxl` 属性，`gutter` / `align` / `justify` 不支持断点对象。移动端视口宽度单一，需要适配平板时请使用 CSS 媒体查询。
- 不提供 `Grid.useBreakpoint`。
- `gutter` 额外支持字符串形式的 CSS 长度（如 `'1rem'`）。
- 垂直间距通过 `row-gap` 实现，不需要负外边距。
- 新增移动端专属的 `Grid` / `GridItem` 宫格组件，PC 端没有对应组件。
