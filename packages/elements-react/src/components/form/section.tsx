// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { useComponents } from "../../context/component"
import { OryForm } from "./form"
import { UiNode } from "@ory/client-fetch"
import { OryFormProvider } from "./form-provider"

export type OryFormSectionProps = PropsWithChildren<{
  nodes?: UiNode[]
}>

export function OryFormSection({ children, nodes }: OryFormSectionProps) {
  const { Card } = useComponents()

  return (
    <OryFormProvider nodes={nodes}>
      <OryForm>
        <Card.SettingsSection>{children}</Card.SettingsSection>
      </OryForm>
    </OryFormProvider>
  )
}
