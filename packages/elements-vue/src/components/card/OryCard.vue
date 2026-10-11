<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { useComponents } from "../../composables/useComponents"

const components = useComponents()
</script>

<template>
  <component :is="components.Card.Root">
    <slot />
  </component>
</template>
