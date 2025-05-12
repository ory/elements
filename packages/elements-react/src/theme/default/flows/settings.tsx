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
  OryToastProps,
} from "@ory/elements-react"
import { ComponentType, PropsWithChildren } from "react"
import { getOryComponents } from "../components"
import { Toaster } from "../components/generic/toaster"

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
  const Components = getOryComponents(flowOverrideComponents)

  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Settings}
      components={Components}
    >
      {children ?? <InnerSettings components={Components.Message} />}
    </OryProvider>
  )
}

function InnerSettings({
  components,
}: {
  components: {
    Toast: ComponentType<OryToastProps>
  }
}) {
  // const intl = useIntl()
  return (
    <>
      <HeadlessPageHeader />
      <Toaster title={"asd"} components={components} />
      <OrySettingsCard />
    </>
  )
}
