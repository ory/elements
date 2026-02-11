// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useComponents } from "../../context"
import {
  settingsCardDescriptions,
  settingsCardTitles,
} from "../../util/i18n/settingsCardMessages"
import { triggerToWindowCall } from "../../util/ui"
import { UiNodeInput } from "../../util/utilFixSDKTypesHelper"
import { Node } from "../form/nodes/node"

const getInputNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes &&
      node.attributes.name === "webauthn_register_displayname",
  ) as UiNodeInput | undefined

const getTriggerNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes &&
      node.attributes.name === "webauthn_register_trigger",
  ) as UiNodeInput | undefined

const getRemoveButtons = (nodes: UiNode[]): UiNodeInput[] =>
  nodes.filter(
    (node) =>
      "name" in node.attributes && node.attributes.name === "webauthn_remove",
  ) as UiNodeInput[]

const getRegisterNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes && node.attributes.name === "webauthn_register",
  ) as UiNodeInput | undefined

type HeadlessSettingsWebauthnProps = {
  nodes: UiNode[]
}

export function OrySettingsWebauthn({ nodes }: HeadlessSettingsWebauthnProps) {
  const { Card } = useComponents()
  const intl = useIntl()
  const triggerButton = getTriggerNode(nodes)
  const inputNode = getInputNode(nodes)
  const registerNode = getRegisterNode(nodes)

  if (
    !inputNode ||
    !triggerButton ||
    inputNode.attributes.node_type !== "input"
  ) {
    return null
  }

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage(settingsCardTitles.webauthn)}
        description={intl.formatMessage(settingsCardDescriptions.webauthn)}
      >
        <WebauthnForm
          inputNode={inputNode}
          nodes={nodes}
          triggerButton={triggerButton}
        />
        {registerNode && <Node node={registerNode} />}
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({
          id: "settings.webauthn.info",
          defaultMessage:
            "Hardware Tokens are used for second-factor authentication or as first-factor with Passkeys",
        })}
      ></Card.SettingsSectionFooter>
    </>
  )
}

type WebauthnFormProps = {
  inputNode: UiNodeInput
  triggerButton: UiNodeInput
  nodes: UiNode[]
}

function WebauthnForm({ inputNode, triggerButton, nodes }: WebauthnFormProps) {
  const { Form } = useComponents()
  const { setValue, formState } = useFormContext()
  const removeButtons = getRemoveButtons(nodes)

  const {
    onclick: _onClick,
    onclickTrigger,
    ...triggerAttributes
  } = triggerButton.attributes as UiNodeInputAttributes
  const onTriggerClick = () => {
    triggerToWindowCall(onclickTrigger)
  }
  const removeWebauthnKeyHandler = (value: string) => {
    return () => {
      setValue("webauthn_remove", value)
      setValue("method", "webauthn")
    }
  }
  return (
    <Form.WebauthnSettings
      isSubmitting={formState.isSubmitting}
      nameInput={inputNode}
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
      removeButtons={removeButtons.map((node) => ({
        ...node,
        onClick:
          node.attributes.node_type === "input"
            ? removeWebauthnKeyHandler(node.attributes.value as string)
            : () => {},
        buttonProps: {
          name: node.attributes.name,
          value: node.attributes.value,
          onClick:
            node.attributes.node_type === "input"
              ? removeWebauthnKeyHandler(node.attributes.value as string)
              : () => {},
          type: "submit",
        },
      }))}
    />
  )
}
