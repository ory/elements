import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { Card } from "../../card"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { UserAuthForm } from "../helpers/user-auth-form"
import { hasOIDC } from "../helpers/utils"
import { ErrorMessages } from "../helpers/error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"

export type OIDCSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
}

export const OIDCSettings = ({
  flow,
  title,
}: OIDCSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "oidc",
    withoutDefaultGroup: true,
  }

  return hasOIDC(flow.ui.nodes) ? (
    <Card title={title || "Social Sign In"}>
      <div className={gridStyle({ gap: 32 })}>
        <ErrorMessages nodes={filterNodesByGroups(filter)} />
        <UserAuthForm flow={flow}>
          <FilterFlowNodes filter={filter} />
        </UserAuthForm>
      </div>
    </Card>
  ) : null
}
