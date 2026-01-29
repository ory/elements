<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import {
  getNodeId,
  UiNode,
  UiNodeGroupEnum,
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
} from "@ory/client-fetch"
import { useOryFlow } from "../../composables/useOryFlow"
import { useComponents } from "../../composables/useComponents"
import { useOryForm } from "../../composables/useOryForm"
import { provideOryForm } from "../../composables/useOryFormContext"
import { getNodeGroups } from "../../util/nodeGroups"
import { useOryIntl } from "../../composables/useOryIntl"
import OryNode from "../form/nodes/OryNode.vue"
import DefaultSettingsTotp from "../../theme/default/components/settings/DefaultSettingsTotp.vue"
import DefaultSettingsWebauthn from "../../theme/default/components/settings/DefaultSettingsWebauthn.vue"
import DefaultSettingsPasskey from "../../theme/default/components/settings/DefaultSettingsPasskey.vue"
import DefaultSettingsOidc from "../../theme/default/components/settings/DefaultSettingsOidc.vue"
import DefaultSettingsRecoveryCodes from "../../theme/default/components/settings/DefaultSettingsRecoveryCodes.vue"

const props = defineProps<{
  group: UiNodeGroupEnum
  nodes: UiNode[]
}>()

const { flowContainer } = useOryFlow()
const flow = computed(() => flowContainer.value.flow)
const components = useComponents()
const { t } = useOryIntl()

const formContext = useOryForm()
provideOryForm(formContext)

const groupedNodes = computed(() => {
  return getNodeGroups(flow.value.ui.nodes, { omit: ["script"] })
})

const nonSubmitNodes = computed(() => {
  return props.nodes.filter(
    (node) =>
      !isUiNodeInputAttributes(node.attributes) ||
      node.attributes.type !== "submit",
  )
})

const submitNodes = computed(() => {
  return props.nodes.filter(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.type === "submit",
  )
})

const defaultNodes = computed(() => {
  return groupedNodes.value.groups[UiNodeGroupEnum.Default] ?? []
})

const sectionTitle = computed(() => {
  const titleKey = `settings.${props.group}.title`
  const translated = t(titleKey)
  if (translated === titleKey) {
    return (
      props.group.charAt(0).toUpperCase() +
      props.group.slice(1).replace(/_/g, " ")
    )
  }
  return translated
})

const sectionDescription = computed(() => {
  const descKey = `settings.${props.group}.description`
  const translated = t(descKey)
  return translated === descKey ? undefined : translated
})

const hasTotpSetup = computed(() =>
  props.nodes.some(
    (node) =>
      node.attributes &&
      "id" in node.attributes &&
      node.attributes.id === "totp_qr",
  ),
)

const isTotpLinked = computed(() =>
  props.nodes.some(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name === "totp_unlink",
  ),
)

const totpFooterText = computed(() => {
  if (isTotpLinked.value) {
    return t("settings.totp.info.linked")
  }
  if (hasTotpSetup.value) {
    return t("settings.totp.info.not-linked")
  }
  return undefined
})

const totpFooterButtons = computed(() =>
  submitNodes.value.filter((node) => {
    if (!isUiNodeInputAttributes(node.attributes)) return true
    return node.attributes.name !== "totp_unlink"
  }),
)

const hasLookupSecretCodes = computed(() =>
  props.nodes.some(
    (node) =>
      isUiNodeTextAttributes(node.attributes) &&
      node.attributes.id?.startsWith("lookup_secret_codes"),
  ),
)

const lookupSecretFooterButtons = computed(() =>
  submitNodes.value.filter((node) => {
    if (!isUiNodeInputAttributes(node.attributes)) return true
    const name = node.attributes.name
    if (name === "lookup_secret_reveal") return false
    if (name === "lookup_secret_regenerate") {
      return !hasLookupSecretCodes.value
    }
    return true
  }),
)
</script>

<template>
  <component
    :is="components.Card.SettingsSection"
    :action="flow.ui.action"
    :method="flow.ui.method"
    :data-testid="`ory/screen/settings/group/${group}`"
    @submit="formContext.handleSubmit"
  >
    <template v-if="group === UiNodeGroupEnum.Totp">
      <component
        :is="components.Card.SettingsSectionContent"
        :title="sectionTitle"
        :description="sectionDescription"
      >
        <OryNode
          v-for="node in defaultNodes"
          :key="getNodeId(node)"
          :node="node"
        />
        <DefaultSettingsTotp :nodes="nodes" />
      </component>
      <component
        :is="components.Card.SettingsSectionFooter"
        :text="totpFooterText"
      >
        <OryNode
          v-for="node in totpFooterButtons"
          :key="getNodeId(node)"
          :node="node"
        />
      </component>
    </template>

    <template v-else-if="group === UiNodeGroupEnum.Webauthn">
      <component
        :is="components.Card.SettingsSectionContent"
        :title="sectionTitle"
        :description="sectionDescription"
      >
        <OryNode
          v-for="node in defaultNodes"
          :key="getNodeId(node)"
          :node="node"
        />
        <DefaultSettingsWebauthn :nodes="nodes" />
      </component>
      <component
        :is="components.Card.SettingsSectionFooter"
        text="Hardware Tokens are used for second-factor authentication or as first-factor with Passkeys"
      />
    </template>

    <template v-else-if="group === UiNodeGroupEnum.Passkey">
      <component
        :is="components.Card.SettingsSectionContent"
        :title="sectionTitle"
        :description="sectionDescription"
      >
        <OryNode
          v-for="node in defaultNodes"
          :key="getNodeId(node)"
          :node="node"
        />
        <DefaultSettingsPasskey :nodes="nodes" />
      </component>
      <component
        :is="components.Card.SettingsSectionFooter"
        :text="t('settings.passkey.info')"
      />
    </template>

    <template v-else-if="group === UiNodeGroupEnum.Oidc">
      <component
        :is="components.Card.SettingsSectionContent"
        :title="sectionTitle"
        :description="sectionDescription"
      >
        <OryNode
          v-for="node in defaultNodes"
          :key="getNodeId(node)"
          :node="node"
        />
        <DefaultSettingsOidc :nodes="nodes" />
      </component>
      <component
        :is="components.Card.SettingsSectionFooter"
        :text="t('settings.oidc.info')"
      />
    </template>

    <template v-else-if="group === UiNodeGroupEnum.LookupSecret">
      <component
        :is="components.Card.SettingsSectionContent"
        :title="sectionTitle"
        :description="sectionDescription"
      >
        <OryNode
          v-for="node in defaultNodes"
          :key="getNodeId(node)"
          :node="node"
        />
        <DefaultSettingsRecoveryCodes :nodes="nodes" />
      </component>
      <component :is="components.Card.SettingsSectionFooter">
        <OryNode
          v-for="node in lookupSecretFooterButtons"
          :key="getNodeId(node)"
          :node="node"
        />
      </component>
    </template>

    <template v-else>
      <component
        :is="components.Card.SettingsSectionContent"
        :title="sectionTitle"
        :description="sectionDescription"
      >
        <OryNode
          v-for="node in defaultNodes"
          :key="getNodeId(node)"
          :node="node"
        />
        <OryNode
          v-for="node in nonSubmitNodes"
          :key="getNodeId(node)"
          :node="node"
        />
      </component>
      <component :is="components.Card.SettingsSectionFooter">
        <OryNode
          v-for="node in submitNodes"
          :key="getNodeId(node)"
          :node="node"
        />
      </component>
    </template>
  </component>
</template>
