import { UiNode } from "@ory/client"
import React from "react"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { NodeMessages } from "../helpers/error-messages"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasWebauthn } from "../helpers/utils"

export type WebAuthnSectionProps = {
  nodes: UiNode[]
}

export const WebAuthnSection = ({
  nodes,
}: WebAuthnSectionProps): JSX.Element | null => {
  return hasWebauthn(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages
        nodes={filterNodesByGroups({
          nodes: nodes,
          groups: "webauthn",
        })}
      />
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["webauthn"],
        }}
      />
    </div>
  ) : null
}
