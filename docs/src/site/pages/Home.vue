<script setup lang="ts">
import { ApiOutlined, BgColorsOutlined, GlobalOutlined, MobileOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@antdv-next/icons'
import { computed, onMounted } from 'vue'
import { useDocs, useDocsLocale, useMessages } from '../../shared/locale'
import Simulator from '../components/Simulator.vue'
import { entryLinks } from '../router'
import { simulator } from '../state'

const docsLocale = useDocsLocale()
const docs = useDocs()
const t = useMessages()

// same order as `home.features` in shared/locale.ts
const icons = [ApiOutlined, MobileOutlined, BgColorsOutlined, ThunderboltOutlined, GlobalOutlined, SafetyCertificateOutlined]
const features = computed(() => t.value.home.features.map((feature, index) => ({ ...feature, icon: icons[index] })))
const links = computed(() => entryLinks(docsLocale.locale))

onMounted(() => {
  simulator.page = ''
  simulator.demo = ''
})
</script>

<template>
  <main class="home">
    <section class="home-hero">
      <div class="home-intro">
        <span class="home-badge">{{ t.home.badge }}</span>
        <h1>Antdv Next <em>Mobile</em></h1>
        <p class="home-desc">
          {{ t.home.desc }}
        </p>
        <div class="home-actions">
          <RouterLink :to="links.guide" class="btn btn-primary">
            {{ t.home.start }}
          </RouterLink>
          <RouterLink :to="links.component" class="btn">
            {{ t.home.browse(docs.components.length) }}
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
