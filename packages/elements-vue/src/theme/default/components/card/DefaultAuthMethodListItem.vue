<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue"
import { UiNodeGroupEnum, isUiNodeInputAttributes } from "@ory/client-fetch"
import { useOryFlow } from "../../../../composables/useOryFlow"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { useOptionalOryFormContext } from "../../../../composables/useOryFormContext"
import { triggerToWindowCall } from "../../../../util/ui"
import type { IconName } from "../ui/Icon.vue"
import Icon from "../ui/Icon.vue"

const props = defineProps<{
  group: UiNodeGroupEnum
  title?: { id: string; values?: Record<string, string> }
  onClick?: () => void
}>()

const { flowContainer } = useOryFlow()
const intl = useOryIntl()
const formContext = useOptionalOryFormContext()

const iconsMap: Record<string, IconName> = {
  code: "code",
  totp: "totp",
  webauthn: "webauthn",
  lookup_secret: "lookup-secret",
  password: "password",
  passkey: "passkey",
  hardware_token: "key",
}

const iconName = computed(() => iconsMap[props.group] || null)

const titleText = computed(() => {
  const titleId = props.title?.id ?? `two-step.${props.group}.title`
  return intl.t(titleId, props.title?.values)
})

const descriptionText = computed(() =>
  intl.t(`two-step.${props.group}.description`),
)

function isGroupImmediateSubmit(group: string): boolean {
  return group === "code"
}

function isGroupPasskey(group: string): boolean {
  return group === "passkey"
}

function handleImmediateSubmitClick(event: Event) {
  event.preventDefault()

  if (!formContext) return

  if (
    props.group === "code" &&
    !formContext.getValue("identifier") &&
    props.title?.values?.address
  ) {
    formContext.setValue("identifier", props.title.values.address)
  }

  formContext.setValue("method", props.group)
  void formContext.handleSubmit()
}

// For passkey handling
const isPasskeyInitialized = ref(false)
const failedToLoad = ref(false)

const passkeyNode = computed(() => {
  if (!isGroupPasskey(props.group)) return null
  return flowContainer.value.flow.ui.nodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      ["passkey_login_trigger", "passkey_register_trigger"].includes(
        node.attributes.name,
      ),
  )
})

const onclickTrigger = computed(() => {
  if (
    passkeyNode.value &&
    isUiNodeInputAttributes(passkeyNode.value.attributes)
  ) {
    return passkeyNode.value.attributes.onclickTrigger
  }
  return undefined
})

function handlePasskeyClick() {
  if (onclickTrigger.value) {
    // Set method in reactive store
    if (formContext) {
      formContext.setValue("method", "passkey")
    }

    // Also set method in DOM for WebAuthn script form submission
    const form = document.querySelector("form")
    if (form) {
      let methodInput = form.querySelector<HTMLInputElement>(
        'input[name="method"]',
      )
      if (!methodInput) {
        methodInput = document.createElement("input")
        methodInput.type = "hidden"
        methodInput.name = "method"
        form.appendChild(methodInput)
      }
      methodInput.value = "passkey"
    }

    triggerToWindowCall(onclickTrigger.value)
  }
}

function checkInitialized() {
  if (onclickTrigger.value) {
    const fnName = onclickTrigger.value.replace(/\(.*\)$/, "")
    isPasskeyInitialized.value =
      typeof (window as unknown as Record<string, unknown>)[fnName] ===
      "function"
  }
}

function handleWebAuthnInitialized() {
  isPasskeyInitialized.value = true
}

onMounted(() => {
  if (isGroupPasskey(props.group)) {
    checkInitialized()
    window.addEventListener("oryWebAuthnInitialized", handleWebAuthnInitialized)
    setTimeout(() => {
      if (!isPasskeyInitialized.value) {
        failedToLoad.value = true
      }
    }, 5000)
  }
})

onUnmounted(() => {
  if (isGroupPasskey(props.group)) {
    window.removeEventListener(
      "oryWebAuthnInitialized",
      handleWebAuthnInitialized,
    )
  }
})

const isPasskey = computed(() => isGroupPasskey(props.group))
const isImmediateSubmit = computed(() => isGroupImmediateSubmit(props.group))

function handleClick(event: Event) {
  if (isImmediateSubmit.value) {
    handleImmediateSubmitClick(event)
  } else {
    props.onClick?.()
  }
}
</script>

<template>
  <template v-if="isPasskey">
    <button
      v-if="passkeyNode"
      type="button"
      :class="[
        'group flex w-full cursor-pointer items-start gap-3 rounded-buttons p-2 text-left',
        'bg-transparent transition-colors duration-150',
        'hover:bg-interface-background-default-primary-hover',
        'disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent',
      ]"
      :disabled="!isPasskeyInitialized || failedToLoad"
      :data-testid="`ory/form/auth-picker/${group}`"
      @click="handlePasskeyClick"
    >
      <span class="mt-1 text-interface-foreground-brand-primary">
        <Icon v-if="iconName" :name="iconName" :size="16" />
      </span>
      <span
        class="inline-flex max-w-full min-w-1 flex-1 flex-col leading-normal"
      >
        <span class="break-words text-interface-foreground-default-primary">
          {{ titleText }}
        </span>
        <span class="text-interface-foreground-default-secondary">
          {{
            failedToLoad
              ? intl.t("two-step.passkey.description.error")
              : descriptionText
          }}
        </span>
      </span>
      <span v-if="failedToLoad" class="text-black">
        <Icon name="alert-triangle" :size="20" />
      </span>
    </button>
  </template>
  <button
    v-else
    type="button"
    :class="[
      'group flex w-full cursor-pointer items-start gap-3 rounded-buttons p-2 text-left',
      'bg-transparent transition-colors duration-150',
      'hover:bg-interface-background-default-primary-hover',
      'disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent',
    ]"
    :data-testid="`ory/form/auth-picker/${group}`"
    @click="handleClick"
  >
    <span class="mt-1 text-interface-foreground-brand-primary">
      <Icon v-if="iconName" :name="iconName" :size="16" />
    </span>
    <span class="inline-flex max-w-full min-w-1 flex-1 flex-col leading-normal">
      <span class="break-words text-interface-foreground-default-primary">
        {{ titleText }}
      </span>
      <span class="text-interface-foreground-default-secondary">
        {{ descriptionText }}
      </span>
    </span>
  </button>
</template>
