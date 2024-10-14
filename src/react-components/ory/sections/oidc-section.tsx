// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { filterNodesByGroups } from "../../../ui"
import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasOidc } from "../helpers/utils"

export const OIDCSection = (flow: SelfServiceFlow): JSX.Element | null => {
  const hasOidcTraits =
    filterNodesByGroups({
      nodes: flow.ui.nodes,
      groups: "oidc",
      withoutDefaultGroup: true,
      excludeAttributeTypes: "submit",
    }).length > 0

  return hasOidc(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      {hasOidcTraits && (
        <div className={gridStyle({ gap: 16 })}>
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "oidc",
              withoutDefaultGroup: true,
              excludeAttributeTypes: ["submit"],
            }}
          />
        </div>
      )}

      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: "oidc",
          attributes: "submit",
          withoutDefaultGroup: true,
        }}
      />
    </div>
  ) : null
}
