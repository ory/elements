import { NodeInput } from "./input"
import {
  UiNode,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "@ory/client-fetch"
import { MouseEventHandler, ReactNode } from "react"
import { useComponents } from "../../../context/component"

export type NodeProps = {
  node: UiNode
  className?: string
  onClick?: MouseEventHandler
}

export const Node = ({ node, onClick }: NodeProps): ReactNode => {
  const Components = useComponents()

  if (isUiNodeImageAttributes(node.attributes)) {
    return <Components.Image node={node} attributes={node.attributes} />
  } else if (isUiNodeTextAttributes(node.attributes)) {
    const attrs = node.attributes
    return <Components.Text attributes={attrs} node={node} />
  } else if (isUiNodeInputAttributes(node.attributes)) {
    return (
      <NodeInput node={node} attributes={node.attributes} onClick={onClick} />
    )
  } else if (isUiNodeAnchorAttributes(node.attributes)) {
    return <Components.LinkButton attributes={node.attributes} node={node} />
  } else if (isUiNodeScriptAttributes(node.attributes)) {
    const {
      crossorigin,
      referrerpolicy,
      node_type: _nodeType,
      ...attributes
    } = node.attributes

    return (
      <script
        crossOrigin={
          crossorigin as "anonymous" | "use-credentials" | "" | undefined
        }
        referrerPolicy={referrerpolicy as React.HTMLAttributeReferrerPolicy}
        {...attributes}
      />
    )
  }
  return null
}
