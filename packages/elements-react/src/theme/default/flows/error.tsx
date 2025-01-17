// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowError } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
} from "@ory/elements-react"
import { PropsWithChildren } from "react"

export type ErrorFlowContextProps = {
  error: FlowError
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

export function Error({
  error,
  children,
}: PropsWithChildren<ErrorFlowContextProps>) {
  return (
    <div data-testid={"ory/screen/error/raw"}>
      {JSON.stringify(error) || children}
    </div>
  )
}
