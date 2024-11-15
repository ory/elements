import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { useOryFlow } from "../../context"
import { FormProvider, useForm } from "react-hook-form"
import { computeDefaultValues } from "./form-helpers"

export function OryFormProvider({
  children,
  nodes,
}: PropsWithChildren & { nodes?: UiNode[] }) {
  const flowContainer = useOryFlow()
  const defaultNodes = nodes
    ? flowContainer.flow.ui.nodes
        .filter((node) => node.group === UiNodeGroupEnum.Default)
        .concat(nodes)
    : flowContainer.flow.ui.nodes

  const methods = useForm({
    // TODO: Generify this, so we have typesafety in the submit handler.
    defaultValues: computeDefaultValues(defaultNodes),
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}
