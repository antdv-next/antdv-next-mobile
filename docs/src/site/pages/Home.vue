<script setup lang="ts">
import { ApiOutlined, BgColorsOutlined, GlobalOutlined, MobileOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@antdv-next/icons'
import { components, guides } from 'virtual:am-docs'
import { onMounted } from 'vue'
import Simulator from '../components/Simulator.vue'
import { simulator } from '../state'

const features = [
  { icon: ApiOutlined, title: '与 PC 端 API 对齐', desc: '属性、事件、插槽、静态方法与 antdv-next 保持一致，一套心智同时覆盖桌面端与移动端。' },
  { icon: MobileOutlined, title: '为触屏而生', desc: '手势、惯性滚动、安全区、按压反馈，弹层统一从底部滑出，每个组件都按移动端体验重新设计。' },
  { icon: BgColorsOutlined, title: '纯 CSS 变量主题', desc: '零运行时样式。覆盖一个变量即可换肤，亮色 / 暗色 / 紧凑算法可自由组合、可嵌套。' },
  { icon: ThunderboltOutlined, title: 'Vue 3 script setup', desc: '全部组件采用 <script setup> + TypeScript 编写，类型完备，支持按需引入与 Tree Shaking。' },
  { icon: GlobalOutlined, title: '国际化', desc: '内置中英文语言包，通过 ConfigProvider 一处配置全局生效，静态方法同样适用。' },
  { icon: SafetyCertificateOutlined, title: '表单开箱即用', desc: 'Form、校验规则与所有录入组件深度集成，选择器、日期、级联等都是标准表单字段。' },
]

const guideLink = guides[0] ? `/docs/${guides[0].name}` : '/'
const firstComponent = components.find(c => c.name === 'button') ?? components[0]
const componentLink = firstComponent ? `/components/${firstComponent.name}` : '/'

onMounted(() => {
  simulator.page = ''
  simulator.demo = ''
})
</script>

<template>
  <main class="home">
    <section class="home-hero">
      <div class="home-intro">
        <span class="home-badge">Vue 3 · 移动端组件库</span>
        <h1>Antdv Next <em>Mobile</em></h1>
        <p class="home-desc">
          与 antdv-next 同源的移动端 UI 组件库。API 对齐 PC 端，体验专为触屏打造，
          基于 CSS 变量的主题系统让全局换肤只需一行配置。
        </p>
        <div class="home-actions">
          <RouterLink :to="guideLink" class="btn btn-primary">
            开始使用
          </RouterLink>
          <RouterLink :to="componentLink" class="btn">
            浏览 {{ components.length }} 个组件
          </RouterLink>
        </div>
        <pre class="home-install"><code>pnpm add antdv-next-mobile</code></pre>
        <ul class="home-features">
          <li v-for="feature in features" :key="feature.title">
            <component :is="feature.icon" class="home-feature-icon" />
            <div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.desc }}</p>
            </div>
          </li>
        </ul>
      </div>
      <Simulator />
    </section>
  </main>
</template>
