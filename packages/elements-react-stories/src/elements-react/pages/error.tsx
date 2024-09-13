"use client"
import { Configuration, LoginFlow, FlowType } from "@ory/client-fetch"
import { Locale, OryFlowComponents } from "@ory/elements-react"
import { PropsWithChildren } from "react"

export type FlowContextProps = {
  flow: LoginFlow
  components?: Partial<OryFlowComponents>
  config: Configuration
  locale?: Locale
}

function _Error({
  flow,
  config,
  children,
  components,
  locale,
}: PropsWithChildren<FlowContextProps>) {
  throw new Error("not implemented yet")
  // return (
  // <OryProvider
  //   config={config}
  //   flow={flow}
  //   flowType={FlowType.Error}
  //   components={components}
  //   locale={locale}
  // >
  //   {children || <OryCard />}
  // </OryProvider>
  // )
}

// export const Error = _Error
