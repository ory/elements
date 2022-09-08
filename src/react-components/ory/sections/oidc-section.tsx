import React from "react"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasOIDC } from "../helpers/utils"

export const OIDCSection = (flow: SelfServiceFlow): JSX.Element | null => {
  return hasOIDC(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages
        nodes={filterNodesByGroups({ nodes: flow.ui.nodes, groups: "oidc" })}
      />

      {filterNodesByGroups({
        nodes: flow.ui.nodes,
        groups: "oidc",
        withoutDefaultGroup: true,
      }).some((node) => node.messages.length > 0) && (
        <div className={gridStyle({ gap: 16 })}>
          {/*  we need other OIDC fields here such as input fields when an OIDC registration flow occured and it redirects us back to complete the missing traits */}
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: ["oidc"],
              excludeAttributes: "submit",
            }}
          />
        </div>
      )}

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
