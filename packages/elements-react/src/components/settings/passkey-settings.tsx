import {
  UiNode,
  UiNodeAttributes,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { useComponents, useOryFlow } from "../../context"
import { useIntl } from "react-intl"
import { triggerToWindowCall, useNodesGroups } from "../../util/ui"
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

interface OrySettingsPasskeyProps {
  nodes: UiNode[]
}

export function OrySettingsPasskey({ nodes }: OrySettingsPasskeyProps) {
  const { Settings } = useComponents()
  const intl = useIntl()
  const { flow } = useOryFlow()
  const { groups } = useNodesGroups(flow.ui.nodes)

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

  return (
    <>
      <Settings.SectionContent
        title={intl.formatMessage({ id: "settings.passkey.title" })}
        description={intl.formatMessage({
          id: "settings.passkey.description",
        })}
      >
        {groups.default?.map((node, i) => (
          <Node key={`passkey-default-nodes-${i}`} node={node} />
        ))}
        {settingsNodes.map((node, i) => (
          <Node key={`passkey-settings-nodes-${i}`} node={node} />
        ))}
        <Settings.Passkey
          triggerButton={{
            ...triggerButton,
            attributes: triggerAttributes as UiNodeAttributes,
            onClick: onTriggerClick,
          }}
          removeButtons={removeNodes}
        />
      </Settings.SectionContent>
      <Settings.SectionFooter>
        <span>{intl.formatMessage({ id: "settings.passkey.info" })}</span>
      </Settings.SectionFooter>
    </>
  )
}
