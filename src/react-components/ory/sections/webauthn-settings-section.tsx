import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasWebauthn } from "../helpers/utils"
import { NodeMessages } from "../helpers/error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"

export type WebAuthnSettings = {
  flow: SelfServiceSettingsFlow
}

export const WebAuthnSettingsSection = ({
  flow,
}: WebAuthnSettings): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "webauthn",
    withoutDefaultGroup: true,
  }

  return hasWebauthn(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages nodes={filterNodesByGroups(filter)} />
      <FilterFlowNodes filter={filter} />
    </div>
  ) : null
}
