// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { NodeInput } from "./input"
import {
  UiNode,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import { MouseEventHandler, ReactNode } from "react"
import { useComponents } from "../../../context"

export type NodeProps = {
  node: UiNode
  className?: string
  onClick?: MouseEventHandler
}

export const Node = ({ node, onClick }: NodeProps): ReactNode => {
  const { Node } = useComponents()

  // Special case for CAPTCHA handling as we need to render a different component
  if (node.group === UiNodeGroupEnum.Captcha) {
    return <Node.Captcha node={node} />
  }

  if (isUiNodeImageAttributes(node.attributes)) {
    return <Node.Image node={node} attributes={node.attributes} />
  } else if (isUiNodeTextAttributes(node.attributes)) {
    const attrs = node.attributes
    return <Node.Text attributes={attrs} node={node} />
  } else if (isUiNodeInputAttributes(node.attributes)) {
    return (
      <NodeInput node={node} attributes={node.attributes} onClick={onClick} />
    )
  } else if (isUiNodeAnchorAttributes(node.attributes)) {
    return <Node.Anchor attributes={node.attributes} node={node} />
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
