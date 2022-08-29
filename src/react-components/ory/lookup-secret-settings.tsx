import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../theme"
import { Card } from "../card"
import { ErrorMessages } from "./error-messages"
import { FilterFlowNodes } from "./filter-flow-nodes"
import {
  SelfServiceFlowForm,
  SelfServiceFlowFormAdditionalProps,
} from "./selfservice-flow-form"
import { hasLookupSecret } from "./utils"

export type LookupSecretSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
} & SelfServiceFlowFormAdditionalProps

export const LookupSecretSettings = ({
  flow,
  title,
  onSubmit,
}: LookupSecretSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "lookup_secret",
    withoutDefaultGroup: true,
  }

  return hasLookupSecret(flow.ui.nodes) ? (
    <Card title={title || "Backup Recovery Codes"}>
      <div className={gridStyle({ gap: 32 })}>
        <ErrorMessages nodes={filterNodesByGroups(filter)} />
        <SelfServiceFlowForm flow={flow} onSubmit={onSubmit}>
          <FilterFlowNodes filter={filter} />
        </SelfServiceFlowForm>
      </div>
    </Card>
  ) : null
}
