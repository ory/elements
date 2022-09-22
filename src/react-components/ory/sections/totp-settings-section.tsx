import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { hasTotp } from "../helpers/utils"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type TOTPSettingsProps = {
  flow: SelfServiceSettingsFlow
}

export const TOTPSettingsSection = ({
  flow,
}: TOTPSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "totp",
    withoutDefaultGroup: true,
  }

  return hasTotp(flow.ui.nodes) ? (
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
