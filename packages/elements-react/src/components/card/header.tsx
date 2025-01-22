// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents, useOryFlow } from "../../context"
import { useCardHeaderText } from "../../theme/default/utils/constructCardHeader"

export type OryCardHeaderProps = {
  title: string
  text?: string
}

export function OryCardHeader() {
  const { Card } = useComponents()
  const context = useOryFlow()
  const { title, description } = useCardHeaderText(context.flow.ui, context)
  return <Card.Header title={title} text={description} />
}
