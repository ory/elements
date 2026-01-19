<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, ref, watch, useSlots } from "vue"
import {
  FlowType,
  UiNodeGroupEnum,
  isUiNodeInputAttributes,
  getNodeId,
} from "@ory/client-fetch"
import { useOryFlow } from "../../../../composables/useOryFlow"
import { useOryConfig } from "../../../../composables/useOryConfig"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { useHasSlotContent } from "../../../../composables/useSlotContent"
import { useComponents } from "../../../../composables/useComponents"
import { initFlowUrl, restartFlowUrl } from "../../utils/url"
import {
  getNodeGroupsWithVisibleNodes,
  nodesToAuthMethodGroups,
  findNode,
} from "../../../../util/ui"
import { getLogoutUrl } from "../../../../util/getLogoutUrl"
import { isConsentFlow, type ConsentFlow } from "../../../../util/flowContainer"

const { flowContainer, formState, flowType, dispatchFormState } = useOryFlow()
const config = useOryConfig()
const intl = useOryIntl()
const slots = useSlots()
const { Node } = useComponents()

const t = (key: string) => String(intl.t(key))

const logoutUrl = ref<string | null>(null)
const didLoadLogout = ref(false)
const didAttemptLogout = ref(false)

function getAuthMethods(
  visibleGroups: Partial<Record<UiNodeGroupEnum, unknown[]>>,
): UiNodeGroupEnum[] {
  const excludedGroups: UiNodeGroupEnum[] = [
    UiNodeGroupEnum.Oidc,
    UiNodeGroupEnum.Saml,
    UiNodeGroupEnum.Default,
    UiNodeGroupEnum.IdentifierFirst,
    UiNodeGroupEnum.Profile,
    UiNodeGroupEnum.Captcha,
  ]

  return Object.values(UiNodeGroupEnum).filter(
    (group) => visibleGroups[group]?.length && !excludedGroups.includes(group),
  )
}

function shouldShowLogoutButton(
  flowTypeValue: FlowType,
  flow: { requested_aal?: string; refresh?: boolean; active?: string },
  formStateValue: { current: string },
  authMethods: string[],
): boolean {
  if (flowTypeValue !== FlowType.Login) {
    return false
  }

  if (flow.refresh) {
    return true
  }

  if (flow.requested_aal === "aal2") {
    if (formStateValue.current === "select_method") {
      return true
    }
    if (formStateValue.current === "method_active" && flow.active === "code") {
      return true
    }
    if (
      formStateValue.current === "method_active" &&
      authMethods.length === 1
    ) {
      return true
    }
  }
  return false
}

const authMethods = computed(() => {
  const visibleGroups = getNodeGroupsWithVisibleNodes(
    flowContainer.value.flow.ui.nodes,
  )
  return getAuthMethods(visibleGroups)
})

const authMethodsForLogout = computed(() =>
  nodesToAuthMethodGroups(flowContainer.value.flow.ui.nodes),
)

const showLogoutButton = computed(() => {
  const flow = flowContainer.value.flow as {
    requested_aal?: string
    refresh?: boolean
    active?: string
  }
  return shouldShowLogoutButton(
    flowType.value,
    flow,
    formState.value,
    authMethodsForLogout.value,
  )
})

// Only fetch logout URL when the logout button should be shown
watch(
  showLogoutButton,
  async (shouldShow) => {
    if (shouldShow && !didAttemptLogout.value) {
      didAttemptLogout.value = true
      try {
        const url = await getLogoutUrl({ sdkUrl: config.sdk.url })
        logoutUrl.value = url
      } catch {
        // Ignore errors, fallback URL will be used
      }
      didLoadLogout.value = true
    }
  },
  { immediate: true },
)

const fallbackUrl = computed(() => {
  const flow = flowContainer.value.flow
  let returnTo = config.project?.default_redirect_url
  if (flow.return_to) {
    returnTo = flow.return_to
  }
  if (!returnTo) {
    returnTo = restartFlowUrl(
      flow,
      `${config.sdk.url}/self-service/${FlowType.Login}/browser`,
    )
  }
  return returnTo
})

const showChooseMethod = computed(() => {
  return (
    formState.value.current === "method_active" &&
    authMethods.value.length > 1 &&
    !showLogoutButton.value &&
    (flowType.value === FlowType.Login ||
      flowType.value === FlowType.Registration)
  )
})

const showGoBackLink = computed(() => {
  if (flowType.value !== FlowType.Login) {
    return false
  }
  if (showLogoutButton.value) {
    return false
  }
  return (
    authMethodsForLogout.value.length === 1 &&
    authMethodsForLogout.value[0] === "code" &&
    formState.value.current === "method_active"
  )
})

