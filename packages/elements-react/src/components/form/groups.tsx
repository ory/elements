import { useComponents, useNodeSorter } from "../../context/component"
import { useOryFlow } from "../../context/flow-context"
import { UiNodeGroupEnum } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { Node } from "./nodes/node"

export type HeadlessGroupProps = PropsWithChildren<{
  groups: UiNodeGroupEnum[]
}>

export type HeadlessGroupContainerProps = PropsWithChildren

export function OryFormGroups({ children, groups }: HeadlessGroupProps) {
  const {
    flow: { ui },
  } = useOryFlow()
  const nodeSorter = useNodeSorter()
  const { flowType } = useOryFlow()
  const { FormGroup } = useComponents()
  const nodes = ui.nodes
    .filter((node) => groups.indexOf(node.group) > -1)
    .sort((a, b) => nodeSorter(a, b, { flowType }))

  return (
    <FormGroup>
      {children ||
        nodes.map((node, k) => {
          return <Node node={node} key={k} />
        })}
    </FormGroup>
  )
}
