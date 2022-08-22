import React from "react"
import { UiNode } from "@ory/client"
import {
  filterNodesByGroups,
  getNodeInputType,
  isUiNodeInputAttributes,
} from "@ory/integrations/ui"
import { Node } from "./node"
import { gridStyle } from "../../theme"

export interface Props {
  filter: filterNodesByGroups
  includeCSRF?: boolean
}

export const FilterFlowNodes = ({ filter, includeCSRF }: Props) => {
  const getInputName = (node: UiNode): string =>
    isUiNodeInputAttributes(node.attributes) ? node.attributes.name : ""

  const nodes = filterNodesByGroups(filter)
    // we don't want to map the csrf token every time, only on the form level
    .filter(
      (node) =>
        (["csrf_token"].includes(getInputName(node)) && includeCSRF) || true,
    )
    .map((node, k) =>
      ["hidden"].includes(getNodeInputType(node.attributes))
        ? { node: <Node node={node} key={k} />, hidden: true }
        : { node: <Node node={node} key={k} />, hidden: false },
    )
  return nodes.length > 0 ? (
    <>
      {nodes.filter((node) => node.hidden).map((node) => node.node)}
      <div className={gridStyle({ gap: 16 })}>
        {nodes.filter((node) => !node.hidden).map((node) => node.node)}
      </div>
    </>
  ) : null
}
