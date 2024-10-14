// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { useComponents } from "../../context"
import { OryCardHeader } from "./header"
import { OryCardFooter } from "."
import { OryCardContent } from "./content"

export type OryCardRootProps = PropsWithChildren

/**
 * The root component of the Ory Card.
 *
 * This can be used to build fully custom implementations of the Ory Flows.
 *
 * However, you most likely want to override the individual components instead.
 *
 * @param props - pass children to render instead of the default Ory Card components
 * @returns
 */
export function OryCard({ children }: PropsWithChildren) {
  const { Card } = useComponents()
  if (children) {
    return <Card.Root>{children}</Card.Root>
  }

  return (
    <Card.Root>
      <OryCardHeader />
      <OryCardContent />
      <OryCardFooter />
    </Card.Root>
  )
}
