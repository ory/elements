import { UiNode } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasCode } from "../helpers/utils"

export type AuthCodeSectionProps = {
  nodes: UiNode[]
}

export const AuthCodeSection = ({
  nodes,
}: AuthCodeSectionProps): JSX.Element | null =>
  hasCode(nodes) ? (
    <>
      {/* place this outisde of the grid so that hidden fields dont break the layout */}
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: "code",
          withoutDefaultAttributes: true,
          attributes: ["hidden"],
        }}
      />
      <div className={gridStyle({ gap: 32 })}>
        <div className={gridStyle({ gap: 16 })}>
          {/* default group is used here automatically for login */}
          <FilterFlowNodes
            filter={{
              nodes: nodes,
              groups: "code",
              withoutDefaultAttributes: true,
              excludeAttributes: ["hidden", "button", "submit"], // the form will take care of default (csrf) hidden fields
            }}
          />
        </div>
        {/* include hidden here because we want to have resend support */}
        {/* exclude default group because we dont want to map csrf twice */}
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: "code",
            withoutDefaultAttributes: true,
            attributes: ["button", "submit"],
          }}
        />
      </div>
    </>
  ) : null
