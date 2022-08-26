import React from "react"
import { FilterFlowNodes } from "./filter-flow-nodes"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { SelfServiceFlow } from "../../types"

export const PasswordlessSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  const hasPasswordless =
    filterNodesByGroups({
      nodes: flow.ui.nodes,
      groups: "webauthn",
      withoutDefaultGroup: true,
    }).length > 0

  return hasPasswordless ? (
    <FilterFlowNodes filter={{ nodes: flow.ui.nodes, groups: "webauthn" }} />
  ) : null
}
