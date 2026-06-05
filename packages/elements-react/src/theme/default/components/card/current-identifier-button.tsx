// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  isUiNodeInputAttributes,
  type Session,
  type UiNode,
  type UiNodeInputAttributes,
} from "@ory/client-fetch"
import { useOryConfiguration, useOryFlow } from "@ory/elements-react"
import { useSession } from "@ory/elements-react/client"
import { useEffect, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { useFormContext } from "react-hook-form"
import { findScreenSelectionButton } from "../../../../util/nodes"
import { omitInputAttributes } from "../../../../util/omitAttributes"
import { isUiNodeInput } from "../../../../util/utilFixSDKTypesHelper"
import IconArrowLeft from "../../assets/icons/arrow-left.svg"
import { restartFlowUrl } from "../../utils/url"

/**
 * The `DefaultCurrentIdentifierButton` component renders a button that displays the current identifier
 *
 * The button can be used to restart the flow with the current identifier if appropriate.
 *
 * @returns
 * @group Components
 * @category Default Components
 */
export function DefaultCurrentIdentifierButton() {
  const { flow, flowType, formState } = useOryFlow()
  const { setValue, getValues, watch } = useFormContext()
  const [turnstileResponse, setTurnstileResponse] = useState<
    string | undefined
  >()
  const config = useOryConfiguration()
  const { session } = useSession()
  const ui = flow.ui

  // This workaround ensures that the screen/back button functions correctly. Without it, the button does not work as expected.
  // The `captcha_turnstile_response` value cannot be accessed directly via `transient_payload.captcha_turnstile_response`
  // in the form context, likely due to the way React Hook Form manages its internal state and transient payloads.
  // By using the `watch` function, we can observe changes to the `transient_payload` and retrieve the captcha response value.
  const captchaVerificationValue = watch("transient_payload")
    ?.captcha_turnstile_response as string | undefined
  useEffect(() => {
    if (captchaVerificationValue) {
      setTurnstileResponse(captchaVerificationValue)
    }
  }, [captchaVerificationValue])

  if (formState.current === "provide_identifier") {
    return null
  }

  const nodeBackButton = getBackButtonNodeAttributes(flowType, ui.nodes)

  // On refresh and second factor login screens, show the current identifier as
  // a non-interactive indicator (no arrow, no navigation). The user cannot
  // change the identifier mid-flow, but they still need to see which account
  // they are authenticating as. The identifier is read from the flow's hidden
  // `identifier` node when present (e.g. refresh with password/code) and falls
  // back to the authenticated session's identity when the flow carries none
  // (e.g. the initial 2FA screen for totp or lookup secret).
  if (
    flowType === FlowType.Login &&
    (flow.requested_aal === "aal2" || flow.refresh)
  ) {
    const identifier =
      nodeBackButton?.value ||
      identifierFromUiNodes(ui.nodes) ||
      identifierFromSession(session)
    if (!identifier) {
      return null
    }
    return (
      <span
        className={
          "inline-flex max-w-full items-center gap-1 self-start rounded-identifier border border-button-identifier-border-border-default bg-button-identifier-background-default px-[11px] py-[5px]"
        }
        data-testid={`ory/screen/${flowType}/current-identifier`}
      >
        <span className="inline-flex min-h-5 items-center gap-2 overflow-hidden text-ellipsis">
          <span className="overflow-hidden text-sm font-medium text-nowrap text-ellipsis text-button-identifier-foreground-default">
            {identifier}
          </span>
        </span>
      </span>
    )
  }

  if (!nodeBackButton) {
    return null
  }

  const initFlowUrl = restartFlowUrl(
    flow,
    `${config.sdk.url}/self-service/${flowType}/browser`,
  )

  const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)
  if (screenSelectionNode) {
    // This is bad and needs refactoring. Instead of a custom form, it should use react-hook-form
    // to submit the values so we don't have to creat a fake form with fake submit values. It
    // also hard-reloads the flow and we need the ugly captcha workaround.
    return (
      <form action={flow.ui.action} method={flow.ui.method}>
        {flow.ui.nodes
          .filter((n) => {
            if (isUiNodeInputAttributes(n.attributes)) {
              return (
                n.attributes.type === "hidden" &&
                ["default", "captcha"].includes(n.group)
              )
            }
            return false
          })
          .map((n: UiNode) => {
            const attrs = n.attributes as UiNodeInputAttributes
            let value = getValues(attrs.name) || attrs.value

            // Of course turnstile works a bit differently because it uses transient_payload
            // to carry over information. So yeah, we need a special decode here.
            if (
              attrs.name === "transient_payload.captcha_turnstile_response" &&
              turnstileResponse
            ) {
              value = turnstileResponse
            }

            return (
              <input
                key={attrs.name}
                type="hidden"
                name={attrs.name}
                value={value}
              />
            )
          })}
        <button
          className={
            "group inline-flex max-w-full cursor-pointer items-center gap-1 self-start rounded-identifier border border-button-identifier-border-border-default bg-button-identifier-background-default px-[11px] py-[5px] transition-colors hover:border-button-identifier-border-border-hover hover:bg-button-identifier-background-hover"
          }
          {...omitInputAttributes(nodeBackButton)}
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
          title={
            nodeBackButton.value ? `Adjust ${nodeBackButton.value}` : `Back`
          }
          data-testid={`ory/screen/${flowType}/action/restart`}
        >
          <span className="inline-flex min-h-5 items-center gap-2 overflow-hidden text-ellipsis">
            <IconArrowLeft
              size={16}
              stroke="1"
              className="shrink-0 text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover"
            />
            <span className="overflow-hidden text-sm font-medium text-nowrap text-ellipsis text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover">
              {nodeBackButton.value ? nodeBackButton.value : "Back"}
            </span>
          </span>
        </button>
      </form>
    )
  }

  return (
    <a
      className={
        "group inline-flex max-w-full cursor-pointer items-center gap-1 self-start rounded-identifier border border-button-identifier-border-border-default bg-button-identifier-background-default px-[11px] py-[5px] transition-colors hover:border-button-identifier-border-border-hover hover:bg-button-identifier-background-hover"
      }
      {...omitInputAttributes(nodeBackButton)}
      href={initFlowUrl}
      title={`Adjust ${nodeBackButton?.value}`}
      data-testid={`ory/screen/${flowType}/action/restart`}
    >
      <span className="inline-flex min-h-5 items-center gap-2 overflow-hidden text-ellipsis">
        <IconArrowLeft
          size={16}
          stroke="1"
          className="shrink-0 text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover"
        />
        <span className="overflow-hidden text-sm font-medium text-nowrap text-ellipsis text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover">
          {nodeBackButton?.value}
        </span>
      </span>
    </a>
  )
}

