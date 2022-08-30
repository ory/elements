import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import {
  UserAuthFormAdditionalProps,
  UserAuthForm,
} from "../helpers/user-auth-form"
import { Card } from "../../card"
import { gridStyle } from "../../../theme"
import { ErrorMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type ProfileSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
} & UserAuthFormAdditionalProps

export const ProfileSettings = ({
  flow,
  title,
  onSubmit,
}: ProfileSettingsProps): JSX.Element => {
  const filter = { nodes: flow.ui.nodes, groups: "profile" }
  return (
    <Card title={title || "Profile"}>
      <div className={gridStyle({ gap: 32 })}>
        <ErrorMessages nodes={filterNodesByGroups(filter)} />
        <UserAuthForm flow={flow} submitOnEnter={true} onSubmit={onSubmit}>
          <FilterFlowNodes filter={filter} />
        </UserAuthForm>
      </div>
    </Card>
  )
}
