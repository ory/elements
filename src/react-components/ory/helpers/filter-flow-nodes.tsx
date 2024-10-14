// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"
import {
  FilterNodesByGroups,
  filterNodesByGroups,
  getNodeInputType,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "../../../ui"
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
            isUiNodeInputAttributes(node.attributes)
              ? node.attributes.name
              : isUiNodeImageAttributes(node.attributes)
                ? node.attributes.src
                : isUiNodeAnchorAttributes(node.attributes) ||
                    isUiNodeTextAttributes(node.attributes) ||
                    isUiNodeScriptAttributes(node.attributes)
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
