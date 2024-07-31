import { useComponents } from "../../context/component"
import { useOryFlow } from "../../context/flow-context"

export type HorizontalDividerProps = {}

export function OryFormGroupDivider() {
  const { HorizontalDivider } = useComponents()
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter((node) => node.group === "oidc")

  // Are there other first-factor nodes available?
  const otherNodes = ui.nodes.filter(
    (node) => node.group !== "oidc" && node.group !== "default",
  )

  if (filteredNodes.length > 0 && otherNodes.length > 0) {
    return <HorizontalDivider />
  }
  return null
}
