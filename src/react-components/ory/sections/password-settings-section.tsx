import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { hasPassword } from "../helpers/utils"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type PasswordSettingsProps = {
  flow: SelfServiceSettingsFlow
}

export const PasswordSettingsSection = ({
  flow,
}: PasswordSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "password",
    withoutDefaultGroup: true,
  }
  return hasPassword(flow.ui.nodes) ? (
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
  ) : null
}
