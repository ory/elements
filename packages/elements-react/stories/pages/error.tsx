// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { Configuration, LoginFlow } from "@ory/client-fetch"
import { OryFlowComponents } from "@ory/elements-react"

export type FlowContextProps = {
  flow: LoginFlow
  components?: Partial<OryFlowComponents>
  config: Configuration
}

function _Error() {
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
