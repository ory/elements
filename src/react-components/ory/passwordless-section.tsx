import React from "react"
import { FilterFlowNodes } from "./filter-flow-nodes"
import { SelfServiceFlow } from "../../types"
import { hasWebauthn } from "./utils"

export const PasswordlessSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  return hasWebauthn(flow.ui.nodes) ? (
    <FilterFlowNodes filter={{ nodes: flow.ui.nodes, groups: "webauthn" }} />
  ) : null
}
