"use client"
import { FlowError } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryFlowComponents } from "../../../types"
import { OryClientConfiguration } from "../../../util/clientConfiguration"

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
