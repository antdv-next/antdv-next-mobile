<script setup lang="ts">
import { BgColorsOutlined, GithubOutlined, MoonOutlined, SunOutlined } from '@antdv-next/icons'
import { components, guides } from 'virtual:am-docs'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import logo from '../../assets/logo.svg'
import { primaryPresets, radiusPresets, resetDocsTheme, useDocsTheme } from '../../shared/theme'

const theme = useDocsTheme()
const route = useRoute()
const panelOpen = ref(false)
const panelRef = ref<HTMLElement>()

const guideLink = computed(() => (guides[0] ? `/docs/${guides[0].name}` : '/'))
const componentLink = computed(() => {
  const first = components.find(c => c.name === 'button') ?? components[0]
  return first ? `/components/${first.name}` : '/'
})

function onDocClick(event: MouseEvent) {
  if (panelOpen.value && panelRef.value && !panelRef.value.contains(event.target as Node))
    panelOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="site-logo">
      <img :src="logo" alt="" width="40" height="28">
      <span>Antdv Next <b>Mobile</b></span>
    </RouterLink>
    <nav class="site-nav">
      <RouterLink :to="guideLink" :class="{ active: route.meta.type === 'guide' }">
        指南
      </RouterLink>
      <RouterLink :to="componentLink" :class="{ active: route.meta.type === 'component' }">
        组件
      </RouterLink>
      <a href="https://www.antdv-next.com" target="_blank" rel="noopener">PC 组件库</a>
    </nav>
    <div class="site-actions">
      <div ref="panelRef" class="theme-picker">
        <button class="icon-btn" :class="{ active: panelOpen }" title="主题定制" aria-label="主题定制" @click="panelOpen = !panelOpen">
          <BgColorsOutlined />
        </button>
        <div v-if="panelOpen" class="theme-panel">
          <div class="theme-panel-title">
            主色
          </div>
          <div class="theme-colors">
            <button
              v-for="preset in primaryPresets"
              :key="preset.color"
              class="theme-color"
              :class="{ active: theme.primary === preset.color }"
              :style="{ background: preset.color }"
              :title="preset.name"
              :aria-label="preset.name"
              @click="theme.primary = preset.color"
            />
            <label class="theme-color theme-color-custom" title="自定义">
              <input v-model="theme.primary" type="color" aria-label="自定义主色">
            </label>
          </div>
          <div class="theme-panel-title">
            圆角
          </div>
          <div class="theme-seg">
            <button
              v-for="preset in radiusPresets"
              :key="preset.value"
              :class="{ active: theme.radius === preset.value }"
              @click="theme.radius = preset.value"
            >
              {{ preset.name }}
            </button>
          </div>
          <div class="theme-panel-title">
            算法
          </div>
          <div class="theme-seg">
            <button :class="{ active: !theme.dark }" @click="theme.dark = false">
              亮色
            </button>
            <button :class="{ active: theme.dark }" @click="theme.dark = true">
              暗色
            </button>
            <button :class="{ active: theme.compact }" @click="theme.compact = !theme.compact">
              紧凑
            </button>
          </div>
          <button class="theme-reset" @click="resetDocsTheme()">
            恢复默认
          </button>
        </div>
      </div>
      <button class="icon-btn" :title="theme.dark ? '切换到亮色' : '切换到暗色'" aria-label="切换明暗" @click="theme.dark = !theme.dark">
        <SunOutlined v-if="theme.dark" />
        <MoonOutlined v-else />
      </button>
      <a class="icon-btn" href="https://github.com/antdv-next/antdv-next-mobile" target="_blank" rel="noopener" aria-label="GitHub">
        <GithubOutlined />
      </a>
    </div>
  </header>
</template>
