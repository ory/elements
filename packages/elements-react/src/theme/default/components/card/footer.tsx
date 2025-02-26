// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useOryFlow } from "@ory/elements-react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { initFlowUrl, restartFlowUrl } from "../../utils/url"
import { nodesToAuthMethodGroups } from "../../../../util/ui"

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

export function getReturnToQueryParam(flow: { return_to?: string }) {
  if (flow.return_to) {
    return flow.return_to
  }
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get("return_to")
  }
}

function LoginCardFooter() {
  const { config, formState, flow, flowType } = useOryFlow()
  const intl = useIntl()

  const authMethods = nodesToAuthMethodGroups(flow.ui.nodes)

  console.log(flow.ui.nodes, authMethods.length, formState.current)

  return (
    <>
      {formState.current === "provide_identifier" && (
        <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
          {intl.formatMessage({
            id: "login.registration-label",
            defaultMessage: "No account?",
          })}{" "}
          <a
            className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
            href={initFlowUrl(config.sdk.url, "registration", flow)}
            data-testid={"ory/screen/registration/action/login"}
          >
            {intl.formatMessage({
              id: "login.registration-button",
              defaultMessage: "Sign up",
            })}
          </a>
        </span>
      )}
      {authMethods.length > 1 && formState.current === "method_active" && (
        <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
          <a
            className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
            href=""
            data-testid={"ory/screen/registration/action/login"}
          >
            {intl.formatMessage({
              id: "login.2fa.method.go-back",
            })}
          </a>
        </span>
      )}
      {flowType === FlowType.Login &&
        flow.requested_aal === "aal2" &&
        formState.current === "select_method" && (
          <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
            {intl.formatMessage({
              id: "login.2fa.go-back",
            })}{" "}
            <a
              className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
              href={restartFlowUrl(
                flow,
                `${config.sdk.url}/self-service/${flowType}/browser`,
              )}
              data-testid={"ory/screen/registration/action/login"}
            >
              {intl.formatMessage({
                id: "login.2fa.go-back.link",
              })}
            </a>
          </span>
        )}
    </>
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
  const { config, flow, formState } = useOryFlow()
  const { setValue } = useFormContext()

  if (formState.current === "select_method") {
    return null
  }
  const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)

  function handleScreenSelection() {
    setValue("method", "profile")
    if (screenSelectionNode) {
      setValue("screen", "credential-selection")
    }
  }

  return (
    <span className="font-normal leading-normal antialiased">
      {formState.current === "method_active" ? (
        <>
          {screenSelectionNode && (
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
            href={initFlowUrl(config.sdk.url, "login", flow)}
            data-testid={"ory/screen/registration/action/login"}
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

function RecoveryCardFooter() {
  return null
}

function VerificationCardFooter() {
  return null
}
