import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasOidc } from "../helpers/utils"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { JSX } from "react"

export const OIDCSection = (flow: SelfServiceFlow): JSX.Element | null => {
  const hasOidcTraits =
    filterNodesByGroups({
      nodes: flow.ui.nodes,
      groups: "oidc",
      withoutDefaultGroup: true,
      excludeAttributes: "submit",
    }).length > 0

  return hasOidc(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      {hasOidcTraits && (
        <div className={gridStyle({ gap: 16 })}>
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "oidc",
              withoutDefaultGroup: true,
              excludeAttributes: "submit",
            }}
          />
        </div>
      )}

      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: "oidc",
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}
