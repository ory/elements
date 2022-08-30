import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { Card } from "../../card"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import {
  UserAuthForm,
  UserAuthFormAdditionalProps,
} from "../helpers/user-auth-form"
import { hasWebauthn } from "../helpers/utils"
import { ErrorMessages } from "../helpers/error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"

export type WebAuthnSettings = {
  flow: SelfServiceSettingsFlow
  title?: string
} & UserAuthFormAdditionalProps

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
        <UserAuthForm flow={flow} submitOnEnter={true} onSubmit={onSubmit}>
          <FilterFlowNodes filter={filter} />
        </UserAuthForm>
      </div>
    </Card>
  ) : null
}
