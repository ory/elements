// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlow } from "@ory/client"
import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasOidc } from "../helpers/utils"

export interface OIDCSettingsProps {
  flow: SettingsFlow
  title?: string
}

export const OIDCSettingsSection = ({
  flow,
}: OIDCSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: ["oidc", "saml"],
    withoutDefaultGroup: true,
  }

  return hasOidc(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={filter}
        buttonOverrideProps={{ fullWidth: false }}
      />
    </div>
  ) : null
}
