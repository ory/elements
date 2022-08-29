import React from "react"
import { gridStyle } from "../../theme"
import { SelfServiceFlow } from "../../types"
import { Divider } from "../divider"
import { FilterFlowNodes } from "./filter-flow-nodes"
import { SelfServiceFlowForm } from "./selfservice-flow-form"
import { hasOIDC } from "./utils"

export const OIDCSection = (flow: SelfServiceFlow): JSX.Element | null => {
  return hasOIDC(flow.ui.nodes) ? (
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
