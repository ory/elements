import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { Card } from "../card"
import { FilterFlowNodes } from "./filter-flow-nodes"
import {
  SelfServiceFlowForm,
  SelfServiceFlowFormAdditionalProps,
} from "./selfservice-flow-form"
import { ErrorMessages } from "./error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../theme"

export type ProfileSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
} & SelfServiceFlowFormAdditionalProps

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
        <SelfServiceFlowForm
          flow={flow}
          submitOnEnter={true}
          onSubmit={onSubmit}
        >
          <FilterFlowNodes filter={filter} />
        </SelfServiceFlowForm>
      </div>
    </Card>
  )
}
