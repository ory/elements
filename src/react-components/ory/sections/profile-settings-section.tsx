import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
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
      <NodeMessages nodes={filterNodesByGroups(filter)} />
      <div className={gridStyle({ gap: 32 })}>
        <FilterFlowNodes
          filter={{ ...filter, excludeAttributes: "submit,button" }}
        />
        <FilterFlowNodes
          filter={{ ...filter, attributes: "submit,button" }}
          buttonOverrideProps={{ fullWidth: false }}
        />
      </div>
    </div>
  )
}
