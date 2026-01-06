<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, ref, watch, useSlots } from "vue"
import { FlowType, UiNodeGroupEnum } from "@ory/client-fetch"
import { useOryFlow } from "../../../../composables/useOryFlow"
import { useOryConfig } from "../../../../composables/useOryConfig"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { useHasSlotContent } from "../../../../composables/useSlotContent"
import { initFlowUrl, restartFlowUrl } from "../../utils/url"
import {
  getNodeGroupsWithVisibleNodes,
  nodesToAuthMethodGroups,
} from "../../../../util/ui"
import { getLogoutUrl } from "../../../../util/getLogoutUrl"

const { flowContainer, formState, flowType, dispatchFormState } = useOryFlow()
const config = useOryConfig()
const intl = useOryIntl()
const slots = useSlots()

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

const footerContent = computed(() => {
  const flow = flowContainer.value.flow

  if (flowType.value === FlowType.Login) {
    if (
      formState.value.current === "provide_identifier" &&
      config.project?.registration_enabled !== false
    ) {
      return {
        type: "login",
        labelText: t("login.registration-label"),
        linkText: t("login.registration-button"),
        href: initFlowUrl(config.sdk.url, "registration", flow),
        testId: "ory/screen/login/action/register",
      }
    }
  }

  if (flowType.value === FlowType.Registration) {
    if (formState.value.current !== "method_active") {
      return {
        type: "registration",
        labelText: t("registration.login-label"),
        linkText: t("registration.login-button"),
        href: initFlowUrl(config.sdk.url, "login", flow),
        testId: "ory/screen/registration/action/login",
      }
    }
  }

  return null
})

const hasRealSlotContent = useHasSlotContent(slots)

const hasFooterContent = computed(
  () => showLogoutButton.value || showChooseMethod.value || footerContent.value,
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
</script>

<template>
  <footer v-if="hasRealSlotContent" class="antialiased">
    <slot />
  </footer>
  <footer v-else-if="hasFooterContent" class="flex flex-col gap-2 antialiased">
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
    <button
      v-if="showChooseMethod"
      class="cursor-pointer text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
      data-testid="ory/screen/login/mfa/action/selectMethod"
      @click="handleChooseAnotherMethod"
    >
      {{ t("login.2fa.method.go-back") }}
    </button>
    <span
      v-if="footerContent"
      class="leading-normal font-normal text-interface-foreground-default-primary"
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
  </footer>
</template>
