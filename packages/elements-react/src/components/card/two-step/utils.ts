// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import {
  LoginFlowContainer,
  RegistrationFlowContainer,
} from "../../../util/flowContainer"
import { isGroupImmediateSubmit } from "../../../theme/default/utils/form"
import { GroupedNodes, isUiNodeGroupEnum } from "../../../util/ui"
import { Dispatch } from "react"
import { FormStateAction } from "@ory/elements-react"

export function isChoosingMethod(
  flow: LoginFlowContainer | RegistrationFlowContainer,
): boolean {
  return (
    flow.flow.ui.nodes.some(
      (node) =>
        "name" in node.attributes &&
        node.attributes.name === "screen" &&
        "value" in node.attributes &&
        node.attributes.value === "previous",
    ) ||
    flow.flow.ui.nodes.some(
      (node) =>
        node.group === UiNodeGroupEnum.IdentifierFirst &&
        "name" in node.attributes &&
        node.attributes.name === "identifier" &&
        node.attributes.type === "hidden",
    ) ||
    (flow.flowType === FlowType.Login && flow.flow.requested_aal === "aal2")
  )
}

export function getFinalNodes(
  uniqueGroups: GroupedNodes,
  selectedGroup: UiNodeGroupEnum | undefined,
): UiNode[] {
  const selectedNodes: UiNode[] = selectedGroup
    ? (uniqueGroups[selectedGroup] ?? [])
    : []

  return [
    ...(uniqueGroups?.identifier_first ?? []),
    ...(uniqueGroups?.default ?? []),
    ...(uniqueGroups?.captcha ?? []),
  ]
    .flat()
    .filter(
      (node) => "type" in node.attributes && node.attributes.type === "hidden",
    )
    .concat(selectedNodes)
}

export const handleAfterFormSubmit =
  (dispatchFormState: Dispatch<FormStateAction>) => (method: unknown) => {
    if (typeof method !== "string" || !isUiNodeGroupEnum(method)) {
      return
    }

    if (isGroupImmediateSubmit(method)) {
      dispatchFormState({
        type: "action_select_method",
        method: method,
      })
    }
  }
