import { PropsWithChildren } from "react"
import { useComponents } from "../../context/component"
import { OryForm } from "./form"
import { UiNode } from "@ory/client-fetch"

export type OryFormSectionProps = PropsWithChildren<{
  nodes?: UiNode[]
}>

export function OryFormSection({ children, nodes }: OryFormSectionProps) {
  const {} = useComponents()

  return (
    <OryForm nodes={nodes}>
      <FormSection>{children}</FormSection>
    </OryForm>
  )
}
