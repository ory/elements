// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useOryFlow } from "../../context"
import { computeDefaultValues } from "./form-helpers"
import { useOryFormResolver } from "./form-resolver"

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
    defaultValues: computeDefaultValues({
      active: flowContainer.flow.active,
      ui: { nodes: defaultNodes },
    }),
    resolver: useOryFormResolver(),
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}
