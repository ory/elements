"use client"
import { OryFlowComponents } from "@ory/react-headless"
import { FlowError } from "@ory/client-fetch"
import { OryClientConfiguration } from "@ory/client-helpers"
import { PropsWithChildren } from "react"

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
