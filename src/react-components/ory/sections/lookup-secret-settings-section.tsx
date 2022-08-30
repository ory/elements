import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { Card } from "../../card"
import { ErrorMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import {
  UserAuthForm,
  UserAuthFormAdditionalProps,
} from "../helpers/user-auth-form"
import { hasLookupSecret } from "../helpers/utils"

export type LookupSecretSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
} & UserAuthFormAdditionalProps

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
        <UserAuthForm flow={flow} onSubmit={onSubmit}>
          <FilterFlowNodes filter={filter} />
        </UserAuthForm>
      </div>
    </Card>
  ) : null
}
