// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { ReactNode } from "react"
import { useComponents } from "../../../context"
import {
  isUiNodeAnchor,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeScript,
  isUiNodeText,
} from "../../../util/utilFixSDKTypesHelper"
import { NodeInput } from "./input"
import { NodeRenderer } from "./renderer"

export type NodeProps = {
  node: UiNode
}

// Captcha nodes need to be treated specially, as we use the react turnstile package to render them
const ignoredScriptGroups = ["captcha"]

const NodeBase = ({ node }: NodeProps): ReactNode => {
  const { Node } = useComponents()

  // Special case for CAPTCHA handling as we need to render a different component
  if (node.group === UiNodeGroupEnum.Captcha) {
    return <Node.Captcha node={node} />
  }

  if (isUiNodeImage(node)) {
    return <NodeRenderer.Image node={node} />
  } else if (isUiNodeText(node)) {
    return <NodeRenderer.Text node={node} />
  } else if (isUiNodeInput(node)) {
    return <NodeInput node={node} attributes={node.attributes} />
  } else if (isUiNodeAnchor(node)) {
    return <Node.Anchor attributes={node.attributes} node={node} />
  } else if (
    isUiNodeScript(node) &&
    !ignoredScriptGroups.includes(node.group)
  ) {
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

/**
 * Use this component to render any UiNode. It will automatically pick the correct sub-component based on the node type and use any custom components provided via the ComponentsContext.
 *
 * Make sure to use this component instead of the custom component directly, to make sure it's integrated properly with the form system.
 *
 * @param props - NodeProps containing the UiNode to render
 * @returns A ReactNode rendering the appropriate component for the given UiNode
 * @group Components
 */
export const Node = Object.assign(NodeBase, NodeRenderer)
