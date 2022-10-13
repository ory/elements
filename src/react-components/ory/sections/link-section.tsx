import { UiNode } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type LinkSectionProps = {
  nodes: UiNode[]
}

export const LinkSection = ({ nodes }: LinkSectionProps): JSX.Element => (
  <div className={gridStyle({ gap: 32 })}>
    <div className={gridStyle({ gap: 16 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["link", "code"],
          excludeAttributes: "submit",
        }}
      />
    </div>
    <FilterFlowNodes
      filter={{
        nodes: nodes,
        groups: ["link", "code"],
        attributes: "submit",
      }}
    />
  </div>
)
