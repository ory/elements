"use client"
import { FlowError } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryClientConfiguration, OryFlowComponents } from "@ory/elements-react"

export type ErrorFlowContextProps = {
  error: FlowError
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Error({
  error,
  children,
}: PropsWithChildren<ErrorFlowContextProps>) {
  return <div>{JSON.stringify(error) || children}</div>
}
