<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, ref } from "vue"
import {
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
  isUiNodeImageAttributes,
  isUiNodeAnchorAttributes,
  isUiNodeScriptAttributes,
} from "@ory/client-fetch"
import { useComponents } from "../../../composables/useComponents"
import { useOryFormContext } from "../../../composables/useOryFormContext"
import { triggerToWindowCall } from "../../../util/ui"

const props = defineProps<{
  node: UiNode
}>()

const components = useComponents()
const { values, setValue, isSubmitting } = useOryFormContext()

/**
 * Per-button clicked state for showing spinner only on the clicked button.
 * Uses 100ms debounce to fix Safari canceling form events on state updates.
 */
const buttonClicked = ref(false)
let clickDebounceTimeout: ReturnType<typeof setTimeout> | null = null

function setButtonClickedDebounced() {
  if (clickDebounceTimeout) {
    clearTimeout(clickDebounceTimeout)
  }
  clickDebounceTimeout = setTimeout(() => {
    buttonClicked.value = true
  }, 100)
}

watch(isSubmitting, (submitting) => {
  if (!submitting) {
    buttonClicked.value = false
  }
})

function ensureMethodInputInForm(methodValue: string) {
  const form = document.querySelector("form")
  if (!form) return

  let methodInput = form.querySelector<HTMLInputElement>('input[name="method"]')
  if (!methodInput) {
    methodInput = document.createElement("input")
    methodInput.type = "hidden"
    methodInput.name = "method"
    form.appendChild(methodInput)
  }
  methodInput.value = methodValue
}

/** Type-safe accessor for input attributes */
const inputAttrs = computed(() =>
  isUiNodeInputAttributes(props.node.attributes) ? props.node.attributes : null,
)

let scriptElement: HTMLScriptElement | null = null
const hasRunOnload = ref(false)

function loadScript() {
  if (!isUiNodeScriptAttributes(props.node.attributes)) return

  const attrs = props.node.attributes
  scriptElement = document.createElement("script")
  if (attrs.src) scriptElement.src = attrs.src
  if (attrs.async) scriptElement.async = attrs.async
  if (attrs.referrerpolicy) scriptElement.referrerPolicy = attrs.referrerpolicy
  if (attrs.crossorigin) scriptElement.crossOrigin = attrs.crossorigin
  if (attrs.integrity) scriptElement.integrity = attrs.integrity
  if (attrs.type) scriptElement.type = attrs.type
  if (attrs.id) scriptElement.id = attrs.id
  if (attrs.nonce) scriptElement.nonce = attrs.nonce
  document.body.appendChild(scriptElement)
}

function cleanupScript() {
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement)
    scriptElement = null
  }
}

const ignoredScriptGroups = ["captcha"]

onMounted(() => {
  if (
    isUiNodeScriptAttributes(props.node.attributes) &&
    !ignoredScriptGroups.includes(props.node.group)
  ) {
    loadScript()
  }

  // Handle onloadTrigger for passkey autocomplete initialization
  if (isUiNodeInputAttributes(props.node.attributes)) {
    const attrs = props.node.attributes as UiNodeInputAttributes & {
      onloadTrigger?: string
    }
    if (!hasRunOnload.value && attrs.onloadTrigger) {
      hasRunOnload.value = true
      triggerToWindowCall(attrs.onloadTrigger)
    }
  }
})

onUnmounted(() => {
  if (clickDebounceTimeout) {
    clearTimeout(clickDebounceTimeout)
  }
  cleanupScript()
})

watch(
  () => props.node,
  () => {
    if (
      isUiNodeScriptAttributes(props.node.attributes) &&
      !ignoredScriptGroups.includes(props.node.group)
    ) {
      cleanupScript()
      loadScript()
    }
  },
)

function handleButtonClick(_e: Event) {
  const { node } = props
  const attributes = node.attributes
  if (!isUiNodeInputAttributes(attributes)) return

  if (attributes.name) {
    setValue(attributes.name, attributes.value as string)
  }

  setButtonClickedDebounced()

  if (attributes.onclickTrigger) {
    const methodValue =
      node.group === "webauthn" || node.group === "passkey"
        ? node.group
        : undefined
    if (methodValue) {
      setValue("method", methodValue)
      ensureMethodInputInForm(methodValue)
    }
    triggerToWindowCall(attributes.onclickTrigger)
  }
}

function handleSsoClick(_e: Event) {
  const attributes = props.node.attributes
  if (isUiNodeInputAttributes(attributes)) {
    setValue("method", attributes.value as string)
  }
  setButtonClickedDebounced()
}

/**
 * Handles grant_scope checkbox changes by adding/removing scopes from the array.
 */
