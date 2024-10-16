// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, SettingsFlow } from "@ory/client-fetch"
import {
  HeadlessPageHeader,
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OrySettingsCard,
} from "@ory/elements-react"
import merge from "lodash.merge"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"

export type SettingsFlowContextProps = {
  flow: SettingsFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

export function Settings({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<SettingsFlowContextProps>) {
  const components = flowOverrideComponents
    ? merge({}, OryDefaultComponents, flowOverrideComponents)
    : OryDefaultComponents

  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Settings}
      components={components}
    >
      {children ?? (
        <>
          <HeadlessPageHeader />
          <OrySettingsCard />
        </>
      )}
    </OryProvider>
  )
}
