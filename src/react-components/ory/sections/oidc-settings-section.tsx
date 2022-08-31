import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasOIDC } from "../helpers/utils"
import { ErrorMessages } from "../helpers/error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"

export type OIDCSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
}

export const OIDCSettingsSection = ({
  flow,
}: OIDCSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "oidc",
    withoutDefaultGroup: true,
  }

  return hasOIDC(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <ErrorMessages nodes={filterNodesByGroups(filter)} />
      <FilterFlowNodes filter={filter} />
    </div>
  ) : null
}
