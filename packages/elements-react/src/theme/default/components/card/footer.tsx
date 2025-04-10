// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNodeInputAttributes } from "@ory/client-fetch"
import { ConsentFlow, useComponents, useOryFlow } from "@ory/elements-react"
import { useIntl } from "react-intl"
import { initFlowUrl, restartFlowUrl } from "../../utils/url"
import { findNode, nodesToAuthMethodGroups } from "../../../../util/ui"
import { findScreenSelectionButton } from "../../../../util/nodes"

export function DefaultCardFooter() {
  const oryFlow = useOryFlow()
  switch (oryFlow.flowType) {
    case FlowType.Login:
      return <LoginCardFooter />
    case FlowType.Registration:
      return <RegistrationCardFooter />
    case FlowType.Recovery:
      return <RecoveryCardFooter />
    case FlowType.Verification:
      return <VerificationCardFooter />
    case FlowType.OAuth2Consent:
      return <ConsentCardFooter flow={oryFlow.flow} />
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

  if (flowType === FlowType.Login && flow.refresh) {
    return null
  }

  return (
    <>
      {formState.current === "provide_identifier" &&
        config.project.registration_enabled && (
          <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
            {intl.formatMessage({
              id: "login.registration-label",
              defaultMessage: "No account?",
            })}{" "}
            <a
              className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
              href={initFlowUrl(config.sdk.url, "registration", flow)}
              data-testid={"ory/screen/login/action/register"}
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
            data-testid={"ory/screen/login/mfa/action/selectMethod"}
          >
            {intl.formatMessage({
              id: "login.2fa.method.go-back",
            })}
          </a>
        </span>
      )}
      {/* special case for code auth method */}
      {authMethods.length === 1 &&
        authMethods[0] === "code" &&
        formState.current === "method_active" && (
          <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
            <a
              className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
              href={restartFlowUrl(
                flow,
                `${config.sdk.url}/self-service/${flowType}/browser`,
              )}
              data-testid={"ory/screen/login/mfa/action/reauthenticate"}
            >
              {intl.formatMessage({
                id: "login.2fa.go-back.link",
              })}
            </a>
          </span>
        )}
      {flowType === FlowType.Login &&
        flow.requested_aal === "aal2" &&
        (formState.current === "select_method" || authMethods.length === 0) && (
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
              data-testid={"ory/screen/login/mfa/action/reauthenticate"}
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

function RegistrationCardFooter() {
  const intl = useIntl()
  const { config, flow, formState } = useOryFlow()

  const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)
  switch (formState.current) {
    case "method_active":
      return (
        <span className="font-normal leading-normal antialiased">
          {screenSelectionNode && (
            <a
              className="font-medium text-button-link-brand-brand hover:text-button-link-brand-brand-hover"
              href=""
            >
              {intl.formatMessage({
                id: "card.footer.select-another-method",
                defaultMessage: "Select another method",
              })}
            </a>
          )}
        </span>
      )
    case "select_method":
    default:
      return (
        <span className="font-normal leading-normal antialiased">
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
        </span>
      )
  }
}

function RecoveryCardFooter() {
  return null
}

function VerificationCardFooter() {
  return null
}

type ConsentFlowProps = {
  flow: ConsentFlow
}

function ConsentCardFooter({ flow }: ConsentFlowProps) {
  const { Node } = useComponents()

  const rememberNode = findNode(flow.ui.nodes, {
    group: "oauth2_consent",
    node_type: "input",
    name: "remember",
  })

  return (
    <div className="flex gap-8 flex-col">
      <div>
        <p className="text-interface-foreground-default-secondary leading-normal font-medium">
          Make sure you trust {flow.consent_request.client?.client_name}
        </p>
        <p className="text-interface-foreground-default-secondary leading-normal">
          You may be sharing sensitive information with this site or
          application.
        </p>
      </div>
      {rememberNode && (
        <Node.Checkbox
          attributes={rememberNode.attributes}
          node={rememberNode}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {flow.ui.nodes
          .filter(
            (n) =>
              n.attributes.node_type === "input" &&
              n.attributes.type === "submit",
          )
          .map((n) => {
            const attributes = n.attributes as UiNodeInputAttributes
            return (
              <Node.Button
                key={attributes.value}
                node={n}
                attributes={attributes}
              />
            )
          })}
      </div>
      <p className="text-sm">
        <span className="text-interface-foreground-default-tertiary">
          Authorizing will redirect to{" "}
        </span>
        {flow.consent_request.client?.client_name}
      </p>
    </div>
  )
}
