import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { ErrorMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type ProfileSettingsProps = {
  flow: SelfServiceSettingsFlow
}

export const ProfileSettingsSection = ({
  flow,
}: ProfileSettingsProps): JSX.Element => {
  const filter = { nodes: flow.ui.nodes, groups: "profile" }
  return (
    <div className={gridStyle({ gap: 32 })}>
      <ErrorMessages nodes={filterNodesByGroups(filter)} />
      <FilterFlowNodes filter={filter} />
    </div>
  )
}
