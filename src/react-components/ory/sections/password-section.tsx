import React from "react"
import { UiNode } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasPassword } from "../helpers/utils"

export type PasswordSectionProps = {
  nodes: UiNode[]
}

export const PasswordSection = ({
  nodes,
}: PasswordSectionProps): JSX.Element | null => {
  return hasPassword(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages
        nodes={filterNodesByGroups({
          nodes: nodes,
          groups: "password",
        })}
      />
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: "password",
        }}
      />
    </div>
  ) : null
}
