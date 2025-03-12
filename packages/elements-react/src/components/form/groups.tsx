// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents, useNodeSorter } from "../../context"
import { useOryFlow } from "../../context"
import { UiNodeGroupEnum } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { Node } from "./nodes/node"

export type OryFormGroupsProps = PropsWithChildren<{
  groups: UiNodeGroupEnum[]
}>

export type OryFormGroupProps = PropsWithChildren

export function OryFormGroups({ groups }: OryFormGroupsProps) {
  const {
    flow: { ui },
  } = useOryFlow()
  const nodeSorter = useNodeSorter()
  const { flowType } = useOryFlow()
  const { Form } = useComponents()
  const nodes = ui.nodes
    .filter((node) => groups.indexOf(node.group) > -1)
    .sort((a, b) => nodeSorter(a, b, { flowType }))

  return (
    <Form.Group>
      {nodes.map((node, k) => {
        return <Node node={node} key={k} />
      })}
    </Form.Group>
  )
}
