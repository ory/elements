"use client"
import { Config, OryFlowComponents } from "../types"
import { FlowError } from "@ory/client-fetch"
import { PropsWithChildren } from "react"

export type FlowContextProps = {
  error: FlowError
  components?: Partial<OryFlowComponents>
  config: Config
}

export function Error({
  error,
  children,
}: PropsWithChildren<FlowContextProps>) {
  return <div>{JSON.stringify(error) || children}</div>
}
