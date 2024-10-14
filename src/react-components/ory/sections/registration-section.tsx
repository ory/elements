// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"
import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasPassword } from "../helpers/utils"
import { CaptchaSection } from "../helpers/captcha"

export interface RegistrationSectionProps {
  nodes: UiNode[]
}

export const RegistrationSection = ({
  nodes,
}: RegistrationSectionProps): JSX.Element | null => {
  return hasPassword(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <div className={gridStyle({ gap: 16 })}>
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["password"],
            excludeAttributeTypes: "submit,hidden",
          }}
        />
      </div>

      <CaptchaSection nodes={nodes} />
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["password"],
          excludeAttributeTypes: "hidden",
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}
