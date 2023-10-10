import { UiNode } from "@ory/client"
import {
  FilterNodesByGroups,
  filterNodesByGroups,
  getNodeInputType,
  isUiNodeInputAttributes,
} from "@ory/integrations/ui"
import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { Node, NodeOverrideProps } from "./node"

export interface Props extends NodeOverrideProps {
  filter: FilterNodesByGroups
  includeCSRF?: boolean
}

export const FilterFlowNodes = ({
  filter,
  includeCSRF,
  ...overrides
}: Props): JSX.Element | null => {
  const getInputName = (node: UiNode): string =>
    isUiNodeInputAttributes(node.attributes) ? node.attributes.name : ""

  const nodes = filterNodesByGroups(filter)
    // we don't want to map the csrf token every time, only on the form level
    .filter((node) => includeCSRF || !(getInputName(node) === "csrf_token"))
    .map((node, k) => ({
      node: (
        <Node
          node={node}
          key={
            // input node
            "name" in node.attributes
              ? node.attributes.name
              : // image node
              "src" in node.attributes
              ? node.attributes.src
              : // anchor, text & script node
              "id" in node.attributes
              ? node.attributes.id
              : k
          }
          {...overrides}
        />
      ),
      hidden: getNodeInputType(node.attributes) === "hidden",
    }))
  return nodes.length > 0 ? (
    <>
      {nodes.filter((node) => node.hidden).map((node) => node.node)}
      <div className={gridStyle({ gap: 16 })}>
        {nodes.filter((node) => !node.hidden).map((node) => node.node)}
      </div>
    </>
  ) : null
}
