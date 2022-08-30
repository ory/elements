import React from "react"
import { UiNode } from "@ory/client"
import { hasPassword } from "../helpers/utils"
import { gridStyle } from "../../../theme"
import { Divider } from "../../divider"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"

export type RegistrationSectionProps = {
  nodes: UiNode[]
}

export const RegistrationSection = ({
  nodes,
}: RegistrationSectionProps): JSX.Element | null => {
  return hasPassword(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <Divider />

      <div className={gridStyle({ gap: 16 })}>
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["default", "password"],
            excludeAttributes: "submit",
          }}
        />
      </div>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["password"],
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}
