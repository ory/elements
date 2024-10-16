// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeTextAttributes } from "@ory/client-fetch"
import { useComponents } from "../../context"
import { useIntl } from "react-intl"
import { Node } from "../form/nodes/node"

const getRegenerateNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes &&
      node.attributes.name === "lookup_secret_regenerate",
  )

const getRevealNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes &&
      node.attributes.name === "lookup_secret_reveal",
  )

const getRecoveryCodes = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "id" in node.attributes && node.attributes.id === "lookup_secret_codes",
  )

interface HeadlessSettingsRecoveryCodesProps {
  nodes: UiNode[]
}

export function OrySettingsRecoveryCodes({
  nodes,
}: HeadlessSettingsRecoveryCodesProps) {
  const { Settings } = useComponents()
  const intl = useIntl()

  const codesNode = getRecoveryCodes(nodes)
  const revealNode = getRevealNode(nodes)
  const regenerateNode = getRegenerateNode(nodes)

  const codesContext =
    ((codesNode?.attributes as UiNodeTextAttributes)?.text.context as {
      secrets?: { text: string }[]
    }) ?? {}
  const secrets = codesContext.secrets
    ? codesContext.secrets.map((i) => i.text)
    : []

  return (
    <>
      <Settings.SectionContent
        title={intl.formatMessage({ id: "settings.lookup_secret.title" })}
        description={intl.formatMessage({
          id: "settings.lookup_secret.description",
        })}
      >
        <Settings.RecoveryCodes
          codes={secrets}
          revealButton={revealNode}
          regnerateButton={regenerateNode}
        />
      </Settings.SectionContent>
      <Settings.SectionFooter>
        {nodes
          .filter(
            (node) =>
              "type" in node.attributes &&
              node.attributes.type === "submit" &&
              "name" in node.attributes &&
              node.attributes.name !== "lookup_secret_reveal" &&
              node.attributes.name !== "lookup_secret_regenerate",
          )
          .map((node, k) => (
            <Node key={k} node={node} />
          ))}
      </Settings.SectionFooter>
    </>
  )
}
