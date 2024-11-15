// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode } from "@ory/client-fetch"
import { useOryFlow } from "@ory/elements-react"
import IconArrowLeft from "../../assets/icons/arrow-left.svg"

export function DefaultCurrentIdentifierButton() {
  const {
    flow: { ui },
    flowType,
    config,
    formState,
  } = useOryFlow()

  if (formState.current === "provide_identifier") {
    return null
  }

  let nodeBackButton: UiNode | undefined
  switch (flowType) {
    case FlowType.Login:
      nodeBackButton = ui.nodes.find(
        (node) =>
          "name" in node.attributes &&
          node.attributes.name === "identifier" &&
          node.group === "identifier_first",
      )
      break
    case FlowType.Registration:
      nodeBackButton = guessRegistrationBackButton(ui.nodes)
      break
    case FlowType.Recovery:
    case FlowType.Verification:
      // Re-use the email node for displaying the email
      nodeBackButton = ui.nodes.find(
        (n) => "name" in n.attributes && n.attributes.name === "email",
      )
      break
  }

  if (
    nodeBackButton?.attributes.node_type !== "input" ||
    !nodeBackButton.attributes.value
  ) {
    return null
  }
  const initFlowUrl = `${config.sdk.url}/self-service/${flowType}/browser`

  return (
    <div>
      <a
        className="cursor-pointer py-1.5 px-3 rounded-full border border-button-identifier-border-default bg-button-identifier-bg-default hover:border-button-identifier-border-hover hover:bg-button-identifier-bg-hover transition-colors inline-flex gap-1 items-center"
        {...nodeBackButton.attributes}
        href={initFlowUrl}
        title={`Adjust ${nodeBackButton?.attributes.value}`}
      >
        <IconArrowLeft size={16} className="text-button-identifier-fg-subtle" />
        <span className="text-sm font-medium leading-none  text-button-identifier-fg-default text-ellipsis overflow-hidden text-nowrap">
          {nodeBackButton?.attributes.value}
        </span>
      </a>
    </div>
  )
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
function guessRegistrationBackButton(uiNodes: UiNode[]): UiNode | undefined {
  return uiNodes.find(
    (node) =>
      "name" in node.attributes &&
      backButtonCandiates.includes(node.attributes.name) &&
      node.group === "default",
  )
}
