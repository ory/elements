<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { useComponents } from "../composables/useComponents"

const { Page } = useComponents()
</script>

<template>
  <component :is="Page.Header" v-if="Page.Header" />
</template>
