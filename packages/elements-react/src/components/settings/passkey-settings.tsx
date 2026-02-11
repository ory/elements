// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useComponents } from "../../context"
import { triggerToWindowCall } from "../../util/ui"
import { isUiNodeInput, UiNodeInput } from "../../util/utilFixSDKTypesHelper"
import { Node } from "../form/nodes/node"
import {
  settingsCardDescriptions,
  settingsCardTitles,
} from "../../util/i18n/settingsCardMessages"

const getTriggerNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes
    .filter(isUiNodeInput)
    .find(
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

const getRemoveNodes = (nodes: UiNode[]): UiNodeInput[] =>
  nodes
    .filter(
      (node) =>
        "name" in node.attributes && node.attributes.name === "passkey_remove",
    )
    .filter(isUiNodeInput)

interface HeadlessSettingsPasskeyProps {
  nodes: UiNode[]
}

export function OrySettingsPasskey({ nodes }: HeadlessSettingsPasskeyProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { setValue, formState } = useFormContext()

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
        title={intl.formatMessage(settingsCardTitles.passkey)}
        description={intl.formatMessage(settingsCardDescriptions.passkey)}
      >
        {settingsNodes.map((node, i) => (
          <Node key={`passkey-settings-nodes-${i}`} node={node} />
        ))}
        <Form.PasskeySettings
          isSubmitting={formState.isSubmitting}
          triggerButton={{
            ...triggerButton,
            onClick: onTriggerClick,
            buttonProps: {
              name: triggerAttributes.name,
              value: triggerAttributes.value,
              onClick: onTriggerClick,
              type: "button",
            },
          }}
          removeButtons={removeNodes.map((node) => ({
            ...node,
            onClick:
              node.attributes.node_type === "input"
                ? removePasskeyHandler(node.attributes.value as string)
                : () => {},
            buttonProps: {
              name: node.attributes.name,
              value: node.attributes.value,
              onClick:
                node.attributes.node_type === "input"
                  ? removePasskeyHandler(node.attributes.value as string)
                  : () => {},
              type: "button",
            },
          }))}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({
          id: "settings.passkey.info",
          defaultMessage: "Manage your passkey settings",
        })}
      ></Card.SettingsSectionFooter>
    </>
  )
}
