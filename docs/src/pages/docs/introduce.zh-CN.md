---
title: 介绍
order: 1
group:
  title: 指南
  order: 1
---

`@antdv-next/mobile` 是 [antdv-next](https://www.antdv-next.com) 家族的移动端组件库，基于 Vue 3 构建。

它的目标很明确：**让你用写 PC 端的方式写移动端**。只要某个概念在 antdv-next 里存在，这里就使用完全相同的属性名、事件名和语义；同时每个组件都按触屏体验重新设计，而不是把桌面组件缩小。

## 特性 {#features}

- **API 与 PC 端对齐**：`v-model:open`、`v-model:value`、`items`、`options`、`fieldNames`、`rootClass`、`classes`、`styles`、`Modal.confirm`、`message.success`…… 迁移成本接近于零，详见[与 PC 端对齐](/docs/pc-parity)。
- **为移动端设计**：底部弹层、滚轮选择、手势滑动、下拉刷新、安全区适配、`:active` 按压反馈。
- **纯 CSS 变量主题**：没有 CSS-in-JS 运行时，覆盖一个 `--am-*` 变量即可换肤，暗色与紧凑算法可以组合和嵌套。
- **`<script setup>` + TypeScript**：所有组件都以组合式 API 编写，提供完整的类型定义。
- **按需引入**：ESM 产物保留模块结构，样式随组件自动引入，天然支持 Tree Shaking。
- **国际化**：内置 `zh_CN`、`en_US` 语言包。

## 浏览器支持 {#browsers}

主题系统依赖 CSS `color-mix()`，因此需要以下环境：

| 平台 | 最低版本 |
| --- | --- |
| iOS Safari | 16.2 |
| Android Chrome / WebView | 111 |
| 微信内置浏览器 | 基于 Chromium 111+ 的版本 |

## 组件一览 {#components}

组件按使用场景分为七类：通用、布局、导航、数据录入、数据展示、反馈、手势与其他。右侧的手机模拟器可以直接体验所有组件，也可以用手机直接访问 [m.antdv-next.com/mobile.html](https://m.antdv-next.com/mobile.html)。

## 谁在维护 {#maintainers}

本项目由 antdv-next 团队以 MIT 协议开源，欢迎通过 [GitHub](https://github.com/antdv-next/antdv-next-mobile) 参与贡献。
