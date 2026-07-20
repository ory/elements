<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { useSlots } from "vue"
import { useComponents } from "../../composables/useComponents"

const components = useComponents()
const slots = useSlots()
</script>

<template>
  <component v-if="slots.default" :is="components.Card.Header">
    <slot />
  </component>
  <component v-else :is="components.Card.Header" />
</template>
