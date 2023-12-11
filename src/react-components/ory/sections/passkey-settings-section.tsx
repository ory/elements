import { JSX } from "react"

import { SettingsFlow } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasPasskey } from "../helpers/utils"

export interface PasskeySettingsProps {
  flow: SettingsFlow
}

export const PasskeySettingsSection = ({
  flow,
}: PasskeySettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: ["passkey", "webauthn"],
    withoutDefaultGroup: true,
  }

  return hasPasskey(flow.ui.nodes) ? (
    <div>
      <FilterFlowNodes
        filter={{ ...filter, attributes: "submit,button" }}
        buttonOverrideProps={{ fullWidth: false }}
      />
      <FilterFlowNodes
        filter={{ ...filter, excludeAttributes: "submit,button" }}
      />
    </div>
  ) : null
}
