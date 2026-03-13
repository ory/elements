// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { PropsWithChildren, useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useOryFlow } from "../../context"
import { computeDefaultValues } from "./form-helpers"
import { useOryFormResolver } from "./form-resolver"
import { isNodeVisible } from "../../util/ui"
import { isUiNodeInput } from "../../util"

function pickAutofocusField(nodes: UiNode[]) {
  const node = nodes.find((node) => {
    return (
      isNodeVisible(node) &&
      (node.attributes.type === "text" ||
        node.attributes.type === "email" ||
        node.attributes.type === "password")
    )
  })
  if (!node || !isUiNodeInput(node)) {
    return undefined
  }
  return node.attributes.name
}

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
  const lastAutofocusField = useRef<string | null>(null)

  const methods = useForm({
    // TODO: Generify this, so we have typesafety in the submit handler.
    defaultValues: computeDefaultValues({
      active: flowContainer.flow.active,
      ui: { nodes: defaultNodes },
    }),
    resolver: useOryFormResolver(),
  })

  useEffect(() => {
    if (
      !flowContainer.formState.isReady ||
      flowContainer.flowType === FlowType.Settings
    ) {
      return
    }
    const field = pickAutofocusField(defaultNodes)
    if (!field) {
      return
    }

    if (lastAutofocusField.current !== field) {
      lastAutofocusField.current = field
      queueMicrotask(() => {
        methods.setFocus(field, { shouldSelect: true })
      })
    }
  }, [
    flowContainer.formState.isReady,
    flowContainer.flowType,
    methods.setFocus,
    defaultNodes,
    methods,
  ])

  return <FormProvider {...methods}>{children}</FormProvider>
}
