import React from "react"
import { UiNode } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasLookupSecret } from "../helpers/utils"

export type LookupSecretsSectionProps = {
  nodes: UiNode[]
}

export const LookupSecretsSection = ({
  nodes,
}: LookupSecretsSectionProps): JSX.Element | null => {
  return hasLookupSecret(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages
        nodes={filterNodesByGroups({
          nodes: nodes,
          groups: "lookup_secret",
          withoutDefaultGroup: true,
        })}
      />
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: "lookup_secret",
        }}
      />
    </div>
  ) : null
}
