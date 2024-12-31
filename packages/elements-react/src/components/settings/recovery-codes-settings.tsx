// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"
import { useIntl } from "react-intl"
import { useComponents } from "../../context"
import { useFormContext } from "react-hook-form"

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

const getDisableNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes &&
      node.attributes.name === "lookup_secret_disable",
  )

const getConfirmNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes &&
      node.attributes.name === "lookup_secret_confirm",
  )

interface HeadlessSettingsRecoveryCodesProps {
  nodes: UiNode[]
}

export function OrySettingsRecoveryCodes({
  nodes,
}: HeadlessSettingsRecoveryCodesProps) {
  const { Card, Form, Node } = useComponents()
  const intl = useIntl()

  const codesNode = getRecoveryCodes(nodes)
  const revealNode = getRevealNode(nodes)
  const regenerateNode = getRegenerateNode(nodes)
  const disableNode = getDisableNode(nodes)
  const confirmNode = getConfirmNode(nodes)
  const { setValue } = useFormContext()

  const codesContext =
    ((codesNode?.attributes as UiNodeTextAttributes)?.text.context as {
      secrets?: { text: string }[]
    }) ?? {}
  const secrets = codesContext.secrets
    ? codesContext.secrets.map((i) => i.text)
    : []

  const onRegenerate = () => {
    if (regenerateNode?.attributes.node_type === "input") {
      setValue(regenerateNode?.attributes.name, "true")
      setValue("method", "lookup_secret")
    }
  }

  const onReveal = () => {
    if (revealNode?.attributes.node_type === "input") {
      setValue(revealNode?.attributes.name, "true")
      setValue("method", "lookup_secret")
    }
  }

  const footerNode = disableNode ?? regenerateNode ?? confirmNode

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage({ id: "settings.lookup_secret.title" })}
        description={intl.formatMessage({
          id: "settings.lookup_secret.description",
        })}
      >
        <Form.RecoveryCodesSettings
          codes={secrets}
          revealButton={revealNode}
          regnerateButton={regenerateNode}
          onRegenerate={onRegenerate}
          onReveal={onReveal}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter>
        {footerNode && (
          <Node.Button
            node={footerNode}
            attributes={footerNode.attributes as UiNodeInputAttributes}
          />
        )}
      </Card.SettingsSectionFooter>
    </>
  )
}
