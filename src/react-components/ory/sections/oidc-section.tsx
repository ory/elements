import React from "react"
import { gridStyle } from "../../../theme"
import { Divider } from "../../divider"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { UserAuthForm } from "../helpers/user-auth-form"
import { hasOIDC } from "../helpers/utils"

export const OIDCSection = (flow: SelfServiceFlow): JSX.Element | null => {
  return hasOIDC(flow.ui.nodes) ? (
    <UserAuthForm flow={flow}>
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
    </UserAuthForm>
  ) : null
}
