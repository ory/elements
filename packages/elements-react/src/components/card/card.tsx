// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { OryCardFooter } from "./footer"
import { useComponents } from "../../context"
import { OryCardContent } from "./content"
import { OryCardHeader } from "./header"
import { OryFormProvider } from "../form/form-provider"

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
    return (
      <Card.Root>
        <OryFormProvider>{children}</OryFormProvider>
      </Card.Root>
    )
  }

  return (
    <Card.Root>
      <OryFormProvider>
        <OryCardHeader />
        <OryCardContent />
        <OryCardFooter />
      </OryFormProvider>
    </Card.Root>
  )
}
