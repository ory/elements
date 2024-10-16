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

const getScriptNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "id" in node.attributes && node.attributes.id === "webauthn_script",
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
  const { Settings } = useComponents()
  const intl = useIntl()
  const { flow } = useOryFlow()
  const { groups } = useNodesGroups(flow.ui.nodes)

  const triggerButton = getTriggerNode(nodes)
  const inputNode = getInputNode(nodes)
  const removeButtons = getRemoveButtons(nodes)
  const scriptNode = getScriptNode(nodes)
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
      <Settings.SectionContent
        title={intl.formatMessage({ id: "settings.webauthn.title" })}
        description={intl.formatMessage({
          id: "settings.webauthn.description",
        })}
      >
        {groups.default?.map((node, i) => (
          <Node key={`webauthn-default-${i}`} node={node} />
        ))}
        {scriptNode && <Node node={scriptNode} />}
        {registerNode && <Node node={registerNode} />}
        <Settings.Webauthn
          nameInput={inputNode}
          triggerButton={{
            ...triggerButton,
            attributes: triggerAttributes as UiNodeAttributes,
            onClick: onTriggerClick,
          }}
          removeButtons={removeButtons}
        />
      </Settings.SectionContent>
      <Settings.SectionFooter>
        <span>{intl.formatMessage({ id: "settings.webauthn.info" })}</span>
      </Settings.SectionFooter>
    </>
  )
}
