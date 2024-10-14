// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasCode } from "../helpers/utils"

export interface AuthCodeSectionProps {
  nodes: UiNode[]
}

/**
 * AuthCodeSection renders the fields for login and registration via one-time code.
 * Please see the Ory docs for more information: https://www.ory.sh/docs/kratos/passwordless/one-time-code
 * @param nodes - Ory UiNode[]
 * @see AuthCodeSectionProps
 */
export const AuthCodeSection = ({
  nodes,
}: AuthCodeSectionProps): JSX.Element | null =>
  hasCode(nodes) ? (
    <>
      {/* place this outisde of the grid so that hidden fields dont break the layout */}
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["code", "identifier_first"],
          // we don't want to map the default group twice
          // the form already maps hidden fields under the default group
          // we are only interested in hidden fields that are under the code group
          withoutDefaultGroup: true,
          withoutDefaultAttributes: true,
          attributes: ["hidden"],
        }}
      />
      <div className={gridStyle({ gap: 32 })}>
        {/* default group is used here automatically for login */}
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["code"],
            withoutDefaultAttributes: true,
            excludeAttributeTypes: ["hidden", "button", "submit"], // the form will take care of default (csrf) hidden fields
          }}
        />
        {/* include hidden here because we want to have resend support */}
        {/* exclude default group because we dont want to map csrf twice */}
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: "code",
            withoutDefaultAttributes: true,
            attributes: ["button", "submit"],
            excludeAttributeTypes: ["hidden"],
          }}
        />
      </div>
    </>
  ) : null
