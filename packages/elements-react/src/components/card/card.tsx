// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { useComponents } from "../../context"
import { OryFormProvider } from "../form/form-provider"

/**
 * @interface
 */
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
 * @group Components
 */
export function OryCard({ children }: PropsWithChildren) {
  const { Card } = useComponents()
  return (
    <Card.Root>
      <OryFormProvider>{children}</OryFormProvider>
    </Card.Root>
  )
}
