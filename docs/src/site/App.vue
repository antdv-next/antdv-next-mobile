<script setup lang="ts">
import { watchEffect } from 'vue'
import { useDocsTheme } from '../shared/theme'
import SiteHeader from './components/SiteHeader.vue'

const theme = useDocsTheme()

watchEffect(() => {
  const root = document.documentElement
  root.dataset.theme = theme.dark ? 'dark' : 'light'
  root.style.setProperty('--site-primary', theme.primary)
})
</script>

<template>
  <SiteHeader />
  <RouterView />
</template>
