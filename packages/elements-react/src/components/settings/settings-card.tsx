// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
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
import { getNodeId } from "@ory/client-fetch/src/contrib/ui"

type SettingsSectionProps = {
  group: UiNodeGroupEnum
  nodes: UiNode[]
}

function SettingsSectionContent({ group, nodes }: SettingsSectionProps) {
  const { Card } = useComponents()
  const intl = useIntl()
  const { flow } = useOryFlow()
  const groupedNodes = useNodesGroups(flow.ui.nodes, {
    // Script nodes are already handled by the parent component.
    omit: ["script"],
  })

  if (group === UiNodeGroupEnum.Totp) {
    return (
      <OryFormSection
        nodes={groupedNodes.groups.totp}
        data-testid="ory/screen/settings/group/totp"
      >
        <OrySettingsTotp nodes={groupedNodes.groups.totp ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.LookupSecret) {
    return (
      <OryFormSection
        nodes={groupedNodes.groups.lookup_secret}
        data-testid="ory/screen/settings/group/lookup_secret"
      >
        <OrySettingsRecoveryCodes
          nodes={groupedNodes.groups.lookup_secret ?? []}
        />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Oidc) {
    return (
      <OryFormSection
        nodes={groupedNodes.groups.oidc}
        data-testid="ory/screen/settings/group/oidc"
      >
        <OrySettingsOidc nodes={groupedNodes.groups.oidc ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Webauthn) {
    return (
      <OryFormSection
        nodes={groupedNodes.groups.webauthn}
        data-testid="ory/screen/settings/group/webauthn"
      >
        <OrySettingsWebauthn nodes={groupedNodes.groups.webauthn ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OryFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Passkey) {
    return (
      <OryFormSection
        nodes={groupedNodes.groups.passkey}
        data-testid="ory/screen/settings/group/passkey"
      >
        <OrySettingsPasskey nodes={groupedNodes.groups.passkey ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OryFormSection>
    )
  }

  return (
    <OryFormSection
      nodes={nodes}
      data-testid={`ory/screen/settings/group/${group}`}
    >
      <Card.SettingsSectionContent
        title={intl.formatMessage({
          id: `settings.${group}.title`,
        })}
        description={intl.formatMessage({
          id: `settings.${group}.description`,
        })}
      >
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
        {nodes
          .filter(
            (node) =>
              "type" in node.attributes && node.attributes.type !== "submit",
          )
          .map((node) => (
            <Node key={getNodeId(node)} node={node} />
          ))}
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter>
        {nodes
          .filter(
            (node) =>
              "type" in node.attributes && node.attributes.type === "submit",
          )
          .map((node) => (
            <Node key={getNodeId(node)} node={node} />
          ))}
      </Card.SettingsSectionFooter>
    </OryFormSection>
  )
}

const onlyScriptNodes = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) =>
      isUiNodeScriptAttributes(node.attributes) &&
      node.attributes.id === "webauthn_script",
  )

export function OrySettingsCard() {
  const { flow } = useOryFlow()

  // Script nodes render individually so we don't render blocks for them.
  const uniqueGroups = useNodesGroups(flow.ui.nodes, { omit: ["script"] })
  const scriptNodes = onlyScriptNodes(flow.ui.nodes)

  return (
    <>
      <OryCardValidationMessages />
      {scriptNodes.map((n) => (
        <Node node={n} key={getNodeId(n)} />
      ))}
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
