// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents, useOryFlow } from "@ory/elements-react"
import { useFormContext } from "react-hook-form"
import { UiNodeGroupEnum } from "@ory/client-fetch"
import { isGroupImmediateSubmit } from "../../../theme/default/utils/form"
import { findCodeIdentifierNode } from "../../../util/ui"

type AuthMethodListProps = {
  options: UiNodeGroupEnum[]
  setSelectedGroup: (group: UiNodeGroupEnum) => void
}

export function AuthMethodList({
  options,
  setSelectedGroup,
}: AuthMethodListProps) {
  const { Card } = useComponents()
  const { setValue, getValues, formState } = useFormContext()
  const { formState: oryFormState, flow } = useOryFlow()

  if (options.length === 0) {
    return null
  }

  const handleClick = (group: UiNodeGroupEnum) => {
    if (isGroupImmediateSubmit(group)) {
      // Required because identifier node is not always defined with code method in aal2
      if (group === "code" && !getValues("identifier")) {
        const identifier = findCodeIdentifierNode(flow.ui.nodes)
        if (identifier) {
          setValue("identifier", identifier.attributes.value)
        }
      }
      // If the method is "immediate submit" (e.g. the method's submit button should be triggered immediately)
      // then the method needs to be added to the form data.
      setValue("method", group)
    } else {
      setSelectedGroup(group)
    }
  }

  return (
    <Card.AuthMethodListContainer>
      {options.map((group) => (
        <Card.AuthMethodListItem
          key={group}
          group={group}
          onClick={() => handleClick(group)}
          disabled={
            !formState.isReady ||
            !oryFormState.isReady ||
            formState.isSubmitting
          }
        />
      ))}
    </Card.AuthMethodListContainer>
  )
}
