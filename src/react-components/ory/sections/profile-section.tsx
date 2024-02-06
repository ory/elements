import { JSX } from "react"

import { SettingsFlow } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import {
  hasPasskey,
  hasPassword,
  hasProfile,
  hasWebauthn,
} from "../helpers/utils"

export interface ProfileSettingsProps {
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

export const ProfileRegistrationSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  return hasProfile(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <div className={gridStyle({ gap: 16 })}>
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            groups: ["profile"],
            excludeAttributes: "submit",
          }}
        />
      </div>
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["profile"],
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}
