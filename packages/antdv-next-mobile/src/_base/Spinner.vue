<script setup lang="ts">
import { LoadingOutlined } from '@antdv-next/icons'
import '../style'

/**
 * The one loading indicator of the library (Button, Switch, Toast, List, InfiniteScroll ...).
 * Inherits `color` and `font-size`; restyle it once here to change every spinner.
 */
defineOptions({ name: 'AmSpinner' })
</script>

<template>
  <LoadingOutlined class="am-spinner am-spin-icon" />
</template>
