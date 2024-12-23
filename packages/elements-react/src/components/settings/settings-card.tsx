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

type SettingsSectionProps = {
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
      <OryFormSection
        nodes={uniqueGroups.groups.totp}
        data-testid="totp-settings"
      >
        <OrySettingsTotp nodes={uniqueGroups.groups.totp ?? []} />
        {uniqueGroups.groups.default?.map((node, k) => (
          <Node key={k} node={node} />
        ))}
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.LookupSecret) {
    return (
      <OryFormSection
        nodes={uniqueGroups.groups.lookup_secret}
        data-testid="recovery-codes-settings"
      >
        <OrySettingsRecoveryCodes
          nodes={uniqueGroups.groups.lookup_secret ?? []}
        />
        {uniqueGroups.groups.default?.map((node, k) => (
          <Node key={k} node={node} />
        ))}
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Oidc) {
    return (
      <OryFormSection
        nodes={uniqueGroups.groups.oidc}
        data-testid="oidc-settings"
      >
        <OrySettingsOidc nodes={uniqueGroups.groups.oidc ?? []} />
        {uniqueGroups.groups.default?.map((node, k) => (
          <Node key={k} node={node} />
        ))}
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Webauthn) {
    return (
      <OryFormSection
        nodes={uniqueGroups.groups.webauthn}
        data-testid="webauthn-settings"
      >
        <OrySettingsWebauthn nodes={uniqueGroups.groups.webauthn ?? []} />
        {uniqueGroups.groups.default?.map((node, k) => (
          <Node key={k} node={node} />
        ))}
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Passkey) {
    return (
      <OryFormSection
        nodes={uniqueGroups.groups.passkey}
        data-testid="passkey-settings"
      >
        <OrySettingsPasskey nodes={uniqueGroups.groups.passkey ?? []} />
        {uniqueGroups.groups.default?.map((node, k) => (
          <Node key={k} node={node} />
        ))}
      </OryFormSection>
    )
  }

  return (
    <OryFormSection nodes={nodes} data-testid={`${group}-settings`}>
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

const getScriptNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "id" in node.attributes && node.attributes.id === "webauthn_script",
  )

export function OrySettingsCard() {
  const { flow } = useOryFlow()
  const uniqueGroups = useNodesGroups(flow.ui.nodes)
  const scriptNode = getScriptNode(flow.ui.nodes)

  return (
    <>
      <OryCardValidationMessages />
      {scriptNode && <Node node={scriptNode} />}
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
