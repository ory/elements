import React from "react"
import { UiNode } from "@ory/client"
import { hasPassword } from "../helpers/utils"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { NodeMessages } from "../helpers/error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"

export type RegistrationSectionProps = {
  nodes: UiNode[]
}

export const RegistrationSection = ({
  nodes,
}: RegistrationSectionProps): JSX.Element | null => {
  return hasPassword(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages
        nodes={filterNodesByGroups({
          nodes: nodes,
          groups: "password",
          withoutDefaultGroup: true,
        })}
      />
      <div className={gridStyle({ gap: 16 })}>
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["password"],
            excludeAttributes: "submit",
          }}
        />
      </div>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["password"],
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}
