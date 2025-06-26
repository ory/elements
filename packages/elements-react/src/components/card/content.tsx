// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { useComponents } from "../../context"

/**
 * Props for the OryCardContent component.
 */
export type OryCardContentProps = PropsWithChildren

/**
 * A component that renders the content of the Ory Card.
 * This is the main content of the card, such as the flow's form, with it's input fields and messages.
 *
 * You can use this component to build fully custom implementations of the Ory Flows.
 *
 * However, you most likely want to override the individual components instead.
 *
 * @param props - pass children to render instead of the default Ory Card components
 * @returns
 * @group Components
 */
export function OryCardContent({ children }: OryCardContentProps) {
  const { Card } = useComponents()

  return <Card.Content>{children}</Card.Content>
}
