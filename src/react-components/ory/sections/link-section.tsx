import React from "react"
import { UiNode } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { NodeMessages } from "../helpers/error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"

export type LinkSectionProps = {
  nodes: UiNode[]
}

export const LinkSection = ({ nodes }: LinkSectionProps): JSX.Element => (
  <div className={gridStyle({ gap: 32 })}>
    <NodeMessages
      nodes={filterNodesByGroups({
        nodes: nodes,
        groups: "link",
      })}
    />
    <div className={gridStyle({ gap: 16 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: "link",
          excludeAttributes: "submit",
        }}
      />
    </div>
    <FilterFlowNodes
      filter={{
        nodes: nodes,
        groups: "link",
        attributes: "submit",
      }}
    />
  </div>
)
