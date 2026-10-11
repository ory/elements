<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { UiNode, UiNodeImageAttributes } from "@ory/client-fetch"

defineProps<{
  node: UiNode
  attributes: UiNodeImageAttributes
}>()
</script>

<template>
  <img
    :src="attributes.src"
    :alt="node.meta?.label?.text ?? 'Image'"
    :width="attributes.width"
    :height="attributes.height"
    :id="attributes.id"
    class="max-w-full"
  />
</template>
