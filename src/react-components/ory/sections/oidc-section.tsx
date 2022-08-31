import React from "react"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasOIDC } from "../helpers/utils"

export const OIDCSection = (flow: SelfServiceFlow): JSX.Element | null => {
  return hasOIDC(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: "oidc",
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}
