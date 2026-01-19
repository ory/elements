<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue"
import type { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { isUiNodeInputAttributes } from "@ory/client-fetch"
import { useOryFormContext } from "../../../../composables/useOryFormContext"

interface TurnstileConfig {
  sitekey: string
  action: string
  theme: "auto" | "light" | "dark"
  response_field_name: string
}

interface TurnstileApi {
  render: (
    container: string | HTMLElement,
    options: Record<string, unknown>,
  ) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    oryCaptchaTurnstileInit?: () => void
  }
}

const props = defineProps<{
  node: UiNode
}>()

const formContext = useOryFormContext()
const containerRef = ref<HTMLDivElement | null>(null)
const widgetId = ref<string | null>(null)
const isRendered = ref(false)

const config = computed((): TurnstileConfig | null => {
  if (!isUiNodeInputAttributes(props.node.attributes)) {
    return null
  }

  const attrs = props.node.attributes as UiNodeInputAttributes

  if (attrs.name === "captcha_turnstile_options" && attrs.value) {
    try {
      return JSON.parse(attrs.value as string) as TurnstileConfig
    } catch {
      return null
    }
  }

  return null
})

const shouldRender = computed(() => {
  if (!isUiNodeInputAttributes(props.node.attributes)) {
    return false
  }

  const attrs = props.node.attributes as UiNodeInputAttributes

  if (attrs.name === "transient_payload.captcha_turnstile_response") {
    return false
  }

  if (attrs.name === "captcha_turnstile_options") {
    return true
  }

  return false
})

function renderWidget() {
  const cfg = config.value
  if (!cfg || !containerRef.value || !window.turnstile || isRendered.value) {
    return
  }

  if (widgetId.value) {
    try {
      window.turnstile.remove(widgetId.value)
    } catch {
      // Ignore errors when removing
    }
    widgetId.value = null
  }

  widgetId.value = window.turnstile.render(containerRef.value, {
    sitekey: cfg.sitekey,
    action: cfg.action,
    theme: cfg.theme,
    size: "flexible",
    "response-field": false,
    callback: (token: string) => {
      formContext.setValue(cfg.response_field_name, token)
    },
    "expired-callback": () => {
      if (widgetId.value && window.turnstile) {
        window.turnstile.reset(widgetId.value)
      }
    },
  })

  isRendered.value = true
}

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve()
      return
    }

    const existingScript = document.getElementById("cf-turnstile-script")
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 50)
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error("Turnstile script loading timeout"))
      }, 10000)
      return
    }

    const script = document.createElement("script")
    script.id = "cf-turnstile-script"
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=oryCaptchaTurnstileInit"
    script.async = true
    script.defer = true
    script.onload = () => {
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 50)
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error("Turnstile API not available after script load"))
      }, 5000)
    }
    script.onerror = () => reject(new Error("Failed to load Turnstile script"))
    document.head.appendChild(script)
  })
}

function waitForTurnstileAndRender() {
  void loadTurnstileScript()
    .then(() => {
      renderWidget()
      return undefined
    })
    .catch((error: unknown) => {
      console.error("Turnstile initialization failed:", error)
    })
}

onMounted(() => {
  if (!config.value) {
    return
  }

  const existingInit = window.oryCaptchaTurnstileInit
  window.oryCaptchaTurnstileInit = () => {
    existingInit?.()
    renderWidget()
  }

  waitForTurnstileAndRender()
})

onUnmounted(() => {
  if (widgetId.value && window.turnstile) {
    try {
      window.turnstile.remove(widgetId.value)
    } catch {
      // Ignore errors
    }
  }
})
</script>

<template>
  <div
    v-if="shouldRender"
    id="cf-turnstile"
    ref="containerRef"
    style="min-width: 300px; width: 100%; height: 65px"
    data-testid="ory/form/node/captcha"
  />
</template>
