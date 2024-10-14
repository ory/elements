// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"
import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasLookupSecret } from "../helpers/utils"

export interface LookupSecretsSectionProps {
  nodes: UiNode[]
}

export const LookupSecretsSection = ({
  nodes,
}: LookupSecretsSectionProps): JSX.Element | null => {
  return hasLookupSecret(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: "lookup_secret",
        }}
      />
    </div>
  ) : null
}
