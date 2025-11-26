import { useComponents } from "../../../../context"
import { UiNodeText } from "../../../../util/utilFixSDKTypesHelper"

type TextRendererProps = {
  node: UiNodeText
}

export function TextRenderer({ node }: TextRendererProps) {
  const { Node } = useComponents()
  return <Node.Text node={node} attributes={node.attributes} />
}
