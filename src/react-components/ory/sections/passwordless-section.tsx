import React from "react"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasWebauthn } from "../helpers/utils"

export const PasswordlessSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  return hasWebauthn(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages
        nodes={filterNodesByGroups({
          nodes: flow.ui.nodes,
          groups: "password",
        })}
      />
      <div className={gridStyle({ gap: 16 })}>
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            // we will also map default fields here but not oidc and password fields
            groups: ["webauthn"],
            excludeAttributes: "hidden", // the form will take care of hidden fields
          }}
        />
      </div>
    </div>
  ) : null
}
