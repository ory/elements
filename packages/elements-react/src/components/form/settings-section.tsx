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

/**
 * Props for the OrySettingsFormSection component.
 * This type extends the form element props but omits the `action`, `method`, and `onSubmit` properties.
 */
export type OrySettingsFormProps = Omit<
  ComponentPropsWithoutRef<"form">,
  "action" | "method" | "onSubmit"
>

/**
 * Props for the OrySettingsFormSection component.
 *
 * @inline
 * @hidden
 */
export interface OryFormSectionProps
  extends PropsWithChildren,
    OrySettingsFormProps {
  nodes?: UiNode[]
}

export interface OryCardSettingsSectionProps extends PropsWithChildren {
  action: string
  method: string
  onSubmit: FormEventHandler<HTMLFormElement>
}

/**
 * OrySettingsFormSection is a component that provides a form section for Ory settings.
 *
 * Can be used independently to render a form section with Ory nodes.
 *
 * @param props - The properties for the OrySettingsFormSection component.
 * @returns
 * @group Components
 */
export function OrySettingsFormSection({
  children,
  nodes,
  ...rest
}: OryFormSectionProps) {
  return (
    <OryFormProvider nodes={nodes}>
      <OrySettingsFormSectionInner {...rest}>
        {children}
      </OrySettingsFormSectionInner>
    </OryFormProvider>
  )
}

function OrySettingsFormSectionInner({
  children,
  ...rest
}: PropsWithChildren<OrySettingsFormProps>) {
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
