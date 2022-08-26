import React from "react"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../theme"
import { SelfServiceFlow } from "../../types"
import { Divider } from "../divider"
import { FilterFlowNodes } from "./filter-flow-nodes"
import { SelfServiceFlowForm } from "./selfservice-flow-form"

export const OIDCSection = (flow: SelfServiceFlow): JSX.Element | null => {
  const hasOIDC =
    filterNodesByGroups({
      nodes: flow.ui.nodes,
      groups: "oidc",
      withoutDefaultGroup: true,
    }).length > 0

  return hasOIDC ? (
    <SelfServiceFlowForm flow={flow}>
      <div className={gridStyle({ gap: 32 })}>
        <Divider />
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            groups: "oidc",
            attributes: "submit",
          }}
        />
      </div>
    </SelfServiceFlowForm>
  ) : null
}
