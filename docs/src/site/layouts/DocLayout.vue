<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import Simulator from '../components/Simulator.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { simulator } from '../state'

const route = useRoute()

watch(
  () => route.path,
  () => {
    simulator.page = route.meta.type === 'component' ? String(route.meta.name) : ''
    simulator.demo = ''
  },
  { immediate: true },
)
</script>

<template>
  <div class="doc-layout">
    <SiteSidebar />
    <main class="doc-main">
      <RouterView />
    </main>
    <Simulator />
  </div>
</template>
