---
title: Modal
subtitle: 对话框
description: 展示一个对话框，提供标题、内容区、操作区。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 `Modal` 在当前页面正中打开一个浮层，承载相应的操作。
- 需要一个简洁的确认框询问用户时，可以使用 `Modal.confirm()` 等语法糖方法。

API 与 antdv-next 的 `Modal` 对齐，外观为移动端常见的 iOS 风格对话框：圆角、标题与内容居中、底部按钮通栏排列。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/confirm.vue">确认对话框</demo>
<demo src="./demo/info.vue">信息提示</demo>
<demo src="./demo/async.vue">异步关闭</demo>
<demo src="./demo/actions.vue">自定义操作</demo>
<demo src="./demo/footer.vue">自定义页脚</demo>
<demo src="./demo/image.vue">图片与头部</demo>
<demo src="./demo/hooks.vue">使用 hooks 获得上下文</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 对话框是否可见，支持 `v-model:open` | `boolean` | `false` |
| title | 标题，同名插槽优先 | `VueNode` | - |
| content | 内容，默认插槽优先 | `VueNode` | - |
| footer | 底部内容，设为 `null` 或 `false` 时不显示底部 | `VueNode` | （确定取消按钮） |
| okText | 确认按钮文字 | `VueNode` | `确定` |
| cancelText | 取消按钮文字 | `VueNode` | `取消` |
| okType | 确认按钮类型 | `'default' \| 'primary' \| 'danger' \| 'dashed' \| 'link' \| 'text'` | `'primary'` |
| okButtonProps | 确认按钮的 props | [ButtonProps](/components/button#props) | - |
| cancelButtonProps | 取消按钮的 props | [ButtonProps](/components/button#props) | - |
| confirmLoading | 确定按钮 loading | `boolean` | `false` |
| okCancel | 是否显示取消按钮。为 `false` 时只有一个按钮，默认文字为 `知道了` | `boolean` | `true` |
| closable | 是否显示右上角的关闭按钮 | `boolean` | `false` |
| closeIcon | 自定义关闭图标，设为 `null` 或 `false` 时隐藏关闭按钮 | `VueNode` | `<CloseOutlined />` |
| mask | 是否显示遮罩 | `boolean` | `true` |
| maskClosable | 点击遮罩是否允许关闭 | `boolean` | `true` |
| centered | 垂直居中展示。移动端始终居中，仅为与 PC 端保持一致而保留 | `boolean` | `true` |
| keyboard | 是否支持按 ESC 关闭 | `boolean` | `true` |
| destroyOnHidden | 关闭时销毁对话框里的子元素 | `boolean` | `false` |
| forceRender | 强制渲染对话框 | `boolean` | `false` |
| getContainer | 指定挂载的节点，`false` 为挂载在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 层级 | `number` | 自动递增 |
| width | 宽度，最大不超过屏幕宽度减 `48px` | `number \| string` | `300` |
| scrollLock | 打开时是否锁定页面滚动 | `boolean` | `true` |
| image | 对话框顶部的图片地址 | `string` | - |
| actions | 操作按钮列表，替代默认的确定取消按钮，超过 2 个时纵向排列 | [ModalAction](#modalaction)[] | - |
| closeOnAction | 点击操作按钮后是否关闭 | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| rootStyle | 根节点样式 | `CSSProperties` | - |
| classes | 语义化结构类名 | `Record<SemanticDOM, string>` | - |
| styles | 语义化结构样式 | `Record<SemanticDOM, CSSProperties>` | - |

`SemanticDOM`：`root`（根节点）、`mask`（遮罩）、`container`（对话框容器）、`header`（图片 / 头部区域）、`title`、`body`、`footer`、`close`。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:open | 可见状态变化 | `(open: boolean) => void` |
| ok | 点击确定回调 | `(event: MouseEvent) => void` |
| cancel | 点击遮罩、右上角关闭按钮、取消按钮或按下 ESC 的回调 | `(event?: Event) => void` |
| action | 点击 `actions` 中的操作按钮（`onClick` 返回的 Promise 完成后）触发 | `(action: ModalAction, index: number) => void` |
| afterClose | 对话框完全关闭后的回调 | `() => void` |
| afterOpenChange | 打开和关闭动画结束后的回调 | `(open: boolean) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 内容，优先于 `content` 属性 | - |
| title | 标题，优先于 `title` 属性 | - |
| header | 标题上方的区域，可放置插图、图标，优先于 `image` 属性 | - |
| footer | 底部内容，优先于 `footer` 属性 | `{ ok, cancel, confirmLoading }` |
| okText | 确认按钮文字 | - |
| cancelText | 取消按钮文字 | - |
| closeIcon | 自定义关闭图标 | - |

### ModalAction

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | - |
| text | 按钮文字 | `VueNode` | - |
| danger | 危险操作，文字为红色 | `boolean` | `false` |
| bold | 强调操作，使用主色与粗体 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| onClick | 点击回调。返回 Promise 时按钮进入 loading 状态，完成后才触发 `action` 事件 | `(action: ModalAction) => void \| Promise<void>` | - |

### 静态方法 {#static-methods}

- `Modal.confirm(config)`
- `Modal.info(config)`
- `Modal.success(config)`
- `Modal.error(config)`
- `Modal.warning(config)`
- `Modal.show(config)`：不带预设类型的对话框，通常与 `actions` 搭配
- `Modal.alert(config): Promise<void>`：只有一个按钮的提示框，关闭后 Promise 完成
- `Modal.confirmAsync(config): Promise<boolean>`：确认框的 Promise 形式，确定为 `true`，取消为 `false`
- `Modal.destroyAll()`：销毁所有通过静态方法打开的对话框

`confirm` / `info` / `success` / `error` / `warning` / `show` 返回一个引用，可以通过该引用更新和关闭对话框：

```ts
const modal = Modal.info({ title: '提示' })

modal.update({ title: '修改的标题' })
// 也可以传入函数
modal.update(prev => ({ ...prev, title: `${prev.title}（新）` }))

modal.destroy()
```

`config` 参数如下：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 对话框类型 | `'info' \| 'success' \| 'error' \| 'warn' \| 'warning' \| 'confirm'` | - |
| title | 标题 | `VueNode` | - |
| content | 内容 | `VueNode` | - |
| icon | 标题上方的图标，`info / success / error / warning` 有默认图标，设为 `null` 隐藏 | `VueNode` | - |
| image | 顶部图片地址 | `string` | - |
| okText | 确认按钮文字 | `VueNode` | `确定`（单按钮时为 `知道了`） |
| cancelText | 取消按钮文字 | `VueNode` | `取消` |
| okType | 确认按钮类型 | `'default' \| 'primary' \| 'danger' \| ...` | `'primary'` |
| okButtonProps | 确认按钮的 props | `ButtonProps` | - |
| cancelButtonProps | 取消按钮的 props | `ButtonProps` | - |
| okCancel | 是否显示取消按钮 | `boolean` | `confirm` 为 `true`，其余为 `false` |
| actions | 操作按钮列表，替代默认按钮 | `ModalAction[]` | - |
| closeOnAction | 点击操作按钮后是否关闭 | `boolean` | `true` |
| footer | 底部内容，设为 `null` 时不显示底部 | `VueNode` | - |
| closable | 是否显示右上角的关闭按钮 | `boolean` | `false` |
| closeIcon | 自定义关闭图标 | `VueNode` | - |
| mask | 是否显示遮罩 | `boolean` | `true` |
| maskClosable | 点击遮罩是否允许关闭 | `boolean` | `false` |
| keyboard | 是否支持按 ESC 关闭 | `boolean` | `true` |
| getContainer | 指定挂载的节点 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 层级 | `number` | 自动递增 |
| width | 宽度 | `number \| string` | `300` |
| class | 根节点类名 | `string` | - |
| style | 根节点样式 | `CSSProperties` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<SemanticDOM, string>` | - |
| styles | 语义化结构样式 | `Record<SemanticDOM, CSSProperties>` | - |
| afterClose | 完全关闭后的回调 | `() => void` | - |
| onOk | 点击确定回调。声明了 `close` 参数时需手动调用它关闭；否则返回 Promise 时按钮 loading，resolve 后自动关闭，reject 则保持打开 | `(close: () => void) => any` | - |
| onCancel | 点击取消、遮罩、关闭按钮或 ESC 的回调，规则同 `onOk` | `(close: () => void) => any` | - |
| appContext | 应用上下文，使内容中可以使用全局注册的组件与 provide | `AppContext` | - |

静态方法创建的对话框渲染在独立的应用中，主题与语言跟随 `ConfigProvider.config()` 的全局配置，无法读取调用处的 `ConfigProvider` 上下文。需要上下文时请使用 `Modal.useModal()`。

### Modal.useModal()

```vue
<script setup lang="ts">
import { Modal } from 'antdv-next-mobile'

const [modal, ContextHolder] = Modal.useModal()

async function onDelete() {
  const confirmed = await modal.confirmAsync({ title: '确定删除吗？' })
}
</script>

<template>
  <ContextHolder />
  <am-button @click="onDelete">
    删除
  </am-button>
</template>
```

`modal` 上有 `info`、`success`、`error`、`warning`、`confirm`、`show`、`alert`、`confirmAsync` 方法，对话框渲染在 `<ContextHolder />` 所在的位置，因此可以获得 `ConfigProvider` 的主题、语言以及 `provide` 的上下文。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Modal` 或直接覆盖 CSS 变量（作用于 `rootClass` 所在的根节点）定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-modal-width` | 对话框宽度 | `300px` |
| `--am-modal-border-radius` | 圆角 | `var(--am-border-radius-xl)` |
| `--am-modal-bg` | 背景色 | `var(--am-color-bg-elevated)` |
| `--am-modal-content-padding` | 标题与内容区域的内边距 | `var(--am-padding-lg) var(--am-padding-md) var(--am-padding-md)` |
| `--am-modal-title-font-size` | 标题字号 | `var(--am-font-size-xl)` |
| `--am-modal-title-color` | 标题颜色 | `var(--am-color-text-heading)` |
| `--am-modal-body-font-size` | 内容字号 | `var(--am-font-size)` |
| `--am-modal-body-color` | 内容颜色 | `var(--am-color-text-secondary)` |
| `--am-modal-body-max-height` | 内容区最大高度，超出后滚动 | `60vh` |
| `--am-modal-action-height` | 底部按钮高度 | `50px` |
| `--am-modal-action-font-size` | 底部按钮字号 | `var(--am-font-size-lg)` |

## 与 PC 端的差异 {#diff}

- 外观为 iOS 风格的居中对话框，`centered` 始终生效，默认宽度为 `300px`（PC 端为 `520px`），不支持响应式断点宽度。
- `closable` 默认值为 `false`（PC 端为 `true`）。`maskClosable` 与 PC 端一致默认为 `true`，静态方法默认为 `false`；仅支持布尔值的 `mask`，不支持 `mask.blur` / `mask.closable` 配置。
- 底部按钮为通栏的文字按钮：`okButtonProps` / `cancelButtonProps` 仍可透传 `ButtonProps`（如 `disabled`、`loading`、`danger`），`okType` 映射为按钮颜色。
- `footer` 插槽的参数为 `{ ok, cancel, confirmLoading }`，而非 PC 端的 `{ originNode, extra }`。
- 新增 `content`、`okCancel`、`image`、`actions`、`closeOnAction` 属性，`header` 插槽与 `action` 事件。
- 静态方法新增 `Modal.show`、`Modal.alert`、`Modal.confirmAsync`；`info` 等方法的图标显示在标题上方，`confirm` 默认不显示图标。静态方法不支持 `autoFocusButton`。
- `Modal.useModal()` 返回的 `ContextHolder` 是一个组件，用法与 PC 端一致。
- 不支持 `modalRender`、`mousePosition`、`focusable`、`loading`、`wrapClassName`、`wrapProps`、`transitionName`、`maskTransitionName`。
- `classes` / `styles` 仅支持对象形式。
