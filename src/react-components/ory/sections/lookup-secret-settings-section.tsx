import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { ErrorMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasLookupSecret } from "../helpers/utils"

export type LookupSecretSettingsSectionProps = {
  flow: SelfServiceSettingsFlow
}

export const LookupSecretSettingsSection = ({
  flow,
}: LookupSecretSettingsSectionProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "lookup_secret",
    withoutDefaultGroup: true,
  }

  return hasLookupSecret(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <ErrorMessages nodes={filterNodesByGroups(filter)} />
      <FilterFlowNodes filter={filter} />
    </div>
  ) : null
}
