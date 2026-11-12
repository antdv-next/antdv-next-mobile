---
title: ShareSheet
subtitle: 分享面板
description: 从底部弹出的分享面板，以图标加名称的形式展示各个分享渠道。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 需要把当前内容分享到多个渠道（好友、复制链接、生成海报、二维码等）时。
- 需要在底部提供一组以图标为主、可横向滚动的快捷操作时。

ShareSheet 是移动端特有的组件。组件库不内置任何社交平台的图标与品牌色，图标通过选项的 `icon`（节点）或 `image`（图片地址）传入。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/multiple.vue">多行选项</demo>
<demo src="./demo/title.vue">标题与描述</demo>
<demo src="./demo/custom.vue">自定义图标与图片</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示，支持 `v-model:open` | `boolean` | - |
| defaultOpen | 非受控时的初始显示状态 | `boolean` | `false` |
| options | 分享选项，一维数组为单行，二维数组为多行 | [ShareSheetOption](#sharesheetoption)[] \| [ShareSheetOption](#sharesheetoption)[][] | `[]` |
| title | 标题，同名插槽优先 | `VueNode` | - |
| description | 标题下方的描述信息，同名插槽优先 | `VueNode` | - |
| cancelText | 取消按钮文字，默认取自语言包；设为 `null` 时不显示取消按钮 | `VueNode` | `取消` |
| showCancel | 是否显示取消按钮 | `boolean` | `true` |
| closeOnSelect | 点击选项后是否关闭 | `boolean` | `true` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| keyboard | 是否支持按 ESC 关闭 | `boolean` | `true` |
| round | 顶部是否使用圆角 | `boolean` | `true` |
| safeArea | 是否预留底部安全区 | `boolean` | `true` |
| destroyOnHidden | 关闭后销毁内容 | `boolean` | `false` |
| forceRender | 首次打开前预渲染内容 | `boolean` | `false` |
| getContainer | 挂载节点，`false` 为挂载在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 层级 | `number` | 自动递增 |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<SemanticDOM, string>` | - |
| styles | 语义化结构样式 | `Record<SemanticDOM, CSSProperties>` | - |

`SemanticDOM`：`root`、`mask`、`body`（面板）、`header`、`title`、`description`、`row`、`option`、`icon`、`label`、`cancel`。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:open | 显示状态变化 | `(open: boolean) => void` |
| openChange | 显示状态变化 | `(open: boolean) => void` |
| select | 点击选项时触发，禁用的选项不会触发；`index` 为行内下标 | `(option: ShareSheetOption, index: number, rowIndex: number) => void` |
| cancel | 点击取消按钮时触发 | `(event: MouseEvent) => void` |
| close | 面板请求关闭时触发（点击选项、取消按钮、遮罩或按下 ESC） | `() => void` |
| afterOpenChange | 打开 / 关闭动画结束后触发 | `(open: boolean) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 标题与选项之间的自定义内容 | - |
| title | 标题，优先于 `title` 属性 | - |
| description | 描述信息，优先于 `description` 属性 | - |
| cancelText | 取消按钮内容，优先于 `cancelText` 属性 | - |
| icon | 自定义选项圆形图标区域的内容，未渲染内容时回退到选项的 `icon` / `image` | `{ option, index, rowIndex }` |
| label | 自定义选项名称 | `{ option, index, rowIndex }` |

### ShareSheetOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识，缺省时使用行内下标 | `string \| number` | - |
| label | 名称 | `VueNode` | - |
| icon | 图标节点，渲染在圆形图标区域内，优先于 `image` | `VueNode` | - |
| image | 图片地址，铺满圆形图标区域 | `string` | - |
| description | 名称下方的描述 | `VueNode` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| class | 选项类名 | `string` | - |
| style | 选项样式，可用于覆盖单个选项的 CSS 变量 | `CSSProperties` | - |

`icon` 始终是节点（如 `h(WechatOutlined)`），图片地址请使用 `image`，二者不会混用。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.ShareSheet` 或直接覆盖 CSS 变量（作用于 `rootClass` 所在的根节点）定制。图标相关的变量也可以通过选项的 `class` / `style` 为单个选项设置。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-share-sheet-header-color` | 头部描述文字颜色 | `var(--am-color-text-description)` |
| `--am-share-sheet-title-color` | 标题颜色 | `var(--am-color-text)` |
| `--am-share-sheet-option-width` | 选项宽度 | `76px` |
| `--am-share-sheet-option-gap` | 图标与名称的间距 | `var(--am-margin-xs)` |
| `--am-share-sheet-row-padding` | 每一行的内边距 | `var(--am-padding) var(--am-padding-xs)` |
| `--am-share-sheet-icon-size` | 圆形图标区域的尺寸 | `48px` |
| `--am-share-sheet-icon-font-size` | 图标字号 | `24px` |
| `--am-share-sheet-icon-color` | 图标颜色 | `var(--am-color-text)` |
| `--am-share-sheet-icon-bg` | 圆形图标区域的背景色 | `var(--am-color-fill-tertiary)` |
| `--am-share-sheet-label-color` | 名称颜色 | `var(--am-color-text-secondary)` |
| `--am-share-sheet-label-font-size` | 名称字号 | `var(--am-font-size-sm)` |
| `--am-share-sheet-description-color` | 选项描述颜色 | `var(--am-color-text-description)` |
| `--am-share-sheet-active-opacity` | 选项按压时的透明度 | `0.6` |
| `--am-share-sheet-cancel-height` | 取消按钮最小高度 | `48px` |
| `--am-share-sheet-cancel-color` | 取消按钮文字颜色 | `var(--am-color-text-secondary)` |
| `--am-share-sheet-cancel-active-bg` | 取消按钮按压背景色 | `var(--am-color-fill-tertiary)` |
| `--am-share-sheet-gap-size` | 取消按钮上方间隔的高度 | `8px` |
| `--am-share-sheet-gap-color` | 取消按钮上方间隔的颜色 | `var(--am-color-bg-layout)` |
| `--am-share-sheet-max-height` | 面板最大高度，超出后选项区域纵向滚动 | `80%` |

## 与 PC 端的差异 {#diff}

- Antdv Next（PC）没有对应组件，ShareSheet 为移动端独有。
- 属性命名沿用 PC 端约定：`open` / `v-model:open`、`defaultOpen`、`options`、`maskClosable`、`keyboard`、`destroyOnHidden`、`forceRender`、`getContainer`、`zIndex`、`rootClass`、`classes`、`styles`、`openChange`、`afterOpenChange`。
- 弹层基于 [Popup](/components/popup) 从底部弹出，头部、取消按钮与关闭行为和 [ActionSheet](/components/action-sheet) 保持一致，取消按钮文字复用 `ActionSheet.cancelText` 语言包。
- 不内置社交平台图标与品牌色，请使用 `@antdv-next/icons` 或自有图片。