function handleGrantScopeChange(checked: boolean, scopeValue: string) {
  const currentScopes = values.grant_scope
  if (Array.isArray(currentScopes)) {
    if (checked) {
      // Add scope to array (with deduplication)
      setValue(
        "grant_scope",
        Array.from(new Set([...currentScopes, scopeValue])),
      )
    } else {
      // Remove scope from array
      setValue(
        "grant_scope",
        currentScopes.filter((scope: string) => scope !== scopeValue),
      )
    }
  } else if (checked) {
    // Initialize array with this scope
    setValue("grant_scope", [scopeValue])
  }
}

/**
 * Checks if a scope is currently selected in grant_scope array.
 */
function isScopeSelected(scopeValue: string): boolean {
  const currentScopes = values.grant_scope
  return Array.isArray(currentScopes) && currentScopes.includes(scopeValue)
}
</script>

<template>
  <component
    v-if="node.group === UiNodeGroupEnum.Captcha"
    :is="components.Node.Captcha"
    :node="node"
  />

  <template v-else-if="isUiNodeScriptAttributes(node.attributes)" />

  <component
    v-else-if="isUiNodeAnchorAttributes(node.attributes)"
    :is="components.Node.Anchor"
    :node="node"
    :attributes="node.attributes"
  />

  <component
    v-else-if="isUiNodeImageAttributes(node.attributes)"
    :is="components.Node.Image"
    :node="node"
    :attributes="node.attributes"
  />

  <component
    v-else-if="isUiNodeTextAttributes(node.attributes)"
    :is="components.Node.Text"
    :node="node"
    :attributes="node.attributes"
  />

  <template v-else-if="inputAttrs">
    <input
      v-if="inputAttrs.type === 'hidden'"
      type="hidden"
      :name="inputAttrs.name"
      :value="inputAttrs.value"
    />

    <template
      v-else-if="inputAttrs.type === 'submit' || inputAttrs.type === 'button'"
    >
      <template
        v-if="
          node.meta.label?.id !== 1070008 &&
          inputAttrs.name !== 'screen' &&
          node.group !== 'oauth2_consent'
        "
      >
        <component
          v-if="
            node.group === UiNodeGroupEnum.Oidc ||
            node.group === UiNodeGroupEnum.Saml
          "
          :is="components.Node.SsoButton"
          :node="node"
          :attributes="inputAttrs"
          :provider="inputAttrs.value as string"
          :is-submitting="buttonClicked"
          :is-form-submitting="isSubmitting"
          @click="handleSsoClick"
        />
        <component
          v-else
          :is="components.Node.Button"
          :node="node"
          :attributes="inputAttrs"
          :is-submitting="buttonClicked"
          :is-form-submitting="isSubmitting"
          @click="handleButtonClick"
        />
      </template>
    </template>

    <template v-else-if="inputAttrs?.type === 'checkbox'">
      <component
        v-if="
          node.group === 'oauth2_consent' && inputAttrs.name === 'grant_scope'
        "
        :is="components.Node.ConsentScopeCheckbox"
        :node="node"
        :attributes="inputAttrs"
        :model-value="isScopeSelected(inputAttrs.value as string)"
        @change="
          (checked: boolean) =>
            handleGrantScopeChange(checked, inputAttrs!.value as string)
        "
      />
      <template
        v-else-if="
          node.group === 'oauth2_consent' && inputAttrs.name === 'remember'
        "
      />
      <component
        v-else
        :is="components.Node.Checkbox"
        :node="node"
        :attributes="inputAttrs"
        :model-value="values[inputAttrs.name] === true"
        @change="(checked: boolean) => setValue(inputAttrs!.name, checked)"
      />
    </template>

    <component
      v-else-if="
        inputAttrs?.name === 'code' || inputAttrs?.name === 'totp_code'
      "
      :is="components.Node.Label"
      :node="node"
      :attributes="inputAttrs"
    >
      <component
        :is="components.Node.CodeInput"
        :node="node"
        :attributes="inputAttrs"
        :model-value="values[inputAttrs.name] as string | number | undefined"
        @change="(value: string | number) => setValue(inputAttrs!.name, value)"
        @blur="() => {}"
      />
    </component>

    <component
      v-else-if="inputAttrs"
      :is="components.Node.Label"
      :node="node"
      :attributes="inputAttrs"
    >
      <component
        :is="components.Node.Input"
        :node="node"
        :attributes="inputAttrs"
        :model-value="values[inputAttrs.name] as string | number | undefined"
        @change="(value: string | number) => setValue(inputAttrs!.name, value)"
        @blur="() => {}"
      />
    </component>
  </template>
</template>
