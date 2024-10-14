// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlow } from "@ory/client"
import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasLookupSecret } from "../helpers/utils"

export interface LookupSecretSettingsProps {
  flow: SettingsFlow
}

export const LookupSecretSettingsSection = ({
  flow,
}: LookupSecretSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "lookup_secret",
    withoutDefaultGroup: true,
  }

  return hasLookupSecret(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{ ...filter, excludeAttributeTypes: "submit,button" }}
      />
      <FilterFlowNodes
        filter={{ ...filter, attributes: "submit,button" }}
        buttonOverrideProps={{ fullWidth: false }}
      />
    </div>
  ) : null
}
