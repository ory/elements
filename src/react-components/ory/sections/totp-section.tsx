import React from "react"
import { UiNode } from "@ory/client"
import { hasTotp } from "../helpers/utils"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type TOTPSectionProps = {
  nodes: UiNode[]
}

export const TOTPSection = ({
  nodes,
}: TOTPSectionProps): JSX.Element | null => {
  return hasTotp(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages
        nodes={filterNodesByGroups({
          nodes: nodes,
          groups: "totp",
        })}
      />
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["totp"],
        }}
      />
    </div>
  ) : null
}
