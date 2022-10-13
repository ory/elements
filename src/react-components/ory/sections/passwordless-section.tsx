import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasWebauthn } from "../helpers/utils"

export const PasswordlessSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  return hasWebauthn(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <div className={gridStyle({ gap: 16 })}>
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            // we will also map default fields here but not oidc and password fields
            groups: ["webauthn"],
            withoutDefaultAttributes: true,
            excludeAttributes: ["hidden", "button", "submit"], // the form will take care of hidden fields
          }}
        />
      </div>
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["webauthn"],
          withoutDefaultAttributes: true,
          attributes: ["button", "submit"],
        }}
      />
    </div>
  ) : null
}
