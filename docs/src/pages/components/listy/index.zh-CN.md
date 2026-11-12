---
title: Listy
subtitle: 虚拟列表
description: 高性能数据列表，支持分组、吸顶标题、虚拟滚动与命令式滚动控制。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 需要渲染长列表，又不想为每一行都付出挂载成本时：默认只渲染可视区域附近的行。
- 列表需要按数据分组，并让分组标题吸顶时，例如通讯录、按日期归档的消息、分类商品。
- 需要以命令式方式控制滚动位置（跳到某一项、某个分组或某个像素位置）时。

### 与 List、VirtualList 的关系 {#vs-list}

| | [List](/components/list) | Listy | [VirtualList](/components/virtual-list) |
| --- | --- | --- | --- |
| 定位 | 设置页、菜单、表单式的「单元格」列表 | 由数据驱动的长列表 | 底层的窗口化滚动容器 |
| 行的结构 | `ListItem`：标题 / 描述 / 前缀 / 附加内容 / 箭头 | 完全自定义（`itemRender`），只提供内边距与分割线 | 完全自定义，没有任何行样式 |
| 滚动 | 默认随页面滚动，数据模式可选虚拟滚动 | 自身滚动（`height`），虚拟滚动默认开启 | 自身滚动 |
| 分组 / 吸顶标题 | 无（`header` 只是静态标题） | 内置 | 无 |
| 滚动到某一项 / 分组 | 数据模式下按下标或 `key` | 按 `key`、`groupKey` 或像素，考虑吸顶标题的遮挡 | 按下标或 `key` |

