import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { Card } from "../card"
import { FilterFlowNodes } from "./filter-flow-nodes"
import {
  SelfServiceFlowForm,
  SelfServiceFlowFormAdditionalProps,
} from "./selfservice-flow-form"
import { hasWebauthn } from "./utils"
import { Message } from "../message"
import { ErrorMessages } from "./error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../theme"

export type WebAuthnSettings = {
  flow: SelfServiceSettingsFlow
  title?: string
} & SelfServiceFlowFormAdditionalProps

export const WebAuthnSettings = ({
  flow,
  title,
  onSubmit,
}: WebAuthnSettings): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "webauthn",
    withoutDefaultGroup: true,
  }

  return hasWebauthn(flow.ui.nodes) ? (
    <Card title={title || "Hardware Tokens"}>
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
