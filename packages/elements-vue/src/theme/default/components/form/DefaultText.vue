<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { UiNode, UiNodeTextAttributes } from "@ory/client-fetch"
import { cn } from "../../utils/cn"

defineProps<{
  node: UiNode
  attributes: UiNodeTextAttributes
}>()
</script>

<template>
  <div
    :class="
      cn('text-interface-foreground-default-secondary', 'whitespace-pre-wrap')
    "
    :id="attributes.id"
  >
    {{ attributes.text?.text ?? "" }}
  </div>
</template>
