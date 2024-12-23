// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"
import {
  ComponentPropsWithoutRef,
  FormEventHandler,
  PropsWithChildren,
} from "react"
import { useFormContext } from "react-hook-form"
import { useComponents } from "../../context/component"
import { OryFormProvider } from "./form-provider"
import { useOryFormSubmit } from "./useOryFormSubmit"
import { useOryFlow } from "../../context"

type OryFormProps = Omit<
  ComponentPropsWithoutRef<"form">,
  "action" | "method" | "onSubmit"
>

export type OryFormSectionProps = PropsWithChildren<
  OryFormProps & {
    nodes?: UiNode[]
  }
>

export type OryCardSettingsSectionProps = PropsWithChildren & {
  action: string
  method: string
  onSubmit: FormEventHandler<HTMLFormElement>
}

export function OryFormSection({
  children,
  nodes,
  ...rest
}: OryFormSectionProps) {
  return (
    <OryFormProvider nodes={nodes}>
      <OryFormSectionInner {...rest}>{children}</OryFormSectionInner>
    </OryFormProvider>
  )
}

function OryFormSectionInner({
  children,
  ...rest
}: PropsWithChildren<OryFormProps>) {
  const { Card } = useComponents()
  const flowContainer = useOryFlow()
  const onSubmit = useOryFormSubmit()
  const methods = useFormContext()

  return (
    <Card.SettingsSection
      action={flowContainer.flow.ui.action}
      method={flowContainer.flow.ui.method}
      onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}
      {...rest}
    >
      {children}
    </Card.SettingsSection>
  )
}
