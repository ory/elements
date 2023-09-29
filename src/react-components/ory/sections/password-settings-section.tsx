import { SettingsFlow } from "@ory/client"
import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasPassword } from "../helpers/utils"

export interface PasswordSettingsProps {
  flow: SettingsFlow
}

export const PasswordSettingsSection = ({
  flow,
}: PasswordSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "password",
    withoutDefaultGroup: true,
  }
  return hasPassword(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{ ...filter, excludeAttributes: "submit,button" }}
      />
      <FilterFlowNodes
        filter={{ ...filter, attributes: "submit,button" }}
        buttonOverrideProps={{ fullWidth: false }}
      />
    </div>
  ) : null
}
