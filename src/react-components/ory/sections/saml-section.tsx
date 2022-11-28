import { filterNodesByGroups } from "@ory/integrations/ui"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasSaml } from "../helpers/utils"

export const SAMLSection = (flow: SelfServiceFlow): JSX.Element | null => {
  return hasSaml(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      {filterNodesByGroups({
        nodes: flow.ui.nodes,
        groups: "saml",
        withoutDefaultGroup: true,
      }).some((node) => node.messages.length > 0) && (
        <div className={gridStyle({ gap: 16 })}>
          {/*  we need other SAML fields here such as input fields when an SAML registration flow occured and it redirects us back to complete the missing traits */}
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: ["saml"],
              excludeAttributes: "submit",
            }}
          />
        </div>
      )}

      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: "saml",
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}
