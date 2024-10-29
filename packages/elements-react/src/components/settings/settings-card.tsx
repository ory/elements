// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { useIntl } from "react-intl"
import { useComponents, useOryFlow } from "../../context"
import { useNodesGroups } from "../../util/ui"
import { OryCardValidationMessages } from "../form"
import { Node } from "../form/nodes/node"
import { OryFormSection } from "../form/section"
import { OrySettingsOidc } from "./oidc-settings"
import { OrySettingsPasskey } from "./passkey-settings"
import { OrySettingsRecoveryCodes } from "./recovery-codes-settings"
import { OrySettingsTotp } from "./totp-settings"
import { OrySettingsWebauthn } from "./webauthn-settings"

interface SettingsSectionProps {
  group: UiNodeGroupEnum
  nodes: UiNode[]
}

function SettingsSectionContent({ group, nodes }: SettingsSectionProps) {
  const { Card } = useComponents()
  const intl = useIntl()
  const { flow } = useOryFlow()
  const uniqueGroups = useNodesGroups(flow.ui.nodes)

  if (group === UiNodeGroupEnum.Totp) {
    return (
      <OryFormSection nodes={uniqueGroups.groups.totp}>
        <OrySettingsTotp nodes={uniqueGroups.groups.totp ?? []} />
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.LookupSecret) {
    return (
      <OryFormSection nodes={uniqueGroups.groups.lookup_secret}>
        <OrySettingsRecoveryCodes
          nodes={uniqueGroups.groups.lookup_secret ?? []}
        />
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Oidc) {
    return (
      <OryFormSection nodes={uniqueGroups.groups.oidc}>
        <OrySettingsOidc nodes={uniqueGroups.groups.oidc ?? []} />
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Webauthn) {
    return (
      <OryFormSection nodes={uniqueGroups.groups.webauthn}>
        <OrySettingsWebauthn nodes={uniqueGroups.groups.webauthn ?? []} />
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Passkey) {
    return (
      <OryFormSection nodes={uniqueGroups.groups.passkey}>
        <OrySettingsPasskey nodes={uniqueGroups.groups.passkey ?? []} />
      </OryFormSection>
    )
  }

  return (
    <OryFormSection nodes={nodes}>
      <Card.SettingsSectionContent
        title={intl.formatMessage({
          id: `settings.${group}.title`,
        })}
        description={intl.formatMessage({
          id: `settings.${group}.description`,
        })}
      >
        {uniqueGroups.groups.default?.map((node, k) => (
          <Node key={k} node={node} />
        ))}
        {nodes
          .filter(
            (node) =>
              "type" in node.attributes && node.attributes.type !== "submit",
          )
          .map((node, k) => (
            <Node key={k} node={node} />
          ))}
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter>
        {nodes
          .filter(
            (node) =>
              "type" in node.attributes && node.attributes.type === "submit",
          )
          .map((node, k) => (
            <Node key={k} node={node} />
          ))}
      </Card.SettingsSectionFooter>
    </OryFormSection>
  )
}

export function OrySettingsCard() {
  const { flow } = useOryFlow()
  const uniqueGroups = useNodesGroups(flow.ui.nodes)

  return (
    <>
      <OryCardValidationMessages />
      {uniqueGroups.entries.map(([group, nodes]) => {
        if (group === UiNodeGroupEnum.Default) {
          return null
        }

        return (
          <SettingsSectionContent key={group} group={group} nodes={nodes} />
        )
      })}
    </>
  )
}
