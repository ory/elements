// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { JSX } from "react"

import { SettingsFlow } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasWebauthn } from "../helpers/utils"

export interface WebAuthnSettingsProps {
  flow: SettingsFlow
}

export const WebAuthnSettingsSection = ({
  flow,
}: WebAuthnSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "webauthn",
    withoutDefaultGroup: true,
  }

  return hasWebauthn(flow.ui.nodes) ? (
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
