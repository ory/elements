// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents, useNodeSorter } from "../../context"
import { useOryFlow } from "../../context"
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
      {children ??
        nodes.map((node, k) => {
          return <Node node={node} key={k} />
        })}
    </FormGroup>
  )
}
