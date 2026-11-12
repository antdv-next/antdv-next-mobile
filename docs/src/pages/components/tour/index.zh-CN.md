---
title: Tour
subtitle: 漫游式引导
description: 用于分步引导用户了解产品功能的气泡组件。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 常用于引导用户了解产品功能：新功能上线、首次进入页面时，逐步高亮页面上的元素并给出说明。
- 需要在不打断操作的前提下给出提示时，使用非模态（`mask` 为 `false`）的引导。

API 与 Antdv Next 的 `Tour` 对齐，并针对手机做了适配：卡片宽度随屏幕自适应，位置自动翻转并始终留在屏幕内，按钮与关闭图标保证 40px 以上的触控区域，显示遮罩时锁定页面滚动。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/non-modal.vue">非模态与自定义遮罩</demo>
<demo src="./demo/placement.vue">位置</demo>
<demo src="./demo/primary.vue">主色类型与高亮区域</demo>
<demo src="./demo/custom.vue">自定义指示器与操作按钮</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否打开引导，支持 `v-model:open` | `boolean` | - |
| defaultOpen | 默认是否打开 | `boolean` | `false` |
| current | 当前处于哪一步，支持 `v-model:current`；超出 `steps` 范围时不显示 | `number` | - |
| defaultCurrent | 默认处于哪一步 | `number` | `0` |
| steps | 引导步骤配置 | [TourStepItem](#tourstepitem)[] | `[]` |
| type | 类型，影响底色与文字颜色 | `'default' \| 'primary'` | `'default'` |
| mask | 是否启用蒙层，也可传入配置改变蒙层样式和填充色 | `boolean \| { style?: CSSProperties; color?: string }` | `true` |
| arrow | 是否显示箭头 | `boolean \| { pointAtCenter: boolean }` | `true` |
| placement | 引导卡片相对于目标元素的位置 | `'center' \| 'top' \| 'topLeft' \| 'topRight' \| 'bottom' \| 'bottomLeft' \| 'bottomRight' \| 'left' \| 'leftTop' \| 'leftBottom' \| 'right' \| 'rightTop' \| 'rightBottom'` | `'bottom'` |
| gap | 控制高亮区域的圆角边框和显示间距 | `{ offset?: number \| [number, number]; radius?: number }` | `{ offset: 6, radius: 2 }` |
| disabledInteraction | 禁用高亮区域交互（目标元素不可点击） | `boolean` | `false` |
| scrollIntoViewOptions | 是否把当前目标滚动到视窗内，也可传入 `scrollIntoView` 的参数 | `boolean \| ScrollIntoViewOptions` | `true`（`{ block: 'center', inline: 'center' }`） |
| indicatorsRender | 自定义指示器，同名插槽优先 | `(current: number, total: number) => VNodeChild` | - |
| actionsRender | 自定义操作按钮，`originNode` 为默认的上一步 / 下一步按钮，同名插槽优先 | `(originNode: VNode, info: { current: number, total: number }) => VNodeChild` | - |
| closable | 是否显示关闭按钮，也可传入 `{ closeIcon }` | `boolean \| { closeIcon?: VueNode }` | `true` |
| closeIcon | 自定义关闭图标，`false` 时隐藏关闭按钮，同名插槽优先 | `VueNode` | - |
| keyboard | 是否启用键盘行为（外接键盘：ESC 关闭，左右方向键切换步骤） | `boolean` | `true` |
| lockScroll | 显示蒙层时是否锁定页面滚动 | `boolean` | `true` |
| zIndex | Tour 的层级 | `number` | 自动递增 |
| getPopupContainer | 设置 Tour 浮层的渲染节点，默认是 body；`false` 时原地渲染 | `((node: HTMLElement) => HTMLElement) \| false` | `() => document.body` |
| rootClass | 浮层根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'mask' \| 'section' \| 'close' \| 'cover' \| 'header' \| 'title' \| 'description' \| 'footer' \| 'indicators' \| 'indicator' \| 'actions', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'mask' \| 'section' \| 'close' \| 'cover' \| 'header' \| 'title' \| 'description' \| 'footer' \| 'indicators' \| 'indicator' \| 'actions', CSSProperties>` | - |

`class`、`style` 等透传属性作用于浮层根节点 `.am-tour`。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:open | 显示状态变化 | `(open: boolean) => void` |
| update:current | 当前步骤变化 | `(current: number) => void` |
| change | 步骤改变时的回调，`current` 为当前的步骤 | `(current: number) => void` |
| close | 关闭引导时的回调（关闭按钮、ESC、完成） | `(current: number) => void` |
| finish | 引导完成时的回调 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| indicatorsRender | 自定义指示器 | `{ current: number, total: number }` |
| actionsRender | 自定义操作按钮，用 `<component :is="originNode" />` 渲染默认按钮 | `{ originNode: VNode, current: number, total: number }` |
| nextButton | 自定义下一步按钮的内容 | `{ current: number, isFirst: boolean, isLast: boolean }` |
| prevButton | 自定义上一步按钮的内容 | `{ current: number, isFirst: boolean, isLast: boolean }` |
| coverRender | 自定义步骤封面 | `{ step: TourStepItem, index: number }` |
| titleRender | 自定义步骤标题 | `{ step: TourStepItem, index: number }` |
| descriptionRender | 自定义步骤描述 | `{ step: TourStepItem, index: number }` |
| closeIcon | 自定义关闭图标 | `{ step: TourStepItem, index: number }` |

`coverRender` / `titleRender` / `descriptionRender` 对所有步骤生效；某一步插槽没有渲染内容时，回退到该步骤的 `cover` / `title` / `description`。

### 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| updatePosition | 重新测量目标并定位卡片（页面布局变化后调用；滚动、窗口尺寸和目标尺寸变化时会自动更新） | `() => void` |

### TourStepItem

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | 引导卡片指向的元素：元素、组件实例、它们的 `ref`，或返回它们的函数；为空时居中于屏幕 | `HTMLElement \| Ref<HTMLElement> \| (() => HTMLElement) \| null` | - |
| title | 标题 | `VueNode` | - |
| description | 主要描述部分 | `VueNode` | - |
| cover | 展示的图片或者视频 | `VueNode` | - |
| placement | 引导卡片相对于目标元素的位置 | 同 Tour 的 `placement` | `'bottom'` |
| arrow | 是否显示箭头 | `boolean \| { pointAtCenter: boolean }` | `true` |
| mask | 是否启用蒙层，默认跟随 Tour 的 `mask` 属性 | `boolean \| { style?: CSSProperties; color?: string }` | `true` |
| type | 类型，影响底色与文字颜色 | `'default' \| 'primary'` | `'default'` |
| nextButtonProps | 下一步按钮的属性 | `{ children?: VueNode; onClick?: (e: MouseEvent) => void; class?: string; style?: CSSProperties }` | - |
| prevButtonProps | 上一步按钮的属性 | `{ children?: VueNode; onClick?: (e: MouseEvent) => void; class?: string; style?: CSSProperties }` | - |
| scrollIntoViewOptions | 是否把目标滚动到视窗内，默认跟随 Tour 的 `scrollIntoViewOptions` 属性 | `boolean \| ScrollIntoViewOptions` | `true` |
| closable | 是否显示关闭按钮，默认跟随 Tour | `boolean \| { closeIcon?: VueNode }` | - |
| closeIcon | 自定义关闭图标，`false` 时隐藏 | `VueNode` | - |
| class | 该步骤卡片的类名 | `string` | - |
| style | 该步骤卡片的样式 | `CSSProperties` | - |
| classes | 该步骤的语义化结构类名，优先于 Tour 的 `classes` | 同 Tour 的 `classes` | - |
| styles | 该步骤的语义化结构样式，优先于 Tour 的 `styles` | 同 Tour 的 `styles` | - |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Tour` 或直接覆盖 CSS 变量（作用于 `rootClass` 所在的浮层根节点）定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-tour-z-index` | 层级（未自动分配时） | `calc(var(--am-z-index-popup-base) + 1)` |
| `--am-tour-width` | 卡片宽度 | `min(300px, calc(100vw - 32px))` |
| `--am-tour-bg` | 卡片背景色 | `var(--am-color-bg-elevated)` |
| `--am-tour-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-tour-title-color` | 标题颜色 | `var(--am-color-text-heading)` |
| `--am-tour-font-size` | 字号 | `var(--am-font-size)` |
| `--am-tour-title-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-tour-padding` | 卡片内边距 | `var(--am-padding)` |
| `--am-tour-border-radius` | 卡片圆角 | `var(--am-border-radius-lg)` |
| `--am-tour-shadow` | 卡片阴影 | `var(--am-box-shadow)` |
| `--am-tour-mask-color` | 蒙层填充色 | `var(--am-color-bg-mask)` |
| `--am-tour-arrow-size` | 箭头尺寸 | `10px` |
| `--am-tour-indicator-size` | 指示器圆点尺寸 | `6px` |
| `--am-tour-indicator-color` | 指示器颜色 | `var(--am-color-fill)` |
| `--am-tour-indicator-active-color` | 当前步骤指示器颜色 | `var(--am-color-primary)` |
| `--am-tour-close-size` | 关闭按钮尺寸（触控区域始终不小于 40px） | `24px` |
| `--am-tour-close-color` | 关闭图标颜色 | `var(--am-color-icon)` |
| `--am-tour-close-active-bg` | 关闭按钮按下时的背景色 | `var(--am-color-bg-text-active)` |
| `--am-tour-motion-duration` | 切换步骤时高亮区域与卡片的移动时长 | `var(--am-motion-duration-slow)` |

`type="primary"` 的卡片（`.am-tour-primary`）会把背景、文字、指示器和关闭图标的变量切换为主色系。

## 与 PC 端的差异 {#diff}

- 不依赖 `@v-c/tour` / `@v-c/trigger`：浮层通过 Portal 渲染为一个 `position: fixed` 的全屏层 `.am-tour`，其中包含 SVG 蒙层、高亮占位和卡片。`class` / `style` / `rootClass` 作用于该根节点（PC 作用于蒙层与目标占位节点）。
- 卡片宽度为 `min(300px, 100vw - 32px)`（PC 为 520px）；位置自动翻转、沿边缘偏移并限制在屏幕与安全区内。`left` / `right` 系列在卡片放不下时回退到上方或下方；卡片不得不遮挡目标时隐藏箭头。
- `arrow` 的 `{ pointAtCenter }` 仅为类型兼容：箭头始终指向目标中心。
- 显示蒙层时默认锁定页面滚动，新增 `lockScroll` 属性；`mask` 为 `false` 时页面可正常滚动与操作（PC 在没有 `target` 的步骤仍会拦截页面点击）。
- `disabledInteraction` 只拦截高亮区域内的点击，在 `mask` 为 `false` 时同样生效。
- 按钮使用小号 `Button` 并扩展触控区域到 40px；`type="primary"` 时下一步按钮为反色（白底主色字），上一步按钮为幽灵按钮。
- 插槽参数为对象：`indicatorsRender` 为 `{ current, total }`，`actionsRender` 为 `{ originNode, current, total }`（PC 为位置参数）；`originNode` 是单个 VNode。
- 插槽优先于属性：`titleRender` / `descriptionRender` / `coverRender` 渲染了内容时优先于步骤的 `title` / `description` / `cover`（PC 以步骤属性优先）。新增 `closeIcon` 插槽。
- `open` 未传入时默认关闭，需要通过 `open` / `defaultOpen` 打开；补充了 `defaultOpen`、`defaultCurrent`、`closable` 属性和 `updatePosition` 方法。
- 关闭后浮层即销毁；切换步骤时高亮区域与卡片带移动动画，页面滚动时不做动画以保持跟手。
- 不支持 `popupAlign` 事件、`builtinPlacements`、`animated`、`prefixCls`，`classes` / `styles` 仅支持对象形式；`closeIcon` 暂不支持通过 ConfigProvider 全局配置。
- 语言包字段为 `Tour.next` / `Tour.prev` / `Tour.finish`（PC 为 `Next` / `Previous` / `Finish`）。
