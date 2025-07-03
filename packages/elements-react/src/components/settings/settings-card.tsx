// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  getNodeId,
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import { useEffect } from "react"
import { useIntl } from "react-intl"
import { Toaster } from "sonner"
import { useComponents, useOryFlow } from "../../context"
import { showToast } from "../../util/showToast"
import { useNodesGroups } from "../../util/ui"
import { Node } from "../form/nodes/node"
import { OrySettingsFormSection } from "../form/settings-section"
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
  const groupedNodes = useNodesGroups(flow.ui.nodes, {
    // Script nodes are already handled by the parent component.
    omit: ["script"],
  })

  if (group === UiNodeGroupEnum.Totp) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.totp}
        data-testid="ory/screen/settings/group/totp"
      >
        <OrySettingsTotp nodes={groupedNodes.groups.totp ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  if (group === UiNodeGroupEnum.LookupSecret) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.lookup_secret}
        data-testid="ory/screen/settings/group/lookup_secret"
      >
        <OrySettingsRecoveryCodes
          nodes={groupedNodes.groups.lookup_secret ?? []}
        />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Oidc) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.oidc}
        data-testid="ory/screen/settings/group/oidc"
      >
        <OrySettingsOidc nodes={groupedNodes.groups.oidc ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Webauthn) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.webauthn}
        data-testid="ory/screen/settings/group/webauthn"
      >
        <OrySettingsWebauthn nodes={groupedNodes.groups.webauthn ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Passkey) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.passkey}
        data-testid="ory/screen/settings/group/passkey"
      >
        <OrySettingsPasskey nodes={groupedNodes.groups.passkey ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  return (
    <OrySettingsFormSection
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
    </OrySettingsFormSection>
  )
}

const onlyScriptNodes = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) =>
      isUiNodeScriptAttributes(node.attributes) &&
      node.attributes.id === "webauthn_script",
  )

/**
 * Renders the Ory Settings Card component.
 *
 * This component is used to display the settings flow for the user.
 * It utilizes the `useOryFlow` hook to access the current flow and renders the nodes with components
 * provided by the Ory Elements context.
 *
 * @returns The Ory Settings Card component that renders the settings flow.
 * @group Components
 */
export function OrySettingsCard() {
  const { flow } = useOryFlow()

  // Script nodes render individually so we don't render blocks for them.
  const uniqueGroups = useNodesGroups(flow.ui.nodes, { omit: ["script"] })
  const scriptNodes = onlyScriptNodes(flow.ui.nodes)

  return (
    <>
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
      <SettingsMessageToaster />
    </>
  )
}

function SettingsMessageToaster() {
  const { flow } = useOryFlow()
  const { Message } = useComponents()

  useEffect(() => {
    if (!flow.ui.messages) {
      return
    }
    flow.ui.messages.forEach((message) => {
      showToast(
        {
          message,
        },
        Message.Toast,
      )
    })
  }, [flow.ui.messages, Message.Toast])

  return <Toaster />
}
