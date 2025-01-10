// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useOryFlow } from "@ory/elements-react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"

export function DefaultCardFooter() {
  const { flowType } = useOryFlow()
  switch (flowType) {
    case FlowType.Login:
      return <LoginCardFooter />
    case FlowType.Registration:
      return <RegistrationCardFooter />
    case FlowType.Recovery:
      return <RecoveryCardFooter />
    case FlowType.Verification:
      return <VerificationCardFooter />
    default:
      return null
  }
}

function LoginCardFooter() {
  const { config, formState, initFlowUrl } = useOryFlow()
  const intl = useIntl()

  if (
    !config.project.registration_enabled ||
    formState.current !== "provide_identifier"
  ) {
    // The two-step login flow does not support the "navigation" between steps, so we don't have
    // anything to render on the footer in those steps
    return null
  }

  return (
    <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
      {intl.formatMessage({
        id: "login.registration-label",
        defaultMessage: "No account?",
      })}{" "}
      <a
        className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
        href={initFlowUrl(FlowType.Registration)}
      >
        {intl.formatMessage({
          id: "login.registration-button",
          defaultMessage: "Sign up",
        })}
      </a>
    </span>
  )
}

function findScreenSelectionButton(
  nodes: UiNode[],
): { attributes: UiNodeInputAttributes } | undefined {
  return nodes.find(
    (node) =>
      node.attributes.node_type === "input" &&
      node.attributes.type === "submit" &&
      node.attributes.name === "screen",
  ) as { attributes: UiNodeInputAttributes }
}

function RegistrationCardFooter() {
  const intl = useIntl()
  const { flow, formState, initFlowUrl } = useOryFlow()
  if (formState.current === "select_method") {
    return null
  }
  const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)

  return (
    <span className="font-normal leading-normal antialiased">
      {formState.current === "method_active" ? (
        <>
          {screenSelectionNode && (
            <SelectScreenButton screenSelectionNode={screenSelectionNode} />
          )}
        </>
      ) : (
        <>
          {intl.formatMessage({
            id: "registration.login-label",
            defaultMessage: "Already have an account?",
          })}{" "}
          <a
            className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
            href={initFlowUrl(FlowType.Login)}
          >
            {intl.formatMessage({
              id: "registration.login-button",
              defaultMessage: "Sign in",
            })}
          </a>
        </>
      )}
    </span>
  )
}

type SelectScreenButtonProps = {
  screenSelectionNode: { attributes: UiNodeInputAttributes }
}

function SelectScreenButton({ screenSelectionNode }: SelectScreenButtonProps) {
  const { setValue } = useFormContext()
  const intl = useIntl()

  function handleScreenSelection() {
    setValue("method", "profile")
    if (screenSelectionNode) {
      setValue("screen", "credential-selection")
    }
  }
  return (
    <button
      className="font-medium text-button-link-brand-brand hover:text-button-link-brand-brand-hover"
      type="submit"
      onClick={handleScreenSelection}
    >
      {intl.formatMessage({
        id: "card.footer.select-another-method",
        defaultMessage: "Select another method",
      })}
    </button>
  )
}

function RecoveryCardFooter() {
  return null
}

function VerificationCardFooter() {
  return null
}