export function getBackButtonNodeAttributes(
  flowType: FlowType,
  nodes: UiNode[],
): UiNodeInputAttributes | undefined {
  let nodeBackButtonAttributes: UiNodeInputAttributes | undefined
  switch (flowType) {
    case FlowType.Login:
      nodeBackButtonAttributes = nodes.find(
        (node) =>
          isUiNodeInputAttributes(node.attributes) &&
          node.attributes.name === "identifier" &&
          ["default", "identifier_first"].includes(node.group),
      )?.attributes as UiNodeInputAttributes | undefined
      break
    case FlowType.Registration:
      nodeBackButtonAttributes = guessRegistrationBackButton(nodes)
      break
    case FlowType.Recovery:
      nodeBackButtonAttributes = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          !!n.attributes.value &&
          ["email", "recovery_confirm_address", "recovery_address"].includes(
            n.attributes.name,
          ),
      )?.attributes as UiNodeInputAttributes | undefined
      break
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
    !nodeBackButtonAttributes?.value
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
export function guessRegistrationBackButton(
  uiNodes: UiNode[],
): UiNodeInputAttributes | undefined {
  return uiNodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      backButtonCandiates.includes(node.attributes.name) &&
      node.group === "default",
  )?.attributes as UiNodeInputAttributes | undefined
}

// Resolves the identifier from any input node named `identifier` on the flow,
// regardless of group. Used by the read-only current-identifier indicator on
// refresh and second factor screens, where the identifier may be present in
// groups other than `default` or `identifier_first` (for example, the `code`
// group on the 2FA code-sent screen).
function identifierFromUiNodes(nodes: UiNode[]): string | undefined {
  for (const node of nodes) {
    if (isUiNodeInput(node) && node.attributes.name === "identifier") {
      const value = node.attributes.value
      if (typeof value === "string" && value.length > 0) {
        return value
      }
    }
  }
  return undefined
}

// Resolves a human-readable identifier (email, phone number, or username) from
// the authenticated session's identity traits. Used as a fallback for the
// current-identifier indicator on login screens where the flow itself does not
// carry the identifier (for example, the initial second factor screens).
function identifierFromSession(
  session: Session | null | undefined,
): string | undefined {
  const traits = session?.identity?.traits
  if (!traits || typeof traits !== "object") {
    return undefined
  }
  const t = traits as Record<string, unknown>
  for (const key of ["email", "phone_number", "username"]) {
    const value = t[key]
    if (typeof value === "string" && value.length > 0) {
      return value
    }
  }
  return undefined
}
