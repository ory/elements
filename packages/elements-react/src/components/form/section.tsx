import { PropsWithChildren } from "react"
import { useComponents } from "../../context/component"
import { OryForm } from "./form"
import { UiNode } from "@ory/client-fetch"

export type OryFormSectionProps = PropsWithChildren<{
  nodes?: UiNode[]
}>

export function OryFormSection({ children, nodes }: OryFormSectionProps) {
  const { Settings } = useComponents()

  return (
    <OryForm nodes={nodes}>
      <Settings.Section>{children}</Settings.Section>
    </OryForm>
  )
}
