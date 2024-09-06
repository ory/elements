import { UiNode } from "@ory/client"
import { isUiNodeTextAttributes } from "../../../ui"
import { Node } from "./node"

interface CaptchaSectionProps {
  nodes: UiNode[]
}

export function CaptchaSection({ nodes }: CaptchaSectionProps) {
  const filteredNodes = nodes.filter(
    (node) => (node.group as string) === "captcha",
  )
  return filteredNodes.map((node, k) => {
    if (
      isUiNodeTextAttributes(node.attributes) &&
      node.attributes.id === "captcha"
    ) {
      return <div id={node.attributes.id} key={node.attributes.id}></div>
    }
    return <Node node={node} key={k} />
  })
}
