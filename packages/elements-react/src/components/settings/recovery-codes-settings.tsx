// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useComponents } from "../../context"
import {
  isUiNodeInput,
  isUiNodeText,
  UiNodeInput,
  UiNodeText,
} from "../../util/utilFixSDKTypesHelper"
import { Node } from "../form/nodes/node"

const getRegenerateNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      "name" in node.attributes &&
      node.attributes.name === "lookup_secret_regenerate" &&
      isUiNodeInput(node),
  )

const getRevealNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      "name" in node.attributes &&
      node.attributes.name === "lookup_secret_reveal" &&
      isUiNodeInput(node),
  )

const getRecoveryCodes = (nodes: UiNode[]): UiNodeText | undefined =>
  nodes.find(
    (node): node is UiNodeText =>
      "id" in node.attributes &&
      node.attributes.id === "lookup_secret_codes" &&
      isUiNodeText(node),
  )

const getDisableNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      "name" in node.attributes &&
      node.attributes.name === "lookup_secret_disable" &&
      isUiNodeInput(node),
  )

const getConfirmNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      "name" in node.attributes &&
      node.attributes.name === "lookup_secret_confirm" &&
      isUiNodeInput(node),
  )

interface HeadlessSettingsRecoveryCodesProps {
  nodes: UiNode[]
}

export function OrySettingsRecoveryCodes({
  nodes,
}: HeadlessSettingsRecoveryCodesProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()

  const codesNode = getRecoveryCodes(nodes)
  const revealNode = getRevealNode(nodes)
  const regenerateNode = getRegenerateNode(nodes)
  const disableNode = getDisableNode(nodes)
  const confirmNode = getConfirmNode(nodes)
  const { setValue, formState } = useFormContext()

  const codesContext =
    (codesNode?.attributes?.text.context as {
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
          regenerateButton={regenerateNode}
          onRegenerate={onRegenerate}
          onReveal={onReveal}
          isSubmitting={formState.isSubmitting}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter>
        {footerNode && <Node node={footerNode} />}
      </Card.SettingsSectionFooter>
    </>
  )
}
