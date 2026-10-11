<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { UiNode, UiNodeAnchorAttributes } from "@ory/client-fetch"
import { cn } from "../../utils/cn"

defineProps<{
  node: UiNode
  attributes: UiNodeAnchorAttributes
}>()
</script>

<template>
  <a
    :href="attributes.href"
    :id="attributes.id"
    :class="
      cn(
        'text-interface-foreground-brand-primary',
        'hover:text-interface-foreground-default-primary',
        'underline',
      )
    "
  >
    {{ attributes.title?.text ?? attributes.href }}
  </a>
</template>
