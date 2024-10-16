// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { useComponents } from "../../context"
import {
  OryCardValidationMessages,
  OryForm,
  OryFormGroups,
  OryFormOidcButtons,
} from "../form"

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
 */
export function OryCardContent({ children }: OryCardContentProps) {
  const { Card } = useComponents()

  if (children) {
    return <Card.Content>{children}</Card.Content>
  }

  return (
    <Card.Content>
      <OryCardValidationMessages />
      <OryForm>
        <OryFormOidcButtons />
        <OryFormGroups
          groups={[
            "default",
            "password",
            "passkey",
            "code",
            "webauthn",
            "profile",
            "totp",
            "identifier_first",
          ]}
        />
      </OryForm>
    </Card.Content>
  )
}
