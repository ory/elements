// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryTwoStepCardStateMethodActive } from "./two-step/state-method-active"
import { OryTwoStepCardStateProvideIdentifier } from "./two-step/state-provide-identifier"
import { OryTwoStepCardStateSelectMethod } from "./two-step/state-select-method"
import { useOryFlow } from "@ory/elements-react"

export function OryTwoStepCard() {
  const { formState } = useOryFlow()

  switch (formState.current) {
    case "provide_identifier":
      return <OryTwoStepCardStateProvideIdentifier />
    case "select_method":
      return <OryTwoStepCardStateSelectMethod />
    case "method_active":
      return <OryTwoStepCardStateMethodActive formState={formState} />
  }

  return <>unknown form state: {formState.current}</>
}
