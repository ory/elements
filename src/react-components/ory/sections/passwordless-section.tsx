import React from "react"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasWebauthn } from "../helpers/utils"

export const PasswordlessSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  return hasWebauthn(flow.ui.nodes) ? (
    <FilterFlowNodes
      filter={{
        nodes: flow.ui.nodes,
        groups: "webauthn",
        excludeAttributes: "hidden",
      }}
    />
  ) : null
}
