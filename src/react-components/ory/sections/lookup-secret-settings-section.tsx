import { SettingsFlow } from "@ory/client"
import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { haslookup_secret } from "../helpers/utils"

export interface lookup_secretSettingsProps {
  flow: SettingsFlow
}

export const lookup_secretSettingsSection = ({
  flow,
}: lookup_secretSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "lookup_secret",
    withoutDefaultGroup: true,
  }

  return haslookup_secret(flow.ui.nodes) ? (
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