const footerContent = computed(() => {
  const flow = flowContainer.value.flow

  if (
    flowType.value === FlowType.Login &&
    !showLogoutButton.value &&
    formState.value.current === "provide_identifier" &&
    config.project?.registration_enabled !== false
  ) {
    return {
      labelText: t("login.registration-label"),
      linkText: t("login.registration-button"),
      href: initFlowUrl(config.sdk.url, "registration", flow),
      testId: "ory/screen/login/action/register",
    }
  }

  if (
    flowType.value === FlowType.Registration &&
    formState.value.current !== "method_active"
  ) {
    return {
      labelText: t("registration.login-label"),
      linkText: t("registration.login-button"),
      href: initFlowUrl(config.sdk.url, "login", flow),
      testId: "ory/screen/registration/action/login",
    }
  }

  return null
})

const hasRealSlotContent = useHasSlotContent(slots)

const hasFooterContent = computed(
  () => showLogoutButton.value || showChooseMethod.value || showGoBackLink.value || footerContent.value,
)

const logoutHref = computed(() => logoutUrl.value || fallbackUrl.value)

const logoutLinkText = computed(() =>
  t(
    !didLoadLogout.value || logoutUrl.value
      ? "login.logout-button"
      : "login.2fa.go-back.link",
  ),
)

function handleChooseAnotherMethod() {
  dispatchFormState({ type: "action_clear_active_method" })
}

const chooseMethodTestId = computed(() =>
  flowType.value === FlowType.Registration
    ? "ory/screen/registration/action/selectMethod"
    : "ory/screen/login/mfa/action/selectMethod",
)

const chooseMethodText = computed(() =>
  flowType.value === FlowType.Registration
    ? t("card.footer.select-another-method")
    : t("login.2fa.method.go-back"),
)

const isConsentFlowType = computed(
  () =>
    flowType.value === FlowType.OAuth2Consent &&
    isConsentFlow(flowContainer.value.flow),
)

const consentFlow = computed(() =>
  isConsentFlowType.value ? (flowContainer.value.flow as ConsentFlow) : null,
)

const consentClientName = computed(
  () => consentFlow.value?.consent_request?.client?.client_name ?? "",
)

const consentRememberNode = computed(() => {
  if (!consentFlow.value) return null
  return findNode(consentFlow.value.ui.nodes, {
    group: "oauth2_consent",
    node_type: "input",
    name: "remember",
  })
})

const consentSubmitNodes = computed(() => {
  if (!consentFlow.value) return []
  return consentFlow.value.ui.nodes.filter(
    (n) =>
      isUiNodeInputAttributes(n.attributes) &&
      n.attributes.type === "submit" &&
      n.group === "oauth2_consent",
  )
})
</script>

<template>
  <footer v-if="hasRealSlotContent" class="antialiased">
    <slot />
  </footer>
  <div v-else-if="isConsentFlowType" class="flex flex-col gap-8">
    <div>
      <p
        class="leading-normal font-medium text-interface-foreground-default-secondary"
      >
        Make sure you trust {{ consentClientName }}
      </p>
      <p class="leading-normal text-interface-foreground-default-secondary">
        You may be sharing sensitive information with this site or application.
      </p>
    </div>
    <component
      v-if="consentRememberNode"
      :is="Node.Checkbox"
      :node="consentRememberNode"
      :attributes="consentRememberNode.attributes"
    />
    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <component
        v-for="node in consentSubmitNodes"
        :key="getNodeId(node)"
        :is="Node.Button"
        :node="node"
        :attributes="node.attributes"
      />
    </div>
    <p class="text-sm">
      <span class="text-interface-foreground-default-tertiary">
        Authorizing will redirect to {{ consentClientName }}
      </span>
    </p>
  </div>
  <template v-else-if="hasFooterContent">
    <span
      v-if="showLogoutButton"
      class="leading-normal font-normal text-interface-foreground-default-primary antialiased"
    >
      {{ t("login.2fa.go-back") }}
      {{ " " }}
      <a
        class="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
        :href="logoutHref"
        :data-testid="
          didLoadLogout ? 'ory/screen/login/action/logout' : undefined
        "
      >
        {{ logoutLinkText }}
      </a>
    </span>
    <span
      v-if="showChooseMethod"
      class="leading-normal font-normal text-interface-foreground-default-primary antialiased"
    >
      <button
        class="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
        :data-testid="chooseMethodTestId"
        type="button"
        @click="handleChooseAnotherMethod"
      >
        {{ chooseMethodText }}
      </button>
    </span>
    <span
      v-if="showGoBackLink"
      class="leading-normal font-normal text-interface-foreground-default-primary antialiased"
    >
      <a
        class="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
        :href="fallbackUrl"
        data-testid="ory/screen/login/action/cancel"
      >
        {{ t("login.2fa.go-back.link") }}
      </a>
    </span>
    <span
      v-if="footerContent"
      class="leading-normal font-normal text-interface-foreground-default-primary antialiased"
    >
      {{ footerContent.labelText }}
      {{ " " }}
      <a
        class="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
        :href="footerContent.href"
        :data-testid="footerContent.testId"
      >
        {{ footerContent.linkText }}
      </a>
    </span>
  </template>
</template>
