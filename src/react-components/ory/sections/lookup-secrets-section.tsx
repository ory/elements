import { UiNode } from "@ory/client"
import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { haslookup_secret } from "../helpers/utils"

export interface lookup_secretsSectionProps {
  nodes: UiNode[]
}

export const lookup_secretsSection = ({
  nodes,
}: lookup_secretsSectionProps): JSX.Element | null => {
  return haslookup_secret(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: "lookup_secret",
        }}
      />
    </div>
  ) : null
}
