// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { JSX } from "react"

import { SettingsFlow } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasPasskey } from "../helpers/utils"
import { gridStyle } from "../../../theme"

export interface PasskeySettingsProps {
  flow: SettingsFlow
}

export const PasskeySettingsSection = ({
  flow,
}: PasskeySettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "passkey",
    withoutDefaultGroup: true,
  }

  return hasPasskey(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{ ...filter, excludeAttributeTypes: "onclick,button" }}
      />
      <FilterFlowNodes
        filter={{ ...filter, attributes: "onclick,button" }}
        buttonOverrideProps={{ fullWidth: false }}
      />
    </div>
  ) : null
}
