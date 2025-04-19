// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "@ory/elements-react"
import { useFormContext } from "react-hook-form"
import { UiNodeGroupEnum } from "@ory/client-fetch"
import { isGroupImmediateSubmit } from "../../../theme/default/utils/form"

type AuthMethodListProps = {
  options: AuthMethodOptions
  setSelectedGroup: (group: UiNodeGroupEnum) => void
}

export type AuthMethodOption = {
  title?: { id: string; values?: Record<string, string> }
}

export type AuthMethodOptions = Partial<
  Record<UiNodeGroupEnum, AuthMethodOption>
>

export function AuthMethodList({
  options,
  setSelectedGroup,
}: AuthMethodListProps) {
  const { Card } = useComponents()
  const { setValue, getValues } = useFormContext()

  if (Object.entries(options).length === 0) {
    return null
  }

  const handleClick = (group: UiNodeGroupEnum, options?: AuthMethodOption) => {
    if (isGroupImmediateSubmit(group)) {
      // Required because identifier node is not always defined with code method in aal2
      if (
        group === "code" &&
        !getValues("identifier") &&
        options?.title?.values?.address
      ) {
        setValue("identifier", options?.title?.values?.address)
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
      {Object.entries(options).map(([group, options]) => (
        <Card.AuthMethodListItem
          key={group}
          group={group}
          title={options.title}
          onClick={() => handleClick(group as UiNodeGroupEnum, options)}
        />
      ))}
    </Card.AuthMethodListContainer>
  )
}
