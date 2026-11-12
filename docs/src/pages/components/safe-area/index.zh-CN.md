---
title: SafeArea
subtitle: 安全区
description: 在全面屏下为刘海与底部指示条预留空间。
group:
  title: 布局
  order: 2
---

## 何时使用 {#when-to-use}

- 页面底部有吸底的操作栏、标签栏时，避免被 iPhone 等设备的底部指示条遮挡。
- 自定义沉浸式导航栏时，为顶部的刘海 / 状态栏预留空间。

组件本身是一个高度等于对应安全区的占位块，在没有安全区的设备上高度为 `0`。

> 需要在页面的 `viewport` meta 中加入 `viewport-fit=cover`，`env(safe-area-inset-*)` 才会生效：
> `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/fixed-bar.vue" full>吸底操作栏</demo>
<demo src="./demo/slot.vue" full>包裹内容</demo>
<demo src="./demo/multiple.vue" full>自定义倍数</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| position | 预留哪一侧的安全区 | `'top' \| 'bottom'` | `'bottom'` |
| rootClass | 根节点类名 | `string` | - |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 可选的内容，安全区以内边距的形式附加在内容的上方 / 下方 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-safe-area-multiple` | 安全区高度的倍数 | `1` |

## 与 PC 端的差异 {#diff}

- 移动端特有组件，Antdv Next 中没有对应组件。
- 只需要给已有元素添加安全区内边距时，也可以直接使用工具类 `am-safe-area-top` / `am-safe-area-bottom`。