简单来说：行是标准「单元格」、数量不多时用 `List`；行内容自定义、数量很大或需要分组吸顶时用 `Listy`；需要自己实现列表类组件时用 `VirtualList`。按字母索引跳转的通讯录请使用 [IndexBar](/components/index-bar)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/virtual.vue" full>虚拟滚动</demo>
<demo src="./demo/group.vue" full>分组与吸顶</demo>
<demo src="./demo/scroll-to.vue" full>滚动控制</demo>
<demo src="./demo/rich.vue" full>复杂内容</demo>
<demo src="./demo/infinite.vue" full>无限加载</demo>
<demo src="./demo/horizontal.vue" full>横向滚动</demo>
<demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 列表数据源 | `any[]` | `[]` |
| rowKey | 每一项的唯一键：字段名或取值函数 | `string \| (item, index: number) => Key` | - |
| itemRender | 渲染单行，同名插槽优先 | `(item, index: number) => VNodeChild` | - |
| group | 分组配置，见 [Group](#group) | `ListyGroup` | - |
| sticky | 分组标题是否吸顶 | `boolean` | `false` |
| height | 滚动容器的最大高度，内容超出后滚动；数字单位为 px，也可以是 CSS 长度（如 `'60vh'`） | `number \| string` | - |
| virtual | 是否开启虚拟滚动，只渲染可视区域附近的行；`false` 时渲染全部行，DOM 结构与行为不变 | `boolean` | `true` |
| scrollWidth | 内容的横向滚动宽度（px），超出容器宽度时可横向滚动 | `number` | - |
| rowHoverable | 列表行是否有按压反馈（支持悬浮的设备上同时有悬浮反馈） | `boolean` | `true` |
| itemHeight | 行高的预估值（px），用于行被测量之前的占位与滚动条计算 | `number` | `46` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化类名，见[语义化 DOM](#semantic-dom) | `ListyClassNames` | - |
| styles | 语义化样式，见[语义化 DOM](#semantic-dom) | `ListyStyles` | - |

### 事件 {#events}

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| scroll | 滚动容器的原生滚动事件 | `(event: Event)` |
| reachEnd | 滚动到距底部 40px 以内时触发一次（离开后再次进入会重新触发，数据长度变化后重置），用于加载更多 | - |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| itemRender | 渲染单行，优先于 `itemRender` 属性。插槽参数就是数据项本身：`#itemRender="item"` | `item` |
| groupTitle | 渲染分组标题，优先于 `group.title` | `{ groupKey: Key, items: any[] }` |

### Group

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| key | 计算每条数据所属的分组键，返回值相同的数据归为一组（分组按首次出现的顺序排列）；也可以是一个固定的键 | `(item) => Key \| Key` |
| title | 渲染分组标题，入参为分组键与该组数据；缺省时显示分组键 | `(groupKey: Key, items: any[]) => VNodeChild` |

`group` 请传入稳定的对象（在 `<script setup>` 中定义），不要在模板里内联：对象变化会让整个列表重新分组。

### 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| scrollTo | 滚动到某个位置、某一项或某个分组 | `(config?: ListyScrollToConfig) => void` |

`ListyScrollToConfig` 为以下之一：

| 形态 | 说明 |
| --- | --- |
| `number` | 滚动到某个像素位置（`scrollTop`） |
| `{ top?, left? }` | 滚动到绝对像素坐标 |
| `{ key, align?, offset? }` | 滚动到 `rowKey` 等于 `key` 的数据项 |
| `{ groupKey, align?, offset? }` | 滚动到某个分组标题 |

`align` 可选 `'top' \| 'bottom' \| 'auto'`，默认 `'auto'`（已在可视区域内则不滚动，否则对齐到最近的一侧）；`offset` 为对齐后额外保留的像素距离。开启 `sticky` 时，对齐到顶部的数据项会停在吸顶标题的下方。

## 语义化 DOM {#semantic-dom}

| 名称 | 说明 |
| --- | --- |
| root | 根元素，即滚动容器，设置字体与最大高度 |
| item | 条目元素，设置内间距、分割线与按压背景 |
| groupHeader | 分组标题元素（行内的标题与吸顶的标题都会应用），设置内间距、文字颜色与背景色 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Listy`（如 `{ itemPaddingBlock: 8 }`）或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-listy-item-padding-block` | 列表项纵向内间距 | `var(--am-padding-sm)` |
| `--am-listy-item-padding-inline` | 列表项与分组标题的横向内间距 | `var(--am-padding)` |
| `--am-listy-item-border-color` | 列表项分割线颜色 | `var(--am-color-split)` |
| `--am-listy-item-active-bg` | 列表项按压时的背景色 | `var(--am-color-fill-tertiary)` |
| `--am-listy-group-header-padding-block` | 分组标题纵向内间距 | `var(--am-padding-xs)` |
| `--am-listy-group-header-color` | 分组标题文字颜色 | `var(--am-color-text-description)` |
| `--am-listy-group-header-font-weight` | 分组标题字重 | `var(--am-font-weight-strong)` |
| `--am-listy-group-header-bg` | 分组标题的不透明底色 | `var(--am-color-bg-container)` |
| `--am-listy-group-header-fill` | 叠加在底色上的填充色 | `var(--am-color-fill-alter)` |
| `--am-listy-group-header-z-index` | 吸顶标题的层级 | `1` |

修改内间距或字号后，请同步调整 `itemHeight`（默认 `46` = 行高 `22` + 纵向内间距 `12 × 2`），使预估值接近实际行高。

## 与 PC 端的差异 {#diff}

- **基于本库的 [VirtualList](/components/virtual-list) 实现**，不依赖 `@v-c/listy`。使用原生滚动（惯性、回弹），没有自绘滚动条，因此没有 `--vc-virtual-list-scrollbar-bg` 与 `*-scrollbar` 样式。
- `virtual` 默认为 `true`（PC 为 `false`），也不读取 `ConfigProvider` 的 `virtual`。`virtual: false` 时 DOM 结构与虚拟模式完全相同（PC 的非虚拟模式是另一套结构，含 `*-group-section`，且 `scrollWidth` 不生效）；吸顶、`scrollTo`、`scrollWidth` 在两种模式下表现一致。
- 根元素就是滚动容器（PC 虚拟模式下滚动容器是内部的 `*-holder`），`scroll` 事件的 `currentTarget` 始终是根元素。
- 吸顶标题位于滚动容器内部的零高度 `sticky` 层中，在标题上滑动同样可以滚动列表；位置根据实际渲染的 DOM 计算。横向滚动时它随内容自然滚动（PC 通过 `translateX` 同步）。
- `rowHoverable` 在移动端表现为按压（`:active`）反馈，仅在支持悬浮的设备上保留 hover 效果。
- `height` 额外支持字符串形式的 CSS 长度。
- 新增 `itemHeight`（预估行高）：PC 根据主题 token 计算，本库的主题是纯 CSS 变量，无法在脚本中读取。
- 新增 `reachEnd` 事件用于加载更多（PC 需要在 `scroll` 中自行计算）。
- 新增 `groupTitle` 插槽，`group.title` 变为可选（缺省显示分组键）。
- `scrollTo` 的 `align: 'auto'` 在开启 `sticky` 时会考虑吸顶标题的遮挡：被标题挡住的行会被滚动到标题下方（PC 仅在目标位于视口上方时处理）。`scrollTo(null)` / `scrollTo()` 不做任何事。
- `classes` / `styles` 只支持对象形式，不支持函数形式；不支持通过 `ConfigProvider` 的 `listy` 统一配置；去掉了 `prefixCls`。
- 类型 `ScrollAlign` 更名为 `ListyScrollAlign`（本库导出的类型统一带组件前缀），新增 `ListyGroup`、`ListyRowKey`。
- 不提供「拖拽排序」示例（PC 借助第三方库 `@dnd-kit/vue` 实现）。
