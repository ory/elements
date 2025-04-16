// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { Settings, SettingsFlowContextProps } from "../../../src/theme/default"

export const SpacedSettings = (
  props: PropsWithChildren<SettingsFlowContextProps>,
) => (
  <div className="flex flex-col gap-8 justify-start items-center pb-12">
    <Settings {...props} />
  </div>
)
