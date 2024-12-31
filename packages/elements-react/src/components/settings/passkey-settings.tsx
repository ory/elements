// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeAttributes,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useComponents } from "../../context"
import { triggerToWindowCall } from "../../util/ui"
import { Node } from "../form/nodes/node"

const getTriggerNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes &&
      node.attributes.name === "passkey_register_trigger",
  )

const getSettingsNodes = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) =>
      "name" in node.attributes &&
      (node.attributes.name === "passkey_settings_register" ||
        node.attributes.name === "passkey_create_data"),
  )

const getRemoveNodes = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) =>
      "name" in node.attributes && node.attributes.name === "passkey_remove",
  )

interface HeadlessSettingsPasskeyProps {
  nodes: UiNode[]
}

export function OrySettingsPasskey({ nodes }: HeadlessSettingsPasskeyProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { setValue } = useFormContext()

  const triggerButton = getTriggerNode(nodes)
  const settingsNodes = getSettingsNodes(nodes)
  const removeNodes = getRemoveNodes(nodes)

  if (!triggerButton) {
    return null
  }

  const {
    onclick: _onClick,
    onclickTrigger,
    ...triggerAttributes
  } = triggerButton.attributes as UiNodeInputAttributes

  const onTriggerClick = () => {
    triggerToWindowCall(onclickTrigger)
  }

  const removePasskeyHandler = (value: string) => {
    return () => {
      setValue("passkey_remove", value)
      setValue("method", "passkey")
    }
  }

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage({ id: "settings.passkey.title" })}
        description={intl.formatMessage({
          id: "settings.passkey.description",
        })}
      >
        {settingsNodes.map((node, i) => (
          <Node key={`passkey-settings-nodes-${i}`} node={node} />
        ))}
        <Form.PasskeySettings
          triggerButton={{
            ...triggerButton,
            attributes: triggerAttributes as UiNodeAttributes,
            onClick: onTriggerClick,
          }}
          removeButtons={removeNodes.map((node) => ({
            ...node,
            onClick:
              node.attributes.node_type === "input"
                ? removePasskeyHandler(node.attributes.value as string)
                : () => {},
          }))}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({ id: "settings.passkey.info" })}
      ></Card.SettingsSectionFooter>
    </>
  )
}
