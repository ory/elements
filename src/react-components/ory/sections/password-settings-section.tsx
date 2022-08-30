import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import {
  UserAuthFormAdditionalProps,
  UserAuthForm,
} from "../helpers/user-auth-form"
import { hasPassword } from "../helpers/utils"
import { Card } from "../../card"
import { gridStyle } from "../../../theme"
import { ErrorMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type PasswordSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
} & UserAuthFormAdditionalProps

export const PasswordSettings = ({
  flow,
  title,
  onSubmit,
}: PasswordSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "password",
    withoutDefaultGroup: true,
  }
  return hasPassword(flow.ui.nodes) ? (
    <Card title={title || "Update Password"}>
      <div className={gridStyle({ gap: 32 })}>
        <ErrorMessages nodes={filterNodesByGroups(filter)} />
        <UserAuthForm flow={flow} submitOnEnter={true} onSubmit={onSubmit}>
          <FilterFlowNodes filter={filter} />
        </UserAuthForm>
      </div>
    </Card>
  ) : null
}
