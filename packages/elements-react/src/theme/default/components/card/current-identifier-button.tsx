// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  isUiNodeInputAttributes,
  UiNode,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { useOryFlow } from "@ory/elements-react"
import IconArrowLeft from "../../assets/icons/arrow-left.svg"
import { omit } from "../../utils/attributes"
import { restartFlowUrl } from "../../utils/url"
import { findScreenSelectionButton } from "../../../../util/nodes"
import { useFormContext } from "react-hook-form"

export function DefaultCurrentIdentifierButton() {
  const { flow, flowType, config, formState } = useOryFlow()
  const { setValue } = useFormContext()
  const ui = flow.ui

  if (formState.current === "provide_identifier") {
    return null
  }

  if (flowType === FlowType.Login && flow.requested_aal === "aal2") {
    return null
  }

  const nodeBackButton = getBackButtonNode(flowType, ui.nodes)
  if (!nodeBackButton) {
    return null
  }
  const initFlowUrl = restartFlowUrl(
    flow,
    `${config.sdk.url}/self-service/${flowType}/browser`,
  )

  const attributes = omit(nodeBackButton, [
    "autocomplete",
    "node_type",
    "maxlength",
  ])

  const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)

  if (screenSelectionNode) {
    // Kill me. Without this, the form will lose the user input data. Therefore, we need to hack around
    // adding this data here.
    return (
      <form action={flow.ui.action} method={flow.ui.method}>
        {flow.ui.nodes
          .filter((n) => {
            if (isUiNodeInputAttributes(n.attributes)) {
              return n.attributes.type === "hidden"
            }
            return false
          })
          .map((n: UiNode) => {
            const attrs = n.attributes as UiNodeInputAttributes
            return (
              <input
                key={attrs.name}
                type="hidden"
                name={attrs.name}
                value={attrs.value}
              />
            )
          })}
        <button
          className={
            "group inline-flex max-w-full cursor-pointer items-center gap-1 self-start rounded-identifier border px-[11px] py-[5px] transition-colors " +
            "border-button-identifier-border-border-default bg-button-identifier-background-default hover:border-button-identifier-border-border-hover hover:bg-button-identifier-background-hover"
          }
          {...attributes}
          type={"submit"}
          onClick={() => {
            setValue(
              screenSelectionNode.attributes.name,
              screenSelectionNode.attributes.value,
            )
            setValue("method", "profile")
          }}
          name={screenSelectionNode.attributes.name}
          value={screenSelectionNode.attributes.value}
          title={`Adjust ${nodeBackButton?.value}`}
          data-testid={"ory/screen/login/action/restart"}
        >
          <span className="inline-flex min-h-5 items-center gap-2 overflow-hidden text-ellipsis">
            <IconArrowLeft
              size={16}
              stroke="1"
              className="shrink-0 text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover"
            />
            <span className="overflow-hidden text-ellipsis text-nowrap text-sm font-medium text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover">
              {nodeBackButton?.value}
            </span>
          </span>
        </button>
      </form>
    )
  }

  return (
    <a
      className={
        "group inline-flex max-w-full cursor-pointer items-center gap-1 self-start rounded-identifier border px-[11px] py-[5px] transition-colors " +
        "border-button-identifier-border-border-default bg-button-identifier-background-default hover:border-button-identifier-border-border-hover hover:bg-button-identifier-background-hover"
      }
      {...attributes}
      href={initFlowUrl}
      title={`Adjust ${nodeBackButton?.value}`}
      data-testid={"ory/screen/login/action/restart"}
    >
      <span className="inline-flex min-h-5 items-center gap-2 overflow-hidden text-ellipsis">
        <IconArrowLeft
          size={16}
          stroke="1"
          className="shrink-0 text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover"
        />
        <span className="overflow-hidden text-ellipsis text-nowrap text-sm font-medium text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover">
          {nodeBackButton?.value}
        </span>
      </span>
    </a>
  )
}

export function getBackButtonNode(
  flowType: FlowType,
  nodes: UiNode[],
): UiNodeInputAttributes | undefined {
  let nodeBackButtonAttributes: UiNodeInputAttributes | undefined
  switch (flowType) {
    case FlowType.Login:
      nodeBackButtonAttributes = nodes.find(
        (node) =>
          "name" in node.attributes &&
          node.attributes.name === "identifier" &&
          ["default", "identifier_first"].includes(node.group),
      )?.attributes as UiNodeInputAttributes | undefined
      break
    case FlowType.Registration:
      nodeBackButtonAttributes = guessRegistrationBackButton(nodes)
      break
    case FlowType.Recovery:
    case FlowType.Verification:
      // Re-use the email node for displaying the email
      nodeBackButtonAttributes = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          n.attributes.name === "email",
      )?.attributes as UiNodeInputAttributes | undefined
      break
  }

  if (
    nodeBackButtonAttributes?.node_type !== "input" ||
    !nodeBackButtonAttributes.value
  ) {
    return undefined
  }

  return nodeBackButtonAttributes
}

const backButtonCandiates = [
  "traits.email",
  "traits.username",
  "traits.phone_number",
]
/**
 * Guesses the back button for registration flows
 *
 * This is based on the list above, and the first node that matches the criteria is returned.
 *
 * The list is most likely not exhaustive yet, and may need to be updated in the future.
 *
 */
function guessRegistrationBackButton(
  uiNodes: UiNode[],
): UiNodeInputAttributes | undefined {
  return uiNodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      backButtonCandiates.includes(node.attributes.name) &&
      node.group === "default",
  )?.attributes as UiNodeInputAttributes | undefined
}
