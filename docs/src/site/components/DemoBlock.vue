<script setup lang="ts">
import { CheckOutlined, CopyOutlined, DownOutlined, MobileOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { focusDemo, simulator } from '../state'

const props = defineProps<{
  id: string
  title: string
  descHtml: string
  codeHtml: string
  code: string
}>()

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
        <button class="icon-btn" title="在模拟器中查看" aria-label="在模拟器中查看" @click="focusDemo(id)">
          <MobileOutlined />
        </button>
        <button class="icon-btn" :title="copied ? '已复制' : '复制代码'" aria-label="复制代码" @click="copy">
          <CheckOutlined v-if="copied" class="copied" />
          <CopyOutlined v-else />
        </button>
      </div>
    </header>
    <div v-if="descHtml" class="demo-block-desc markdown" v-html="descHtml" />
    <div class="demo-block-code" :class="{ collapsed: collapsible && !expanded }">
      <div v-html="codeHtml" />
      <button v-if="collapsible" class="demo-block-expand" :class="{ expanded }" @click="expanded = !expanded">
        <DownOutlined /> {{ expanded ? '收起代码' : `展开全部 ${lines} 行` }}
      </button>
    </div>
  </section>
</template>
