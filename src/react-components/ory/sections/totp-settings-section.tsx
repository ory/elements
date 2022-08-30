import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import {
  UserAuthFormAdditionalProps,
  UserAuthForm,
} from "../helpers/user-auth-form"
import { hasTotp } from "../helpers/utils"
import { Card } from "../../card"
import { gridStyle } from "../../../theme"
import { ErrorMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type TOTPSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
} & UserAuthFormAdditionalProps

export const TOTPSettings = ({
  flow,
  title,
  onSubmit,
}: TOTPSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "totp",
    withoutDefaultGroup: true,
  }

  return hasTotp(flow.ui.nodes) ? (
    <Card title={title || "Authenticator App"}>
      <div className={gridStyle({ gap: 32 })}>
        <ErrorMessages nodes={filterNodesByGroups(filter)} />
        <UserAuthForm flow={flow} submitOnEnter={true} onSubmit={onSubmit}>
          <FilterFlowNodes filter={filter} />
        </UserAuthForm>
      </div>
    </Card>
  ) : null
}
