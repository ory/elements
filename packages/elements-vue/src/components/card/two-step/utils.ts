// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import type { OryFlowContainer } from "../../../util/flowContainer"
import { isUiNodeGroupEnum, type GroupedNodes } from "../../../util/ui"
import type { FormStateAction } from "../../../composables/useOryFlow"

export type AuthMethodOptions = Partial<
  Record<
    UiNodeGroupEnum,
    {
      title?: {
        id: string
        values?: Record<string, string>
      }
    }
  >
>

/**
 * Convert visible groups to auth method picker options
 */
export function toAuthMethodPickerOptions(
  visibleGroups: GroupedNodes,
): AuthMethodOptions {
  return Object.fromEntries(
    Object.values(UiNodeGroupEnum)
      .filter((group) => visibleGroups[group]?.length)
      .filter(
        (group) =>
          !(
            [
              UiNodeGroupEnum.Oidc,
              UiNodeGroupEnum.Saml,
              UiNodeGroupEnum.Default,
              UiNodeGroupEnum.IdentifierFirst,
              UiNodeGroupEnum.Profile,
              UiNodeGroupEnum.Captcha,
            ] as UiNodeGroupEnum[]
          ).includes(group),
      )
      .map((g) => [g, {}]),
  )
}

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

/**
 * Check if the flow is in choosing method state
 */
export function isChoosingMethod(flow: OryFlowContainer): boolean {
  if (flow.flowType === FlowType.Login) {
    const loginFlow = flow.flow as { requested_aal?: string; refresh?: boolean }
    if (loginFlow.requested_aal === "aal2") {
      return true
    }
    if (
      loginFlow.refresh &&
      !flow.flow.ui.nodes.some((n) => n.group === "code")
    ) {
      return true
    }
  }
  return flow.flow.ui.nodes.some(isScreenSelectionNode)
}

/**
 * Get the final nodes to display based on the selected group
 */
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

/**
 * Check if a group should trigger immediate submit
 */
export function isGroupImmediateSubmit(group: string) {
  return group === "code"
}

/**
 * Handle after form submit - dispatches form state if method needs immediate submit
 */
export function handleAfterFormSubmit(
  dispatchFormState: (action: FormStateAction) => void,
) {
  return (method: unknown) => {
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
}
