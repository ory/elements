// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeAttributes,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { useComponents, useOryFlow } from "../../context"
import { useIntl } from "react-intl"
import { triggerToWindowCall, useNodesGroups } from "../../util/ui"
import { Node } from "../form/nodes/node"

const getInputNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes &&
      node.attributes.name === "webauthn_register_displayname",
  )

const getTriggerNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes &&
      node.attributes.name === "webauthn_register_trigger",
  )

const getRemoveButtons = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) =>
      "name" in node.attributes && node.attributes.name === "webauthn_remove",
  )

const getRegisterNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes && node.attributes.name === "webauthn_register",
  )

interface HeadlessSettingsWebauthnProps {
  nodes: UiNode[]
}

export function OrySettingsWebauthn({ nodes }: HeadlessSettingsWebauthnProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { flow } = useOryFlow()
  const { groups } = useNodesGroups(flow.ui.nodes)

  const triggerButton = getTriggerNode(nodes)
  const inputNode = getInputNode(nodes)
  const removeButtons = getRemoveButtons(nodes)
  const registerNode = getRegisterNode(nodes)

  if (!inputNode || !triggerButton) {
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

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage({ id: "settings.webauthn.title" })}
        description={intl.formatMessage({
          id: "settings.webauthn.description",
        })}
      >
        {groups.default?.map((node, i) => (
          <Node key={`webauthn-default-${i}`} node={node} />
        ))}
        <Form.WebauthnSettings
          nameInput={inputNode}
          triggerButton={{
            ...triggerButton,
            attributes: triggerAttributes as UiNodeAttributes,
            onClick: onTriggerClick,
          }}
          removeButtons={removeButtons}
        />
        {registerNode && <Node node={registerNode} />}
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({ id: "settings.webauthn.info" })}
      ></Card.SettingsSectionFooter>
    </>
  )
}
