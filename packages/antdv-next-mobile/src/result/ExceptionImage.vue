<script setup lang="ts">
defineOptions({ name: 'AmResultExceptionImage' })

defineProps<{ status: string }>()
</script>

<template>
  <svg class="am-result-exception" width="200" height="140" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="status">
    <ellipse class="am-result-exception-shadow" cx="100" cy="126" rx="76" ry="9" />
    <rect class="am-result-exception-window" x="30" y="18" width="140" height="96" rx="10" />
    <path class="am-result-exception-bar" d="M30 28a10 10 0 0 1 10-10h120a10 10 0 0 1 10 10v8H30v-8Z" />
    <circle class="am-result-exception-dot" cx="43" cy="27" r="3" />
    <circle class="am-result-exception-dot" cx="54" cy="27" r="3" />
    <circle class="am-result-exception-dot" cx="65" cy="27" r="3" />
    <text class="am-result-exception-code" x="100" y="88" text-anchor="middle">{{ status }}</text>
    <template v-if="status === '403'">
      <rect class="am-result-exception-accent" x="146" y="88" width="30" height="24" rx="4" />
      <path class="am-result-exception-accent-line" d="M153 88v-6a8 8 0 0 1 16 0v6" />
    </template>
    <template v-else-if="status === '500'">
      <path class="am-result-exception-accent" d="M161 78 178 110h-34l17-32Z" />
      <path class="am-result-exception-accent-mark" d="M161 90v9m0 4.5v.5" />
    </template>
    <template v-else>
      <circle class="am-result-exception-accent-ring" cx="158" cy="94" r="12" />
      <path class="am-result-exception-accent-line" d="m167 103 10 10" />
    </template>
  </svg>
</template>
