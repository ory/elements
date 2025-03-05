// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { JSX } from "react"

import { SettingsFlow } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasProfile } from "../helpers/utils"
import { CaptchaSection } from "../helpers/captcha"

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
        filter={{ ...filter, excludeAttributeTypes: "submit,button" }}
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
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["profile"],
          excludeAttributeTypes: "submit,hidden",
        }}
      />
      <CaptchaSection nodes={flow.ui.nodes} />
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["profile"],
          excludeAttributeTypes: "hidden",
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}

export const ProfileLoginSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  return hasProfile(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["profile"],
          excludeAttributeTypes: "submit,hidden",
        }}
      />
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["profile"],
          excludeAttributeTypes: "hidden",
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}
