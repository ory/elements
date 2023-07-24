import { UiNode } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type AuthCodeSectionProps = {
  nodes: UiNode[]
}

export const AuthCodeSection = ({ nodes }: AuthCodeSectionProps): JSX.Element => (
  <div className={gridStyle({ gap: 32 })}>
    <div className={gridStyle({ gap: 16 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["code"],
          excludeAttributes: "submit",
        }}
      />
    </div>
    <FilterFlowNodes
      filter={{
        nodes: nodes,
        groups: ["code"],
        attributes: "submit",
      }}
    />
  </div>
)
