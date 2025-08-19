// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { Settings, SettingsFlowContextProps } from "../../../src/theme/default"

export const SpacedSettings = (
  props: PropsWithChildren<SettingsFlowContextProps>,
) => (
  <div className="flex flex-col items-center justify-start gap-8 pb-12">
    <Settings {...props} />
  </div>
)
