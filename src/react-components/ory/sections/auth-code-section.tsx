import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasCode } from "../helpers/utils"
import { UiNode } from "@ory/client"

export type AuthCodeSectionProps = {
  nodes: UiNode[]
}

export const AuthCodeSection = ({
  nodes,
}: AuthCodeSectionProps): JSX.Element | null =>
  hasCode(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <div className={gridStyle({ gap: 16 })}>
        {/* default group is used here automatically for login */}
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: "code",
            excludeAttributes: ["submit", "hidden"],
          }}
        />
      </div>
      {/* include hidden here because we want to have resend support */}
      {/* exclude default group because we dont want to map csrf twice */}
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: "code",
          withoutDefaultGroup: true,
          attributes: ["submit", "hidden"],
        }}
      />
    </div>
  ) : null
