import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasLookupSecret } from "../helpers/utils"

export type LookupSecretSettingsProps = {
  flow: SelfServiceSettingsFlow
}

export const LookupSecretSettingsSection = ({
  flow,
}: LookupSecretSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "lookup_secret",
    withoutDefaultGroup: true,
  }

  return hasLookupSecret(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages nodes={filterNodesByGroups(filter)} />
      <div className={gridStyle({ gap: 32 })}>
        <FilterFlowNodes
          filter={{ ...filter, excludeAttributes: "submit,button" }}
        />
        <FilterFlowNodes filter={{ ...filter, attributes: "submit,button" }} />
      </div>
    </div>
  ) : null
}
