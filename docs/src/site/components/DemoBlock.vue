<script setup lang="ts">
import { CheckOutlined, CopyOutlined, DownOutlined, MobileOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { useMessages } from '../../shared/locale'
import { focusDemo, simulator } from '../state'

const props = defineProps<{
  id: string
  title: string
  descHtml: string
  codeHtml: string
  code: string
}>()

const t = useMessages()
const copied = ref(false)
const expanded = ref(false)
const lines = computed(() => props.code.split('\n').length)
const collapsible = computed(() => lines.value > 22)
const active = computed(() => simulator.demo === props.id)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  }
  catch {}
}
</script>

<template>
  <section :id="`demo-${id}`" class="demo-block" :class="{ active }">
    <header class="demo-block-header" @click="focusDemo(id)">
      <h3>{{ title }}</h3>
      <div class="demo-block-actions" @click.stop>
        <button class="icon-btn" :title="t.demo.focus" :aria-label="t.demo.focus" @click="focusDemo(id)">
          <MobileOutlined />
        </button>
        <button class="icon-btn" :title="copied ? t.demo.copied : t.demo.copy" :aria-label="t.demo.copy" @click="copy">
          <CheckOutlined v-if="copied" class="copied" />
          <CopyOutlined v-else />
        </button>
      </div>
    </header>
    <div v-if="descHtml" class="demo-block-desc markdown" v-html="descHtml" />
    <div class="demo-block-code" :class="{ collapsed: collapsible && !expanded }">
      <div v-html="codeHtml" />
      <button v-if="collapsible" class="demo-block-expand" :class="{ expanded }" @click="expanded = !expanded">
        <DownOutlined /> {{ expanded ? t.demo.collapse : t.demo.expand(lines) }}
      </button>
    </div>
  </section>
</template>
