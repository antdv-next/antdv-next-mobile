---
title: Affix
subtitle: 固钉
description: 将页面元素钉在可视范围。
group:
  title: 手势与其他
  order: 7
---

## 何时使用 {#when-to-use}

- 当内容区域比较长，需要滚动页面时，把筛选栏、分类标题、操作按钮等固定在屏幕顶部或底部。
- 需要在元素固定 / 取消固定时得到通知（`change` 事件），例如切换吸顶后的样式。

API 与 Antdv Next 的 `Affix` 一致：`offsetTop`、`offsetBottom`、`target`、`change`。固定时会在原位置保留等尺寸的占位，页面布局不会跳动；容器尺寸变化或屏幕旋转后自动重新计算。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/bottom.vue">固定在底部</demo>
<demo src="./demo/change.vue">固定状态改变的回调</demo>
<demo src="./demo/sticky-header.vue">吸顶分组标题</demo>

> 为了在文档页中演示，示例都放在固定高度的滚动容器里并通过 `target` 指定它。实际页面整体滚动时不需要设置 `target`。

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| offsetTop | 距离窗口（或 `target`）顶部达到指定偏移量后触发 | `number` | `0` |
| offsetBottom | 距离窗口（或 `target`）底部达到指定偏移量后触发 | `number` | - |
| target | 设置 `Affix` 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 | `() => Window \| HTMLElement \| null` | `() => window` |
| zIndex | 固定后的层级 | `number` | `10` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'affix', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'affix', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 固定状态改变时触发 | `(affixed: boolean) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 需要固定的内容 |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| updatePosition | 重新计算位置（内容尺寸由外部异步改变后可手动调用） | `() => void` |

**注意：**`Affix` 内的元素不要使用绝对定位，如需要绝对定位的效果，可以直接设置 `Affix` 为绝对定位：

```html
<am-affix style="position: absolute; top: y; left: x">...</am-affix>
```

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-affix-z-index` | 固定后的层级，`zIndex` 属性优先 | `10` |

## 与 PC 端的差异 {#diff}

- 新增 `zIndex` 属性（移动端常需要压住列表内容或让位于导航栏）。
- 使用 `target` 指定容器时，除容器自身的滚动外也会监听页面滚动，容器随页面移动时固定元素会跟随。
- 其余属性、事件与方法和 PC 一致。

## 常见问题 {#faq}

### 只需要简单的吸顶，是否必须使用 Affix？

不必。纯展示的吸顶优先使用原生 `position: sticky`，性能更好。当需要感知固定状态、固定在底部、或祖先元素设置了 `overflow` 导致 `sticky` 失效时再使用 `Affix`。

### 固定后的元素没有背景，内容透出来了？

固定的元素悬浮在内容之上，请为插槽内容设置背景色。
