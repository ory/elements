import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasWebauthn } from "../helpers/utils"
import { NodeMessages } from "../helpers/error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"

export type WebAuthnSettingsProps = {
  flow: SelfServiceSettingsFlow
}

export const WebAuthnSettingsSection = ({
  flow,
}: WebAuthnSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "webauthn",
    withoutDefaultGroup: true,
  }

  return hasWebauthn(flow.ui.nodes) ? (
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
