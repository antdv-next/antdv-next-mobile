<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMessages } from '../../shared/locale'

interface TocItem { id: string, text: string, level: number }

const props = defineProps<{
  frontmatter: { title?: string, subtitle?: string, description?: string }
  toc: TocItem[]
}>()

const route = useRoute()
const t = useMessages()
const isComponent = computed(() => route.meta.type === 'component')
const anchors = computed(() => props.toc.filter(item => item.level === 2))
</script>

<template>
  <article class="doc-page">
    <header class="doc-header">
      <h1>
        {{ frontmatter.title }}
        <span v-if="frontmatter.subtitle">{{ frontmatter.subtitle }}</span>
      </h1>
      <p v-if="frontmatter.description">
        {{ frontmatter.description }}
      </p>
      <nav v-if="isComponent && anchors.length > 1" class="doc-anchors" :aria-label="t.toc">
        <RouterLink v-for="item in anchors" :key="item.id" :to="{ hash: `#${item.id}` }">
          {{ item.text }}
        </RouterLink>
      </nav>
    </header>
    <div class="markdown">
      <slot />
    </div>
  </article>
</template>
