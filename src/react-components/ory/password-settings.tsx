import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { Card } from "../card"
import { FilterFlowNodes } from "./filter-flow-nodes"
import {
  SelfServiceFlowForm,
  SelfServiceFlowFormAdditionalProps,
} from "./selfservice-flow-form"
import { hasPassword } from "./utils"
import { ErrorMessages } from "./error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../theme"

export type PasswordSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
} & SelfServiceFlowFormAdditionalProps

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
        <SelfServiceFlowForm
          flow={flow}
          submitOnEnter={true}
          onSubmit={onSubmit}
        >
          <FilterFlowNodes filter={filter} />
        </SelfServiceFlowForm>
      </div>
    </Card>
  ) : null
}
