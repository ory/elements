"use client"
import { OryFlowComponents } from "@ory/react-headless/src/types"
import { FlowError } from "@ory/client-fetch"
import { OryClientConfiguration } from "@ory/client-helpers"
import { PropsWithChildren } from "react"

export type FlowContextProps = {
  error: FlowError
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Error({
  error,
  children,
}: PropsWithChildren<FlowContextProps>) {
  return <div>{JSON.stringify(error) || children}</div>
}
