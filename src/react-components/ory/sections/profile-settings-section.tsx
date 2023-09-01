import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SettingsFlow } from "@ory/client"
import { JSX } from "react"

export type ProfileSettingsProps = {
  flow: SettingsFlow
}

export const ProfileSettingsSection = ({
  flow,
}: ProfileSettingsProps): JSX.Element => {
  const filter = { nodes: flow.ui.nodes, groups: "profile" }
  return (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{ ...filter, excludeAttributes: "submit,button" }}
      />
      <FilterFlowNodes
        filter={{ ...filter, attributes: "submit,button" }}
        buttonOverrideProps={{ fullWidth: false }}
      />
    </div>
  )
}
