<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { useSlots } from "vue"

const slots = useSlots()
</script>

<template>
  <section v-if="slots.default" class="text-left">
    <slot />
  </section>
</template>
