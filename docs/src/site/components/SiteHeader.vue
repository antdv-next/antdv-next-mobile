<script setup lang="ts">
import { BgColorsOutlined, GithubOutlined, MoonOutlined, SunOutlined } from '@antdv-next/icons'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import logo from '../../assets/logo.svg'
import { localizePath, useDocsLocale, useMessages } from '../../shared/locale'
import { primaryPresets, radiusPresets, resetDocsTheme, useDocsTheme } from '../../shared/theme'
import { entryLinks } from '../router'

const theme = useDocsTheme()
const docsLocale = useDocsLocale()
const t = useMessages()
const route = useRoute()
const panelOpen = ref(false)
const panelRef = ref<HTMLElement>()

const links = computed(() => entryLinks(docsLocale.locale))
const homeLink = computed(() => localizePath('/', docsLocale.locale))
/** The same page in the other language. */
const switchLink = computed(() => ({
  path: localizePath(route.path, docsLocale.locale === 'zh-CN' ? 'en-US' : 'zh-CN'),
  hash: route.hash,
}))

function onDocClick(event: MouseEvent) {
  if (panelOpen.value && panelRef.value && !panelRef.value.contains(event.target as Node))
    panelOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <header class="site-header">
    <RouterLink :to="homeLink" class="site-logo">
      <img :src="logo" alt="" width="40" height="28">
      <span>Antdv Next <b>Mobile</b></span>
    </RouterLink>
    <nav class="site-nav">
      <RouterLink :to="links.guide" :class="{ active: route.meta.type === 'guide' }">
        {{ t.nav.guide }}
      </RouterLink>
      <RouterLink :to="links.component" :class="{ active: route.meta.type === 'component' }">
        {{ t.nav.components }}
      </RouterLink>
      <a href="https://www.antdv-next.com" target="_blank" rel="noopener">{{ t.nav.pc }}</a>
    </nav>
    <div class="site-actions">
      <div ref="panelRef" class="theme-picker">
        <button class="icon-btn" :class="{ active: panelOpen }" :title="t.theme.customize" :aria-label="t.theme.customize" @click="panelOpen = !panelOpen">
          <BgColorsOutlined />
        </button>
        <div v-if="panelOpen" class="theme-panel">
          <div class="theme-panel-title">
            {{ t.theme.primary }}
          </div>
          <div class="theme-colors">
            <button
              v-for="preset in primaryPresets"
              :key="preset.color"
              class="theme-color"
              :class="{ active: theme.primary === preset.color }"
              :style="{ background: preset.color }"
              :title="t.theme.primaryNames[preset.key]"
              :aria-label="t.theme.primaryNames[preset.key]"
              @click="theme.primary = preset.color"
            />
            <label class="theme-color theme-color-custom" :title="t.theme.custom">
              <input v-model="theme.primary" type="color" :aria-label="t.theme.customPrimary">
            </label>
          </div>
          <div class="theme-panel-title">
            {{ t.theme.radius }}
          </div>
          <div class="theme-seg">
            <button
              v-for="preset in radiusPresets"
              :key="preset.value"
              :class="{ active: theme.radius === preset.value }"
              @click="theme.radius = preset.value"
            >
              {{ t.theme.radiusNames[preset.key] }}
            </button>
          </div>
          <div class="theme-panel-title">
            {{ t.theme.algorithm }}
          </div>
          <div class="theme-seg">
            <button :class="{ active: !theme.dark }" @click="theme.dark = false">
              {{ t.theme.light }}
            </button>
            <button :class="{ active: theme.dark }" @click="theme.dark = true">
              {{ t.theme.dark }}
            </button>
            <button :class="{ active: theme.compact }" @click="theme.compact = !theme.compact">
              {{ t.theme.compact }}
            </button>
          </div>
          <button class="theme-reset" @click="resetDocsTheme()">
            {{ t.theme.reset }}
          </button>
        </div>
      </div>
      <RouterLink :to="switchLink" class="icon-btn locale-switch" :title="t.switchLocale" :aria-label="t.switchLocale">
        {{ t.switchLocaleShort }}
      </RouterLink>
      <button class="icon-btn" :title="theme.dark ? t.theme.toLight : t.theme.toDark" :aria-label="t.theme.toggle" @click="theme.dark = !theme.dark">
        <SunOutlined v-if="theme.dark" />
        <MoonOutlined v-else />
      </button>
      <a class="icon-btn" href="https://github.com/antdv-next/antdv-next-mobile" target="_blank" rel="noopener" aria-label="GitHub">
        <GithubOutlined />
      </a>
    </div>
  </header>
</template>
