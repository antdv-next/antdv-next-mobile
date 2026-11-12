---
title: Drawer
subtitle: 抽屉
description: 从屏幕边缘滑出的浮层面板，带有标题、关闭按钮与页脚。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 当需要一个附加的面板来承载表单、详情、筛选等内容，并且希望用户完成后回到原页面时。
- 移动端默认从底部滑出（底部面板 / Bottom Sheet），也可以从左、右、上滑出。

API 与 Antdv Next 的 `Drawer` 对齐，基于 [Popup](/components/popup) 实现。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/placement.vue">弹出位置</demo>
<demo src="./demo/extra-footer.vue">额外操作与页脚</demo>
<demo src="./demo/size.vue">尺寸</demo>
<demo src="./demo/swipe.vue">下滑关闭</demo>
<demo src="./demo/loading.vue">加载中</demo>
<demo src="./demo/closable.vue">关闭按钮</demo>
<demo src="./demo/style-class.vue">语义化类名与组件变量</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示，支持 `v-model:open` | `boolean` | `false` |
| title | 标题，同名插槽优先 | `VueNode` | - |
| extra | 头部右侧的额外操作区，同名插槽优先 | `VueNode` | - |
| footer | 页脚，同名插槽优先 | `VueNode` | - |
| placement | 抽屉方向 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| closable | 是否显示关闭按钮，可配置图标、禁用与位置 | `boolean \| { closeIcon?: VueNode, disabled?: boolean, placement?: 'start' \| 'end' }` | `true` |
| closeIcon | 自定义关闭图标，设为 `null` 或 `false` 时隐藏关闭按钮 | `VueNode` | `<CloseOutlined />` |
| mask | 是否显示遮罩 | `boolean` | `true` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| keyboard | 是否支持按 ESC 关闭 | `boolean` | `true` |
| size | 预设尺寸或自定义尺寸。`default`：上下方向由内容撑开（最高 90%），左右方向为 80%；`large`：上下方向 90%，左右方向 100% | `'default' \| 'large' \| number \| string` | `'default'` |
| width | 左右方向抽屉的宽度，优先于 `size` | `number \| string` | - |
| height | 上下方向抽屉的高度，优先于 `size` | `number \| string` | - |
| loading | 显示加载指示器代替内容 | `boolean` | `false` |
| destroyOnHidden | 关闭后销毁内容 | `boolean` | `false` |
| forceRender | 首次打开前预渲染内容 | `boolean` | `false` |
| getContainer | 挂载节点，`false` 为挂载在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 层级 | `number` | 自动递增 |
| round | 朝向页面一侧使用圆角 | `boolean` | `true` |
| safeArea | 底部弹出时预留底部安全区 | `boolean` | `true` |
| lockScroll | 打开时锁定页面滚动 | `boolean` | `true` |
| swipeToClose | 显示拖拽手柄，并支持下滑关闭（仅 `placement="bottom"`） | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| rootStyle | 根节点样式（包含遮罩） | `CSSProperties` | - |
| classes | 语义化结构类名 | `Record<SemanticDOM, string>` | - |
| styles | 语义化结构样式 | `Record<SemanticDOM, CSSProperties>` | - |

`SemanticDOM`：`root`（根节点）、`mask`（遮罩）、`section`（面板）、`header`、`title`、`extra`、`body`、`footer`、`close`（关闭按钮）、`handle`（拖拽手柄）。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:open | 显示状态变化 | `(open: boolean) => void` |
| close | 点击关闭按钮、遮罩、按下 ESC 或下滑关闭时触发 | `(event?: Event) => void` |
| afterOpenChange | 打开 / 关闭动画结束后触发 | `(open: boolean) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 抽屉内容 |
| title | 标题，优先于 `title` 属性 |
| extra | 额外操作区，优先于 `extra` 属性 |
| footer | 页脚，优先于 `footer` 属性 |
| closeIcon | 自定义关闭图标，优先于 `closeIcon` 属性 |

### 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 抽屉面板 DOM 节点 | `HTMLElement` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Drawer` 或直接覆盖 CSS 变量（作用于 `rootClass` 所在的根节点）定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-drawer-size` | 左右方向的默认宽度 | `80%` |
| `--am-drawer-size-large` | 左右方向 `large` 的宽度 | `100%` |
| `--am-drawer-max-height` | 上下方向的最大高度，也是 `large` 的高度 | `90%` |
| `--am-drawer-header-padding` | 头部内边距 | `var(--am-padding-sm) var(--am-padding)` |
| `--am-drawer-body-padding` | 内容区内边距 | `var(--am-padding)` |
| `--am-drawer-footer-padding` | 页脚内边距 | `var(--am-padding-sm) var(--am-padding)` |
| `--am-drawer-title-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-drawer-close-size` | 关闭图标大小 | `18px` |
| `--am-drawer-handle-width` | 拖拽手柄宽度 | `36px` |
| `--am-drawer-handle-height` | 拖拽手柄高度 | `4px` |
| `--am-drawer-handle-color` | 拖拽手柄颜色 | `var(--am-color-fill)` |

面板背景与圆角沿用 Popup 的 `--am-popup-bg`、`--am-popup-border-radius`。

## 与 PC 端的差异 {#diff}

- `placement` 默认值为 `'bottom'`（PC 端为 `'right'`）。
- `size` 的预设值按屏幕比例计算（PC 端为固定的 `378px` / `736px`），并额外支持字符串尺寸（如 `'60%'`）。
- `loading` 显示加载图标而非骨架屏。
- 新增 `round`、`safeArea`、`lockScroll`、`swipeToClose`。
- 不支持 `push`（多层抽屉推开）、`resizable`（拖拽调整尺寸）、`mask` 的模糊配置，以及 `keydown`、`mouseenter` 等 PC 交互事件。
- `classes` / `styles` 仅支持对象形式，不支持函数形式；不包含 `wrapper`、`dragger`，新增 `handle`。
