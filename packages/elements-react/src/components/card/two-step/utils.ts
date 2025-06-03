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

function isScreenSelectionNode(node: UiNode) {
  if (
    "name" in node.attributes &&
    node.attributes.name === "screen" &&
    "value" in node.attributes &&
    node.attributes.value === "previous"
  ) {
    return true
  }
  if (
    node.group === UiNodeGroupEnum.IdentifierFirst &&
    "name" in node.attributes &&
    node.attributes.name === "identifier" &&
    node.attributes.type === "hidden"
  ) {
    return true
  }
  return false
}

export function isChoosingMethod(
  flow: LoginFlowContainer | RegistrationFlowContainer,
): boolean {
  if (flow.flowType === FlowType.Login) {
    if (flow.flow.requested_aal === "aal2") {
      return true
    }
    if (
      flow.flow.refresh &&
      // TODO: Once https://github.com/ory/kratos/issues/4194 is fixed, this can be removed
      // Without this, we show the method chooser, and an email input, which looks weird
      !flow.flow.ui.nodes.some((n) => n.group === "code")
    ) {
      return true
    }
  }
  return flow.flow.ui.nodes.some(isScreenSelectionNode)
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
