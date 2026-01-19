<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue"
import { UiNodeGroupEnum, isUiNodeScriptAttributes } from "@ory/client-fetch"
import { Toaster } from "vue-sonner"
import { useOryFlow } from "../../composables/useOryFlow"
import { useGroupSorter, useComponents } from "../../composables/useComponents"
import { getNodeGroups, getScriptNodes } from "../../util/nodeGroups"
import { showToast } from "../../util/showToast"
import SettingsSection from "./SettingsSection.vue"

const { flowContainer } = useOryFlow()
const { Message } = useComponents()
const flow = computed(() => flowContainer.value.flow)
const groupSorter = useGroupSorter()

const nodeGroups = computed(() => {
  return getNodeGroups(flow.value.ui.nodes, { omit: ["script"] })
})

const scriptNodes = computed(() => {
  return getScriptNodes(flow.value.ui.nodes)
})

const sortedEntries = computed(() => {
  return nodeGroups.value.entries.sort(([a], [b]) => groupSorter(a, b))
})

const filteredEntries = computed(() =>
  sortedEntries.value.filter(([group]) => group !== UiNodeGroupEnum.Default),
)

const loadedScripts: HTMLScriptElement[] = []

function loadScripts() {
  scriptNodes.value.forEach((node) => {
    if (!isUiNodeScriptAttributes(node.attributes)) return

    const attrs = node.attributes
    const scriptEl = document.createElement("script")
    if (attrs.src) scriptEl.src = attrs.src
    if (attrs.async) scriptEl.async = attrs.async
    if (attrs.referrerpolicy) scriptEl.referrerPolicy = attrs.referrerpolicy
    if (attrs.crossorigin) scriptEl.crossOrigin = attrs.crossorigin
    if (attrs.integrity) scriptEl.integrity = attrs.integrity
    if (attrs.type) scriptEl.type = attrs.type
    if (attrs.id) scriptEl.id = attrs.id
    if (attrs.nonce) scriptEl.nonce = attrs.nonce
    document.body.appendChild(scriptEl)
    loadedScripts.push(scriptEl)
  })
}

function cleanupScripts() {
  loadedScripts.forEach((el) => {
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
  })
  loadedScripts.length = 0
}

onMounted(() => {
  loadScripts()
})

onUnmounted(() => {
  cleanupScripts()
})

watch(scriptNodes, () => {
  cleanupScripts()
  loadScripts()
})

const shownMessageIds = new Set<number>()

function showMessages() {
  const messages = flow.value.ui.messages
  if (!messages) return
  messages.forEach((message) => {
    if (!shownMessageIds.has(message.id)) {
      shownMessageIds.add(message.id)
      showToast({ message }, Message.Toast)
    }
  })
}

onMounted(() => {
  showMessages()
})

watch(
  () => flow.value.ui.messages,
  () => {
    showMessages()
  },
)
</script>

<template>
  <SettingsSection
    v-for="[group, nodes] in filteredEntries"
    :key="group"
    :group="group"
    :nodes="nodes"
  />
  <Toaster position="bottom-right" />
</template>
